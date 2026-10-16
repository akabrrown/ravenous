"use server";

import { db } from "./db";
import { 
  services, 
  portfolioProjects, 
  testimonials, 
  faqs,
  blogPosts,
  mediaLibrary,
  projectMedia,
  bookings,
  users,
  settings,
  packages,
  siteContent,
  serviceCategories,
  quoteRequests,
  notifications
} from "./schema";
import { sendAdminWhatsAppNotification, getAdminWhatsAppConfig } from "./whatsapp";
import { formatClientStatusMessage, createWhatsAppDeepLink } from "./whatsapp-utils";
import { sendTransactionalEmail, generateStatusUpdateEmailHtml } from "./email";
import { eq, desc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { v2 as cloudinary } from "cloudinary";

let _supabase: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error("Supabase environment variables are not configured.");
    }
    _supabase = createClient(url, key);
  }
  return _supabase;
}



// ----------------------------------------------------------------------------
// PUBLIC DATA FETCHERS
// ----------------------------------------------------------------------------

export async function getFeaturedServices() {
  return db.query.services.findMany({
    where: and(eq(services.published, true), eq(services.isFeatured, true)),
    orderBy: [services.sortOrder],
    with: {
      coverMedia: true,
      category: true,
    }
  });
}

export async function getAllServices() {
  return db.query.services.findMany({
    where: eq(services.published, true),
    orderBy: [services.sortOrder],
    with: {
      coverMedia: true,
      category: true,
    }
  });
}

export async function getServiceBySlug(slug: string) {
  const normalizedSlug = slug === "led-screen-rental" ? "led-screen-rentals" : slug;
  return db.query.services.findFirst({
    where: and(eq(services.published, true), eq(services.slug, normalizedSlug)),
    with: {
      coverMedia: true,
      category: true,
    }
  });
}

export async function getFeaturedPortfolio() {
  return db.query.portfolioProjects.findMany({
    where: and(eq(portfolioProjects.published, true), eq(portfolioProjects.isFeatured, true)),
    orderBy: [desc(portfolioProjects.eventDate)],
    limit: 6,
    with: {
      coverMedia: true,
    }
  });
}

export async function getAllPortfolio() {
  return db.query.portfolioProjects.findMany({
    where: eq(portfolioProjects.published, true),
    orderBy: [desc(portfolioProjects.eventDate)],
    with: {
      coverMedia: true,
    }
  });
}

export async function getPortfolioById(id: string) {
  return db.query.portfolioProjects.findFirst({
    where: and(eq(portfolioProjects.published, true), eq(portfolioProjects.id, id)),
    with: {
      coverMedia: true,
      media: {
        orderBy: [projectMedia.sortOrder],
        with: {
          media: true
        }
      }
    }
  });
}

export async function getTestimonials() {
  return db.query.testimonials.findMany({
    where: eq(testimonials.status, "published"),
    orderBy: [desc(testimonials.createdAt)],
    with: {
      customerPhoto: true
    }
  });
}

export async function getFaqs() {
  return db.query.faqs.findMany({
    where: eq(faqs.published, true),
    orderBy: [faqs.sortOrder],
  });
}

export async function getBlogPosts() {
  return db.query.blogPosts.findMany({
    where: eq(blogPosts.published, true),
    orderBy: [desc(blogPosts.publishedAt)],
    with: {
      coverMedia: true
    }
  });
}

export async function getBlogPostBySlug(slug: string) {
  return db.query.blogPosts.findFirst({
    where: and(eq(blogPosts.published, true), eq(blogPosts.slug, slug)),
    with: {
      coverMedia: true
    }
  });
}

// ----------------------------------------------------------------------------
// ADMIN FETCHERS
// ----------------------------------------------------------------------------

export async function getAdminServices() {
  return db.query.services.findMany({
    orderBy: [services.sortOrder],
    with: {
      category: true,
    }
  });
}

export async function getAdminPortfolio() {
  return db.query.portfolioProjects.findMany({
    orderBy: [desc(portfolioProjects.eventDate)],
  });
}

