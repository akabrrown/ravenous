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
  settings
} from "./schema";
import { eq, desc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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
