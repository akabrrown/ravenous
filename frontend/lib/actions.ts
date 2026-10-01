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
  serviceCategories
} from "./schema";
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
  return db.query.services.findFirst({
    where: and(eq(services.published, true), eq(services.slug, slug)),
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

export async function updateBookingStatus(id: string, status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled") {
  await db.update(bookings).set({ status }).where(eq(bookings.id, id));
  revalidatePath("/admin/bookings");
  return { success: true };
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