export async function getAdminBookings() {
  return db.query.bookings.findMany({
    orderBy: [desc(bookings.createdAt)],
  });
}

export async function getAdminQuoteRequests() {
  return db.query.quoteRequests.findMany({
    orderBy: [desc(quoteRequests.createdAt)],
  });
}

export async function deleteQuoteRequest(id: string) {
  await db.delete(quoteRequests).where(eq(quoteRequests.id, id));
  revalidatePath("/admin/bookings");
  return { success: true };
}

export async function getAdminTestimonials() {
  return db.query.testimonials.findMany({
    orderBy: [desc(testimonials.createdAt)],
    with: {
      customerPhoto: true
    }
  });
}

export async function getAdminCustomers() {
  return db.query.users.findMany({
    orderBy: [desc(users.createdAt)],
  });
}

export async function getAdminSettings() {
  return db.query.settings.findMany({
    orderBy: [settings.key],
  });
}

// ----------------------------------------------------------------------------
// ADMIN MUTATIONS (SERVICES)
// ----------------------------------------------------------------------------

export async function createService(data: typeof services.$inferInsert) {
  if (!data.categoryId || data.categoryId === "00000000-0000-0000-0000-000000000000") {
    const cat = await db.query.serviceCategories.findFirst();
    if (cat) {
      data.categoryId = cat.id;
    } else {
      const [newCat] = await db.insert(serviceCategories).values({
        name: "General",
        slug: "general-" + Date.now(),
        sortOrder: 1
      }).returning();
      data.categoryId = newCat.id;
    }
  }

  await db.insert(services).values(data);
  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/");
  return { success: true };
}

export async function updateService(id: string, data: Partial<typeof services.$inferInsert>) {
  await db.update(services).set(data).where(eq(services.id, id));
  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/");
  return { success: true };
}

export async function deleteService(id: string) {
  await db.delete(services).where(eq(services.id, id));
  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/");
  return { success: true };
}

// ----------------------------------------------------------------------------
// ADMIN MUTATIONS (PORTFOLIO)
// ----------------------------------------------------------------------------

export async function createPortfolio(data: typeof portfolioProjects.$inferInsert) {
  await db.insert(portfolioProjects).values(data);
  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
  revalidatePath("/");
  return { success: true };
}

export async function updatePortfolio(id: string, data: Partial<typeof portfolioProjects.$inferInsert>) {
  await db.update(portfolioProjects).set(data).where(eq(portfolioProjects.id, id));
  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
  revalidatePath("/");
  return { success: true };
}

export async function deletePortfolio(id: string) {
  await db.delete(portfolioProjects).where(eq(portfolioProjects.id, id));
  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
  revalidatePath("/");
  return { success: true };
}

// ----------------------------------------------------------------------------
// ADMIN MUTATIONS (BOOKINGS)
// ----------------------------------------------------------------------------

