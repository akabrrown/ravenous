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

export type ClientStatusPayload = {
  clientName?: string | null;
  eventType: string;
  eventDate: string;
  location?: string | null;
  total?: string | null;
  note?: string | null;
};

/**
 * Formats a client-facing WhatsApp status notification message.
 */
export function formatClientStatusMessage(
  type: "booking" | "quote",
  status: string,
  data: ClientStatusPayload
): string {
  const name = data.clientName ? ` ${data.clientName}` : "";

  if (status === "confirmed") {
    return [
      `🎉 *BOOKING CONFIRMED — Ravenous Studio Production*`,
      ``,
      `Hello${name}!`,
      `We are pleased to inform you that your booking for *${data.eventType}* has been officially CONFIRMED.`,
      ``,
      `📅 *Date:* ${data.eventDate}`,
      `📍 *Location:* ${data.location || "Confirmed Venue"}`,
      `📋 *Status:* Confirmed`,
      ``,
      `Our technical and production crew is locked in for your date. If you have any schedule updates or equipment adjustments, simply reply directly to this chat!`,
      ``,
      `Thank you for choosing Ravenous Studio Production. ✨`,
    ].join("\n");
  }

  if (status === "completed") {
    return [
      `🌟 *EVENT COMPLETED — Ravenous Studio Production*`,
      ``,
      `Hello${name}!`,
      `It was an absolute pleasure providing production coverage for your *${data.eventType}* on ${data.eventDate}!`,
      ``,
      `How was our service? We would deeply appreciate your feedback to help us continually elevate our production standards:`,
      `👉 https://ravenousstudioproduction.com/review`,
      ``,
      `Warm regards,`,
      `Ravenous Studio Production Team`,
    ].join("\n");
  }

  if (status === "cancelled") {
    return [
      `📋 *BOOKING CANCELLED — Ravenous Studio Production*`,
      ``,
      `Hello${name},`,
      `Your booking request for *${data.eventType}* on ${data.eventDate} has been updated to *Cancelled*.`,
      ``,
      `If this was an error or you wish to reschedule for a future date, please reply to this message and our production manager will be glad to assist you.`,
      ``,
      `Ravenous Studio Production`,
    ].join("\n");
  }

  // in_progress or other statuses
  return [
    `ℹ️ *STATUS UPDATE — Ravenous Studio Production*`,
    ``,
    `Hello${name}!`,
    `The status of your *${data.eventType}* booking has been updated to: *${status.toUpperCase()}*.`,
    ``,
    `📅 *Event Date:* ${data.eventDate}`,
    `📍 *Location:* ${data.location || "Scheduled Location"}`,
    ``,
    `If you have any questions, feel free to reply to this message.`,
    `Ravenous Studio Production`,
  ].join("\n");
}

