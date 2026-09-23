import { 
  pgTable, 
  uuid, 
  text, 
  timestamp, 
  boolean, 
  integer, 
  numeric, 
  date, 
  json, 
  pgEnum 
} from "drizzle-orm/pg-core";
import { sql, relations } from "drizzle-orm";

// ----------------------------------------------------------------------------
// ENUMS
// ----------------------------------------------------------------------------

export const userRoleEnum = pgEnum("user_role", ["admin", "customer"]);
export const mediaTypeEnum = pgEnum("media_type", ["image", "video", "document"]);
export const mediaStatusEnum = pgEnum("media_status", ["processing", "ready", "failed"]);
export const quoteRequestStatusEnum = pgEnum("quote_request_status", ["new", "quoted", "closed"]);
export const quoteStatusEnum = pgEnum("quote_status", ["draft", "sent", "accepted", "rejected", "changes_requested"]);
export const bookingStatusEnum = pgEnum("booking_status", ["pending", "confirmed", "in_progress", "completed", "cancelled"]);
export const paymentTypeEnum = pgEnum("payment_type", ["deposit", "balance", "full"]);
export const paymentMethodEnum = pgEnum("payment_method", ["paystack_card", "paystack_momo", "cash", "bank_transfer", "momo_direct"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "confirmed", "failed"]);
export const equipmentCategoryEnum = pgEnum("equipment_category", ["camera", "lens", "led_screen", "audio", "lighting", "streaming", "other"]);
export const equipmentConditionEnum = pgEnum("equipment_condition", ["good", "needs_service", "retired"]);
export const testimonialStatusEnum = pgEnum("testimonial_status", ["pending", "published", "rejected"]);

// ----------------------------------------------------------------------------
// TABLES
// ----------------------------------------------------------------------------

export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  email: text("email").notNull().unique(),
  role: userRoleEnum("role").default("customer").notNull(),
  isStaff: boolean("is_staff").default(false).notNull(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const serviceCategories = pgTable("service_categories", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  sortOrder: integer("sort_order").notNull(),
});

export const mediaLibrary = pgTable("media_library", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  type: mediaTypeEnum("type").notNull(),
  category: text("category").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  altText: text("alt_text").notNull(),
  cloudinaryPublicId: text("cloudinary_public_id").notNull().unique(),
  deliveryUrl: text("delivery_url").notNull(),
  width: integer("width"),
  height: integer("height"),
  durationSeconds: numeric("duration_seconds"),
  status: mediaStatusEnum("status").notNull(),
  uploadedBy: uuid("uploaded_by").references(() => users.id).notNull(),
});

export const services = pgTable("services", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  categoryId: uuid("category_id").references(() => serviceCategories.id).notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  shortDescription: text("short_description").notNull(),
  description: text("description").notNull(),
  equipmentUsed: text("equipment_used").array().notNull(),
  startingPrice: numeric("starting_price", { precision: 12, scale: 2 }),
  coverMediaId: uuid("cover_media_id").references(() => mediaLibrary.id),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  ogImageId: uuid("og_image_id"),
  isFeatured: boolean("is_featured").default(false).notNull(),
  published: boolean("published").default(true).notNull(),
  sortOrder: integer("sort_order").notNull(),
});

export const packages = pgTable("packages", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  eventType: text("event_type").notNull(),
  description: text("description").notNull(),
  price: numeric("price", { precision: 12, scale: 2 }),
  published: boolean("published").default(true).notNull(),
});

export const packageItems = pgTable("package_items", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  packageId: uuid("package_id").references(() => packages.id).notNull(),
  serviceId: uuid("service_id").references(() => services.id).notNull(),
  quantity: integer("quantity").default(1).notNull(),
});

export const portfolioProjects = pgTable("portfolio_projects", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  eventType: text("event_type").notNull(),
  clientName: text("client_name"),
  eventDate: date("event_date").notNull(),
  location: text("location").notNull(),
  servicesProvided: uuid("services_provided").array().notNull(),
  coverMediaId: uuid("cover_media_id").references(() => mediaLibrary.id).notNull(),
  description: text("description").notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  published: boolean("published").default(true).notNull(),
});

export const projectMedia = pgTable("project_media", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: uuid("project_id").references(() => portfolioProjects.id).notNull(),
  mediaId: uuid("media_id").references(() => mediaLibrary.id).notNull(),
  sortOrder: integer("sort_order").notNull(),
});

export const quoteRequests = pgTable("quote_requests", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: uuid("customer_id").references(() => users.id),
  guestName: text("guest_name"),
  guestEmail: text("guest_email"),
  guestPhone: text("guest_phone"),
  serviceIds: uuid("service_ids").array().notNull(),
  eventType: text("event_type").notNull(),
  eventDate: date("event_date").notNull(),
  location: text("location").notNull(),
  expectedAttendance: integer("expected_attendance"),
  requirements: text("requirements").notNull(),
  status: quoteRequestStatusEnum("status").default("new").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const quotes = pgTable("quotes", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  quoteRequestId: uuid("quote_request_id").references(() => quoteRequests.id).notNull(),
  customerId: uuid("customer_id").references(() => users.id),
  status: quoteStatusEnum("status").default("draft").notNull(),
  total: numeric("total", { precision: 12, scale: 2 }).notNull(),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  respondedAt: timestamp("responded_at", { withTimezone: true }),
  customerComment: text("customer_comment"),
});