export async function updateBookingStatus(
  id: string, 
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled"
) {
  const booking = await db.query.bookings.findFirst({
    where: eq(bookings.id, id),
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  const statusHistory = Array.isArray(booking.statusHistory) 
    ? [...booking.statusHistory, { status, timestamp: new Date().toISOString() }] 
    : [{ status, timestamp: new Date().toISOString() }];

  await db.update(bookings).set({ 
    status, 
    statusHistory 
  }).where(eq(bookings.id, id));

  const whatsappMessage = formatClientStatusMessage("booking", status, {
    clientName: booking.guestName,
    eventType: booking.eventType,
    eventDate: booking.eventDate,
    location: booking.location,
    total: booking.total,
  });

  const whatsappUrl = booking.guestPhone 
    ? createWhatsAppDeepLink(booking.guestPhone, whatsappMessage) 
    : null;

  let emailStatus = "skipped";
  if (booking.guestEmail) {
    const emailSubject = `Booking ${status === "confirmed" ? "Confirmed" : "Status Update"}: ${booking.eventType} - Ravenous Studio Production`;
    const emailHtml = generateStatusUpdateEmailHtml({
      clientName: booking.guestName || "Valued Client",
      eventType: booking.eventType,
      eventDate: booking.eventDate,
      location: booking.location,
      status,
      total: booking.total,
    });

    const emailRes = await sendTransactionalEmail({
      to: booking.guestEmail,
      subject: emailSubject,
      html: emailHtml,
    });
    emailStatus = emailRes.status;

    try {
      await db.insert(notifications).values({
        type: "client_email_status_update",
        recipient: booking.guestEmail,
        payload: {
          bookingId: id,
          status,
          emailStatus,
          subject: emailSubject,
        },
        status: emailStatus === "sent" ? "sent" : "logged",
        sentAt: emailStatus === "sent" ? new Date() : null,
      });
    } catch (e) {
      console.warn("Failed to log status email notification:", e);
    }
  }

  const config = await getAdminWhatsAppConfig();
  if (config.webhookUrl && booking.guestPhone) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      await fetch(config.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: booking.guestPhone,
          message: whatsappMessage,
          type: "client_status_update",
          bookingId: id,
          status,
          timestamp: new Date().toISOString(),
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (e) {
      console.warn("Client status WhatsApp webhook error (non-fatal):", e);
    }
  }

  revalidatePath("/admin/bookings");
  return { 
    success: true,
    bookingId: id,
    status,
    clientName: booking.guestName,
    clientPhone: booking.guestPhone,
    clientEmail: booking.guestEmail,
    whatsappUrl,
    whatsappMessage,
    emailStatus,
  };
}

export async function updateQuoteRequestStatus(
  id: string,
  status: "new" | "quoted" | "closed"
) {
  const quote = await db.query.quoteRequests.findFirst({
    where: eq(quoteRequests.id, id),
  });

  if (!quote) {
    throw new Error("Quote request not found");
  }

  await db.update(quoteRequests).set({ status }).where(eq(quoteRequests.id, id));

  const whatsappMessage = `Hello ${quote.guestName || "Valued Client"}! This is Ravenous Studio Production regarding your quote request for ${quote.eventType} on ${quote.eventDate}. Your request status has been updated to: *${status.replace("_", " ").toUpperCase()}*. We would love to discuss your production plan and pricing. Reply here anytime!`;
  
  const whatsappUrl = quote.guestPhone 
    ? createWhatsAppDeepLink(quote.guestPhone, whatsappMessage) 
    : null;

  let emailStatus = "skipped";
  if (quote.guestEmail) {
    const emailRes = await sendTransactionalEmail({
      to: quote.guestEmail,
      subject: `Quote Request Update: ${quote.eventType} - Ravenous Studio Production`,
      html: generateStatusUpdateEmailHtml({
        clientName: quote.guestName || "Valued Client",
        eventType: quote.eventType,
        eventDate: quote.eventDate,
        location: quote.location,
        status,
      }),
    });
    emailStatus = emailRes.status;
  }

  revalidatePath("/admin/bookings");
  return {
    success: true,
    quoteId: id,
    status,
    clientName: quote.guestName,
    clientPhone: quote.guestPhone,
    clientEmail: quote.guestEmail,
    whatsappUrl,
    whatsappMessage,
    emailStatus,
  };
}

export async function deleteBooking(id: string) {
  await db.delete(bookings).where(eq(bookings.id, id));
  revalidatePath("/admin/bookings");
  return { success: true };
}

// ----------------------------------------------------------------------------
// ADMIN MUTATIONS (TESTIMONIALS)
// ----------------------------------------------------------------------------

export async function updateTestimonialStatus(id: string, status: "pending" | "published" | "rejected") {
  await db.update(testimonials).set({ status }).where(eq(testimonials.id, id));
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { success: true };
}

export async function deleteTestimonial(id: string) {
  await db.delete(testimonials).where(eq(testimonials.id, id));
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { success: true };
}

// ----------------------------------------------------------------------------
// ADMIN MUTATIONS (CUSTOMERS/USERS)
// ----------------------------------------------------------------------------

export async function updateUserRole(id: string, role: "admin" | "customer") {
  await db.update(users).set({ role }).where(eq(users.id, id));
  revalidatePath("/admin/customers");
  return { success: true };
}

export async function deleteUser(id: string) {
  await db.delete(users).where(eq(users.id, id));
  revalidatePath("/admin/customers");
  return { success: true };
}

// ----------------------------------------------------------------------------
// ADMIN MUTATIONS (SETTINGS)
// ----------------------------------------------------------------------------

export async function saveSetting(key: string, value: any) {
  // Try to update first, if it fails, insert
  const existing = await db.query.settings.findFirst({
    where: eq(settings.key, key)
  });
  
  if (existing) {
    await db.update(settings).set({ value, updatedAt: new Date() }).where(eq(settings.key, key));
  } else {
    await db.insert(settings).values({ key, value });
  }
  
  revalidatePath("/admin/settings");
  revalidatePath("/");
  return { success: true };
}

export async function deleteSetting(id: string) {
  await db.delete(settings).where(eq(settings.id, id));
  revalidatePath("/admin/settings");
  revalidatePath("/");
  return { success: true };
}

// ----------------------------------------------------------------------------
// ADMIN MUTATIONS (MEDIA UPLOAD)
// ----------------------------------------------------------------------------

export async function uploadMedia(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) throw new Error("No file uploaded");

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Configure Cloudinary lazily so env vars are resolved at request time, not at build time
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary is not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in your Vercel environment variables."
    );
  }

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });

  // Generate a unique public_id: timestamp + sanitized filename (no extension)
  const baseName = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
  const uniquePublicId = `${baseName}_${Date.now()}`;

  let uploadResult;
  try {
    uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { 
          folder: "Ravenous",
          resource_type: "auto",
          public_id: uniquePublicId,
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(buffer);
    }) as any;
  } catch (err) {
    console.error("Upload stream rejected:", err);
    throw new Error("Cloudinary upload failed");
  }

  // Insert into media_library
  let adminUser = await db.query.users.findFirst({ where: eq(users.role, "admin") });
  
  if (!adminUser) {
    adminUser = await db.query.users.findFirst();
  }
  if (!adminUser) {
    // Create a fallback user if absolutely empty
    const [newUser] = await db.insert(users).values({
      fullName: "System Fallback",
      email: `fallback_${Date.now()}@ravenous.com`,
      role: "admin",
      isStaff: true
    }).returning();
    adminUser = newUser;
  }

  const [media] = await db.insert(mediaLibrary).values({
    type: file.type.startsWith("video") ? "video" : "image",
    category: "general",
    title: file.name,
    altText: file.name,
    cloudinaryPublicId: uploadResult.public_id,
    deliveryUrl: uploadResult.secure_url,
    status: "ready",
    uploadedBy: adminUser.id
  })
  .onConflictDoUpdate({
    target: mediaLibrary.cloudinaryPublicId,
    set: { deliveryUrl: uploadResult.secure_url }
  })
  .returning();

  return {
    id: media.id,
    deliveryUrl: media.deliveryUrl,
    type: media.type
  };
}

