/**
 * Pure client-and-server-safe utilities for phone number normalization,
 * message formatting, and WhatsApp deep links.
 * Contains ZERO server or database dependencies.
 */

export function normalizeWhatsAppPhone(phone: string | null | undefined): string | null {
  if (!phone || typeof phone !== "string") return null;

  const trimmed = phone.trim();
  if (!trimmed) return null;

  // If number starts with +, strip it
  let clean = trimmed.replace(/^\+/, "").replace(/[\s\-\(\)\.]/g, "");

  // If all characters are not digits, invalid
  if (!/^\d+$/.test(clean)) return null;

  // Local Ghana number format (e.g. 055 247 1202 -> 10 digits starting with 0)
  if (clean.startsWith("0") && clean.length === 10) {
    clean = "233" + clean.slice(1);
  }

  // Must have at least 9 digits
  if (clean.length < 9) return null;

  return clean;
}

export function createWhatsAppDeepLink(
  phone: string | null | undefined,
  message: string
): string | null {
  const normalized = normalizeWhatsAppPhone(phone);
  if (!normalized) return null;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

export type WhatsAppPayload = {
  booking: {
    guestName?: string | null;
    guestPhone?: string | null;
    guestEmail?: string | null;
    eventType: string;
    eventDate: string;
    location: string;
    requirements?: string | null;
  };
  quote: {
    guestName?: string | null;
    guestPhone?: string | null;
    guestEmail?: string | null;
    eventType: string;
    eventDate: string;
    location: string;
    services?: string[];
    expectedAttendance?: number | null;
    requirements?: string | null;
  };
  contact: {
    name: string;
    email: string;
    phone?: string | null;
    subject: string;
    message: string;
  };
};

export function formatWhatsAppMessage<T extends keyof WhatsAppPayload>(
  type: T,
  payload: WhatsAppPayload[T]
): string {
  if (type === "booking") {
    const data = payload as WhatsAppPayload["booking"];
    return [
      `🚨 *NEW BOOKING REQUEST — Ravenous Studio*`,
      ``,
      `👤 *Client:* ${data.guestName || "Not provided"}`,
      `📞 *Phone:* ${data.guestPhone || "Not provided"}`,
      `✉️ *Email:* ${data.guestEmail || "Not provided"}`,
      `🎬 *Event Type:* ${data.eventType}`,
      `📅 *Date:* ${data.eventDate}`,
      `📍 *Location:* ${data.location}`,
      `📝 *Notes/Requirements:* ${data.requirements || "None specified"}`,
      ``,
      `_Sent from ravenousstudio.com booking portal_`,
    ].join("\n");
  }

  if (type === "quote") {
    const data = payload as WhatsAppPayload["quote"];
    const serviceList = data.services && data.services.length > 0 
      ? data.services.join(", ") 
      : "General services";

    return [
      `📋 *NEW QUOTE REQUEST — Ravenous Studio*`,
      ``,
      `👤 *Client:* ${data.guestName || "Not provided"}`,
      `📞 *Phone:* ${data.guestPhone || "Not provided"}`,
      `✉️ *Email:* ${data.guestEmail || "Not provided"}`,
      `🎪 *Event Type:* ${data.eventType}`,
      `📅 *Date:* ${data.eventDate}`,
      `📍 *Location:* ${data.location}`,
      `🛠 *Services Needed:* ${serviceList}`,
      `👥 *Attendance:* ${data.expectedAttendance ? `${data.expectedAttendance} guests` : "Not specified"}`,
      `📝 *Details:* ${data.requirements || "None specified"}`,
      ``,
      `_Sent from ravenousstudio.com quote portal_`,
    ].join("\n");
  }

  if (type === "contact") {
    const data = payload as WhatsAppPayload["contact"];
    return [
      `✉️ *NEW CONTACT MESSAGE — Ravenous Studio*`,
      ``,
      `👤 *Sender:* ${data.name}`,
      `📞 *Phone:* ${data.phone || "Not provided"}`,
      `✉️ *Email:* ${data.email}`,
      `🏷 *Subject:* ${data.subject}`,
      `💬 *Message:*`,
      `${data.message}`,
      ``,
      `_Sent from ravenousstudio.com contact form_`,
    ].join("\n");
  }

  return "New incoming request on Ravenous Studio.";
}