export const quoteLineItems = pgTable("quote_line_items", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  quoteId: uuid("quote_id").references(() => quotes.id).notNull(),
  serviceId: uuid("service_id").references(() => services.id),
  description: text("description").notNull(),
  unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
  quantity: integer("quantity").default(1).notNull(),
  lineTotal: numeric("line_total", { precision: 12, scale: 2 }).notNull(),
});

export const bookings = pgTable("bookings", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: uuid("customer_id").references(() => users.id),
  quoteId: uuid("quote_id").references(() => quotes.id),
  guestName: text("guest_name"),
  guestEmail: text("guest_email"),
  guestPhone: text("guest_phone"),
  eventType: text("event_type").notNull(),
  eventDate: date("event_date").notNull(),
  location: text("location").notNull(),
  requirements: text("requirements").notNull(),
  status: bookingStatusEnum("status").default("pending").notNull(),
  total: numeric("total", { precision: 12, scale: 2 }).notNull(),
  statusHistory: json("status_history").default([]).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const bookingServices = pgTable("booking_services", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: uuid("booking_id").references(() => bookings.id).notNull(),
  serviceId: uuid("service_id").references(() => services.id).notNull(),
  unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
  quantity: integer("quantity").default(1).notNull(),
});

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: uuid("booking_id").references(() => bookings.id).notNull(),
  type: paymentTypeEnum("type").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  method: paymentMethodEnum("method").notNull(),
  status: paymentStatusEnum("status").default("pending").notNull(),
  paystackReference: text("paystack_reference").unique(),
  recordedBy: uuid("recorded_by").references(() => users.id),
  confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  paymentId: uuid("payment_id").references(() => payments.id).notNull(),
  invoiceNumber: text("invoice_number").notNull().unique(),
  pdfUrl: text("pdf_url").notNull(),
});

export const equipment = pgTable("equipment", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: equipmentCategoryEnum("category").notNull(),
  serialNumber: text("serial_number"),
  condition: equipmentConditionEnum("condition").default("good").notNull(),
});

export const equipmentAssignments = pgTable("equipment_assignments", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  equipmentId: uuid("equipment_id").references(() => equipment.id).notNull(),
  bookingId: uuid("booking_id").references(() => bookings.id).notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
});

export const testimonials = pgTable("testimonials", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  customerName: text("customer_name").notNull(),
  customerPhotoId: uuid("customer_photo_id").references(() => mediaLibrary.id),
  quoteText: text("quote_text").notNull(),
  rating: integer("rating"),
  status: testimonialStatusEnum("status").default("pending").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  coverMediaId: uuid("cover_media_id").references(() => mediaLibrary.id).notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  published: boolean("published").default(false).notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const faqs = pgTable("faqs", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  group: text("group").notNull(),
  sortOrder: integer("sort_order").notNull(),
  published: boolean("published").default(true).notNull(),
});

export const siteContent = pgTable("site_content", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: json("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const settings = pgTable("settings", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: json("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(),
  recipient: text("recipient").notNull(),
  payload: json("payload").notNull(),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  sentAt: timestamp("sent_at", { withTimezone: true }),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  tableName: text("table_name").notNull(),
  recordId: uuid("record_id").notNull(),
  action: text("action").notNull(),
  adminId: uuid("admin_id").notNull(),
  changes: json("changes").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ----------------------------------------------------------------------------
// RELATIONS
// ----------------------------------------------------------------------------

export const servicesRelations = relations(services, ({ one }) => ({
  coverMedia: one(mediaLibrary, {
    fields: [services.coverMediaId],
    references: [mediaLibrary.id],
  }),
  category: one(serviceCategories, {
    fields: [services.categoryId],
    references: [serviceCategories.id],
  }),
}));

export const portfolioProjectsRelations = relations(portfolioProjects, ({ one, many }) => ({
  coverMedia: one(mediaLibrary, {
    fields: [portfolioProjects.coverMediaId],
    references: [mediaLibrary.id],
  }),
  media: many(projectMedia),
}));

export const projectMediaRelations = relations(projectMedia, ({ one }) => ({
  project: one(portfolioProjects, {
    fields: [projectMedia.projectId],
    references: [portfolioProjects.id],
  }),
  media: one(mediaLibrary, {
    fields: [projectMedia.mediaId],
    references: [mediaLibrary.id],
  }),
}));

export const testimonialsRelations = relations(testimonials, ({ one }) => ({
  customerPhoto: one(mediaLibrary, {
    fields: [testimonials.customerPhotoId],
    references: [mediaLibrary.id],
  }),
}));

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  coverMedia: one(mediaLibrary, {
    fields: [blogPosts.coverMediaId],
    references: [mediaLibrary.id],
  }),
}));