// ----------------------------------------------------------------------------
// ADMIN MUTATIONS (PACKAGES)
// ----------------------------------------------------------------------------

export async function getAdminPackages() {
  return await db.query.packages.findMany({
    orderBy: desc(packages.price),
  });
}

export async function createPackage(data: any) {
  const [pkg] = await db.insert(packages).values(data).returning();
  revalidatePath("/admin/packages");
  revalidatePath("/packages");
  return pkg;
}

export async function updatePackage(id: string, data: any) {
  const [pkg] = await db.update(packages).set(data).where(eq(packages.id, id)).returning();
  revalidatePath("/admin/packages");
  revalidatePath("/packages");
  return pkg;
}

export async function deletePackage(id: string) {
  await db.delete(packages).where(eq(packages.id, id));
  revalidatePath("/admin/packages");
  revalidatePath("/packages");
  return { success: true };
}

// ----------------------------------------------------------------------------
// ADMIN MUTATIONS (SITE CONTENT)
// ----------------------------------------------------------------------------

export async function getAdminSiteContent() {
  return await db.query.siteContent.findMany({
    orderBy: desc(siteContent.updatedAt),
  });
}

export async function saveSiteContent(key: string, value: any) {
  const [content] = await db
    .insert(siteContent)
    .values({ key, value })
    .onConflictDoUpdate({
      target: siteContent.key,
      set: { value, updatedAt: new Date() },
    })
    .returning();
    
  revalidatePath("/admin/site-content");
  revalidatePath("/");
  revalidatePath("/about");
  return content;
}

