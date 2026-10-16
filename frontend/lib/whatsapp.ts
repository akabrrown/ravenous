import { db } from "./db";
import { settings, notifications } from "./schema";
import { eq } from "drizzle-orm";
import { 
  normalizeWhatsAppPhone, 
  createWhatsAppDeepLink, 
  formatWhatsAppMessage,
  type WhatsAppPayload 
} from "./whatsapp-utils";

export { 
  normalizeWhatsAppPhone, 
  createWhatsAppDeepLink, 
  formatWhatsAppMessage,
  type WhatsAppPayload 
};

/**
 * Fetches the configured admin WhatsApp number from the settings table.
 * Defaults to client default '0552471202' if not configured.
 */
export async function getAdminWhatsAppConfig(): Promise<{
  phone: string;
  webhookUrl: string | null;
}> {
  try {
    const phoneRow = await db.query.settings.findFirst({
      where: eq(settings.key, "admin_whatsapp_phone"),
    });

    const webhookRow = await db.query.settings.findFirst({
      where: eq(settings.key, "admin_whatsapp_webhook_url"),
    });

    const rawPhone = phoneRow?.value ? String(phoneRow.value) : "0552471202";
    const webhookUrl = webhookRow?.value ? String(webhookRow.value) : null;

    return {
      phone: rawPhone,
      webhookUrl: webhookUrl && webhookUrl.startsWith("http") ? webhookUrl : null,
    };
  } catch (err) {
    console.error("Failed to fetch admin whatsapp config from db:", err);
    return {
      phone: "0552471202",
      webhookUrl: null,
    };
  }
}

/**
 * Records the notification in the database, sends automated webhook if configured,
 * and generates the client-facing direct WhatsApp deep link.
 */
export async function sendAdminWhatsAppNotification<T extends keyof WhatsAppPayload>(
  type: T,
  payload: WhatsAppPayload[T]
): Promise<{
  success: boolean;
  whatsappUrl: string | null;
  message: string;
}> {
  const config = await getAdminWhatsAppConfig();
  const cleanPhone = normalizeWhatsAppPhone(config.phone);
  const message = formatWhatsAppMessage(type, payload);
  const whatsappUrl = cleanPhone ? createWhatsAppDeepLink(cleanPhone, message) : null;

  let deliveryStatus = "logged";

  // If automated webhook gateway is configured, dispatch HTTP POST
  if (config.webhookUrl) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(config.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: cleanPhone,
          message,
          type: `whatsapp_${type}`,
          payload,
          timestamp: new Date().toISOString(),
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        deliveryStatus = "sent";
      } else {
        deliveryStatus = "webhook_failed";
      }
    } catch (e) {
      console.warn("Automated WhatsApp webhook error (non-fatal):", e);
      deliveryStatus = "webhook_failed";
    }
  }

  // Persist notification log into the notifications table
  try {
    await db.insert(notifications).values({
      type: `whatsapp_${type}`,
      recipient: cleanPhone || config.phone || "unconfigured",
      payload: {
        type,
        summary: message.split("\n")[0],
        message,
        payload,
        whatsappUrl,
      },
      status: deliveryStatus,
      sentAt: deliveryStatus === "sent" ? new Date() : null,
    });
  } catch (err) {
    console.error("Failed to log notification to database:", err);
  }

  return {
    success: true,
    whatsappUrl,
    message,
  };
}
