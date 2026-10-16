/**
 * Transactional email service using Resend HTTP API.
 * Uses native fetch so it has zero heavy dependencies and runs seamlessly on Vercel.
 */

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendTransactionalEmail(payload: EmailPayload): Promise<{
  success: boolean;
  status: "sent" | "logged" | "failed";
  messageId?: string;
  error?: string;
}> {
  const apiKey = process.env.RESEND_API_KEY;

  // If Resend API key is missing or placeholder, log safely
  if (!apiKey || apiKey === "your_resend_api_key_here") {
    console.info(`[Email Service - Simulated] To: ${payload.to} | Subject: ${payload.subject}`);
    return {
      success: true,
      status: "logged",
    };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Ravenous Studio Production <notifications@ravenousstudioproduction.com>",
        to: [payload.to],
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.warn("[Resend API Error]", data);
      return {
        success: false,
        status: "failed",
        error: data.message || "Failed to send email via Resend",
      };
    }

    return {
      success: true,
      status: "sent",
      messageId: data.id,
    };
  } catch (err: any) {
    console.error("[Email Dispatch Exception]", err);
    return {
      success: false,
      status: "failed",
      error: err.message || "Unknown email dispatch error",
    };
  }
}

/**
 * Generates an executive, branded HTML email for booking status updates.
 */
export function generateStatusUpdateEmailHtml(data: {
  clientName: string;
  eventType: string;
  eventDate: string;
  location: string;
  status: string;
  total?: string;
}): string {
  const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    confirmed: { bg: "#dcfce7", text: "#166534", label: "CONFIRMED" },
    in_progress: { bg: "#f3e8ff", text: "#6b21a8", label: "IN PROGRESS" },
    completed: { bg: "#e0f2fe", text: "#0369a1", label: "COMPLETED" },
    cancelled: { bg: "#fee2e2", text: "#991b1b", label: "CANCELLED" },
    pending: { bg: "#fef9c3", text: "#854d0e", label: "PENDING" },
  };

  const currentStatus = statusColors[data.status] || {
    bg: "#f3f4f6",
    text: "#1f2937",
    label: data.status.toUpperCase(),
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Status Update</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #0b132b; padding: 30px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase;">
                RAVENOUS <span style="color: #e63946;">STUDIO</span>
              </h1>
              <p style="margin: 6px 0 0 0; color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em;">
                Premier Event Production & Media Coverage
              </p>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding: 40px;">
              <div style="display: inline-block; padding: 6px 14px; background-color: ${currentStatus.bg}; color: ${currentStatus.text}; border-radius: 9999px; font-weight: 700; font-size: 12px; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 20px;">
                Status: ${currentStatus.label}
              </div>

              <h2 style="margin: 0 0 16px 0; font-size: 22px; color: #0b132b; font-weight: 700;">
                Hello ${data.clientName || "Valued Client"},
              </h2>
              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #475569;">
                The status of your event booking with Ravenous Studio Production has been updated. Below are your latest booking details:
              </p>

              <!-- Event Details Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 20px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #64748b; width: 35%;"><strong>Event Type:</strong></td>
                  <td style="padding: 6px 0; font-size: 14px; color: #0f172a; font-weight: 600;">${data.eventType}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #64748b;"><strong>Event Date:</strong></td>
                  <td style="padding: 6px 0; font-size: 14px; color: #0f172a; font-weight: 600;">${data.eventDate}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #64748b;"><strong>Venue / Location:</strong></td>
                  <td style="padding: 6px 0; font-size: 14px; color: #0f172a; font-weight: 600;">${data.location}</td>
                </tr>
                ${data.total && Number(data.total) > 0 ? `
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #64748b;"><strong>Total:</strong></td>
                  <td style="padding: 6px 0; font-size: 14px; color: #0f172a; font-weight: 700;">GH₵${Number(data.total).toLocaleString()}</td>
                </tr>
                ` : `
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #64748b;"><strong>Pricing:</strong></td>
                  <td style="padding: 6px 0; font-size: 14px; color: #0f172a; font-weight: 600;">Details included in invoice upon request</td>
                </tr>
                `}
              </table>

              <!-- Next Steps / Payment Note -->
              <div style="background-color: #f1f5f9; border-left: 4px solid #e63946; padding: 15px; border-radius: 4px; margin-bottom: 25px;">
                <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #334155;">
                  <strong>Payment & Invoicing:</strong> Official Mobile Money and Bank Transfer payment details are available upon request and confirmed in your booking invoice.
                </p>
              </div>

              <p style="margin: 0 0 25px 0; font-size: 14px; line-height: 1.6; color: #475569;">
                Need to adjust your event schedule, add additional screens, or request live stream links? You can reply directly to this email or reach our production desk on WhatsApp.
              </p>

              <!-- CTA Buttons -->
              <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td align="center">
                    <a href="https://wa.me/233552471202" target="_blank" style="display: inline-block; background-color: #25d366; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin-right: 10px;">
                      Chat with Us on WhatsApp
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 25px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #94a3b8;">
                Ravenous Studio Production &middot; Madina Mayehot, Accra, Ghana
              </p>
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                Phone: 055 247 1202 / 054 050 0729 &middot; Hours: Mon - Fri 8am - 5pm, Sat 8am - 4pm
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