export async function deleteSiteContent(id: string) {
  await db.delete(siteContent).where(eq(siteContent.id, id));
  revalidatePath("/admin/site-content");
  revalidatePath("/");
  revalidatePath("/about");
  return { success: true };
}

// ----------------------------------------------------------------------------
// ADMIN MUTATIONS (FAQS)
// ----------------------------------------------------------------------------

export async function getAdminFaqs() {
  return await db.query.faqs.findMany({
    orderBy: desc(faqs.sortOrder),
  });
}

export async function createFaq(data: any) {
  const [faq] = await db.insert(faqs).values(data).returning();
  revalidatePath("/admin/faqs");
  revalidatePath("/about"); // if faqs are on about
  return faq;
}

export async function updateFaq(id: string, data: any) {
  const [faq] = await db.update(faqs).set(data).where(eq(faqs.id, id)).returning();
  revalidatePath("/admin/faqs");
  revalidatePath("/about");
  return faq;
}

export async function deleteFaq(id: string) {
  await db.delete(faqs).where(eq(faqs.id, id));
  revalidatePath("/admin/faqs");
  revalidatePath("/about");
  return { success: true };
}

// ----------------------------------------------------------------------------
// PUBLIC SUBMISSION MUTATIONS (BOOKINGS, QUOTES, CONTACT WITH WHATSAPP NOTIFICATIONS)
// ----------------------------------------------------------------------------

export async function submitBookingRequest(data: {
  name: string;
  phone: string;
  email: string;
  eventType?: string;
  serviceId?: string;
  serviceName?: string;
  date: string;
  location: string;
  notes?: string;
}) {
  if (!data.name || !data.phone || !data.email || !data.date || !data.location) {
    throw new Error("Missing required fields for booking request.");
  }

  const determinedEventType = data.eventType?.trim() || data.serviceName || "Event Production";
  const formattedRequirements = [
    data.serviceName ? `Selected Service: ${data.serviceName}` : null,
    data.notes?.trim() ? `Client Notes: ${data.notes.trim()}` : null,
  ].filter(Boolean).join("\n\n") || "No additional notes provided.";

  const [booking] = await db.insert(bookings).values({
    guestName: data.name.trim(),
    guestEmail: data.email.trim(),
    guestPhone: data.phone.trim(),
    eventType: determinedEventType,
    eventDate: data.date,
    location: data.location.trim(),
    requirements: formattedRequirements,
    status: "pending",
    total: "0.00",
    statusHistory: [{ status: "pending", timestamp: new Date().toISOString() }],
  }).returning();

  const notif = await sendAdminWhatsAppNotification("booking", {
    guestName: data.name.trim(),
    guestPhone: data.phone.trim(),
    guestEmail: data.email.trim(),
    eventType: data.serviceName ? `${determinedEventType} (${data.serviceName})` : determinedEventType,
    eventDate: data.date,
    location: data.location.trim(),
    requirements: data.notes?.trim() || (data.serviceName ? `Service: ${data.serviceName}` : null),
  });

  revalidatePath("/admin/bookings");
  return {
    success: true,
    bookingId: booking.id,
    whatsappUrl: notif.whatsappUrl,
  };
}

export async function submitQuoteRequest(data: {
  name: string;
  phone: string;
  email: string;
  eventType: string;
  eventDate: string;
  location: string;
  serviceIds?: string[];
  serviceNames?: string[];
  expectedAttendance?: string | number;
  requirements?: string;
}) {
  if (!data.name || !data.phone || !data.email || !data.eventType || !data.eventDate || !data.location) {
    throw new Error("Missing required fields for quote request.");
  }

  const attendance = data.expectedAttendance ? parseInt(String(data.expectedAttendance), 10) : null;

  const MOCK_ID_MAP: Record<string, string> = {
    "s1": "ce722374-3b15-4667-911e-b470df56f299", // LED Screen Rentals
    "s2": "10dcffdc-468b-4ca5-872c-6af4439eafcf", // Live Streaming
    "s3": "1d0bf1d3-fa41-4fa1-9705-58f813599901", // Live Recording
    "s4": "babe3f04-21f8-40e3-b59e-41641f6546d1", // Event Videography
    "s5": "19a0af7f-b721-4632-8bb9-27a4d13ea4a8", // Event Photography
  };
  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const sanitizedServiceIds = (data.serviceIds || [])
    .map((id) => MOCK_ID_MAP[id] || id)
    .filter((id) => UUID_REGEX.test(id));

  const [quote] = await db.insert(quoteRequests).values({
    guestName: data.name.trim(),
    guestEmail: data.email.trim(),
    guestPhone: data.phone.trim(),
    serviceIds: sanitizedServiceIds,
    eventType: data.eventType.trim(),
    eventDate: data.eventDate,
    location: data.location.trim(),
    expectedAttendance: isNaN(Number(attendance)) ? null : attendance,
    requirements: data.requirements?.trim() || "No additional requirements provided.",
    status: "new",
  }).returning();

  const notif = await sendAdminWhatsAppNotification("quote", {
    guestName: data.name.trim(),
    guestPhone: data.phone.trim(),
    guestEmail: data.email.trim(),
    eventType: data.eventType.trim(),
    eventDate: data.eventDate,
    location: data.location.trim(),
    services: data.serviceNames || [],
    expectedAttendance: isNaN(Number(attendance)) ? null : attendance,
    requirements: data.requirements?.trim() || null,
  });

  revalidatePath("/admin/bookings");
  return {
    success: true,
    quoteRequestId: quote.id,
    whatsappUrl: notif.whatsappUrl,
  };
}

export async function submitContactMessage(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  if (!data.name || !data.email || !data.subject || !data.message) {
    throw new Error("Missing required fields for contact message.");
  }

  const notif = await sendAdminWhatsAppNotification("contact", {
    name: data.name.trim(),
    email: data.email.trim(),
    phone: data.phone?.trim() || null,
    subject: data.subject.trim(),
    message: data.message.trim(),
  });

  return {
    success: true,
    whatsappUrl: notif.whatsappUrl,
  };
}

export async function getAdminWhatsAppSetting() {
  const phoneRow = await db.query.settings.findFirst({
    where: eq(settings.key, "admin_whatsapp_phone"),
  });
  const webhookRow = await db.query.settings.findFirst({
    where: eq(settings.key, "admin_whatsapp_webhook_url"),
  });

  return {
    phone: phoneRow?.value ? String(phoneRow.value) : "0552471202",
    webhookUrl: webhookRow?.value ? String(webhookRow.value) : "",
  };
}

export async function saveAdminWhatsAppSetting(phone: string, webhookUrl?: string) {
  const cleanPhone = phone.trim();
  const existingPhone = await db.query.settings.findFirst({
    where: eq(settings.key, "admin_whatsapp_phone"),
  });

  if (existingPhone) {
    await db.update(settings).set({ value: cleanPhone, updatedAt: new Date() }).where(eq(settings.key, "admin_whatsapp_phone"));
  } else {
    await db.insert(settings).values({ key: "admin_whatsapp_phone", value: cleanPhone });
  }

  const cleanWebhook = webhookUrl?.trim() || "";
  const existingWebhook = await db.query.settings.findFirst({
    where: eq(settings.key, "admin_whatsapp_webhook_url"),
  });

  if (existingWebhook) {
    await db.update(settings).set({ value: cleanWebhook, updatedAt: new Date() }).where(eq(settings.key, "admin_whatsapp_webhook_url"));
  } else if (cleanWebhook) {
    await db.insert(settings).values({ key: "admin_whatsapp_webhook_url", value: cleanWebhook });
  }

  revalidatePath("/admin/settings");
  revalidatePath("/admin/bookings");
  revalidatePath("/");
  return { success: true };
}

