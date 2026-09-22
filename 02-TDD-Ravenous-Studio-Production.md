**RAVENOUS STUDIO PRODUCTION**  
**Technical Design Document**  
Architecture, Data, Roles, API & Threat Model  
**Prepared for:** Ravenous Studio Production  
**Prepared by:** Codey Dev — Aka Brown  
**Version:** 1.0  
**Date:** September 2026

Table of Contents
=================

**1\. Architecture Overview**
=============================

The system is a single Next.js application serving three route groups against one Supabase project, rather than three separate apps. Public marketing pages, the authenticated customer area, and the admin console share one codebase, one database, and one deployment — role checks (not separate services) decide what a request can see or do. This matches the two-role architectural pattern used across the Codey Dev portfolio (Admin and User, with contextual behavior on a single account) rather than introducing a third first-class role tier.  
Browser  
│  
▼  
Next.js 15 App Router ──► (public)/\* marketing site, SSR/ISR  
│ ──► (customer)/\* authenticated portal, CSR+RSC  
│ ──► (admin)/\* authenticated console, CSR+RSC  
│ ──► /api/webhooks/\* Paystack + Cloudinary callbacks  
▼  
Supabase ── Postgres (RLS) · Auth · Storage · Realtime  
│  
├──► Cloudinary media transforms + CDN delivery  
├──► Paystack card + Mobile Money payments  
├──► Resend transactional email  
└──► Arcjet bot/spam protection on public forms

**2\. Technology Stack**
========================

| **Layer** | **Choice** | **Why here** |
| --- | --- | --- |
| Frontend framework | Next.js 15 (App Router), TypeScript | SSR/ISR for SEO on service & portfolio pages; one codebase for public/customer/admin route groups. |
| Styling / UI | Tailwind CSS 4, shadcn/ui | Fast, consistent theming from the palette in the Design Brief; accessible primitives (Radix) under the hood. |
| Data fetching / forms | TanStack Query, React Hook Form, Zod | Cache-aware server-state management; shared Zod schemas validate both client forms and API input. |
| Database & Auth | Supabase (Postgres, Auth, Row-Level Security, Realtime) | One managed platform for relational data, auth, and live updates (e.g. new-message notifications) without a separate backend service for CRUD. |
| Media storage/CDN | Cloudinary (signed uploads) | Handles the video/photo volume the Media Library requires: on-the-fly image transforms, adaptive video, and CDN delivery beyond what Supabase Storage alone is optimized for. |
| Payments | Paystack (GHS + Mobile Money) | Primary Ghanaian payment rails; card and MoMo in one integration. |
| Email | Resend | Transactional email for quote/booking/payment notifications. |
| Bot/spam protection | Arcjet | Rate-limits and filters the public Quote/Booking forms, which have no login gate. |
| Deployment | Vercel | Native Next.js hosting, preview deployments per PR, edge network for public pages. |

**_Note:_** _Free-tier-first: Vercel Hobby/Pro and Supabase Free are sufficient for V1 traffic and media volume estimates. Upgrade triggers: Supabase Free's 1 GB storage / 2 GB bandwidth is the first likely ceiling once real event video accumulates — tracked against Cloudinary usage instead, since large video lives there, not in Supabase Storage._

**3\. Repository Structure**
============================

Full-Stack Single-Repo layout — this is one application, not a multi-app or multi-package system, so a monorepo would add tooling overhead without a matching benefit.  
ravenous-studio/  
├── frontend/  
│ ├── app/  
│ │ ├── (public)/ home, about, services/\[slug\], portfolio, gallery,  
│ │ │ packages, events, testimonials, blog, faq, contact,  
│ │ │ quote, book  
│ │ ├── (customer)/ dashboard, bookings, quotes, payments, messages,  
│ │ │ profile — guarded by requireRole("customer")  
│ │ ├── (admin)/ dashboard, bookings, quotes, services, packages,  
│ │ │ portfolio, media, blog, testimonials, faq, payments,  
│ │ │ calendar, reports, settings, users  
│ │ │ — guarded by requireRole("admin")  
│ │ └── api/webhooks/ paystack/, cloudinary/  
│ ├── components/ ui/ (shadcn), forms/, marketing/, dashboard/  
│ └── lib/ supabase client, query hooks, validators  
├── backend/  
│ └── edge-functions/ send-notification, generate-invoice, quote-to-booking  
├── database/  
│ ├── migrations/ numbered SQL migrations (see Backend Schema doc)  
│ ├── policies/ RLS policy SQL, one file per table  
│ └── seed/ reference data (service categories, event types)  
└── shared/  
└── schemas/ Zod schemas shared by forms, API routes, and edge functions  
Business logic that must run with elevated privilege or outside a request/response cycle (sending a notification, converting an accepted quote into a confirmed booking with frozen prices, generating an invoice PDF) lives in Supabase Edge Functions under backend/edge-functions rather than in Next.js API routes, so it is callable from Postgres triggers as well as from the app.

**4\. Roles & Permission Matrix**
=================================

Two roles, consistent with the cross-portfolio pattern: Admin and User. "Customer" and "Public/guest" are not separate role tiers — a guest is simply an unauthenticated User, and every authenticated User is a customer by default. Staff assignment (Phase 4) is a contextual flag (is\_staff) on a User row, not a third role, mirroring the buyer/seller and guide/vendor pattern used elsewhere in the portfolio.

| **Capability** | **Guest (public)** | **User (customer)** | **Admin** |
| --- | --- | --- | --- |
| Browse public site, portfolio, services | ✅ | ✅ | ✅ |
| Submit Quote / Booking request | ✅ | ✅ | — |
| View own bookings/quotes/payments | — | ✅ (own only) | ✅ (all) |
| Accept/reject a sent quote | — | ✅ (own only) | — |
| Create/send a quote | — | — | ✅ |
| Manage Services, Packages, Portfolio, Blog, FAQ, Testimonials | — | — | ✅ |
| Upload/organize Media Library | — | — | ✅ |
| Record payments / view financial reports | — | — | ✅ |
| View Production Calendar | — | — | ✅ |
| Manage Equipment & Staff (Phase 4) | — | — | ✅ |
| View audit logs | — | — | ✅ |

**_Note:_** _Enforced at two layers: Next.js middleware checks the session role before rendering a (customer) or (admin) route group, and Postgres Row-Level Security independently enforces the same rule at the data layer — see Backend Schema §5 — so a bug in the frontend guard cannot expose another customer's data._

**5\. Data Model Summary**
==========================

The full column-level schema lives in the companion Backend Schema document. The pattern worth calling out here is snapshot pricing: a quote\_line\_items row and a booking\_services row each store the price agreed at that moment, copied from the service/package at write time. If the owner later changes a service's list price, every past quote and booking keeps the price the customer actually agreed to — prices are never recalculated live from the current catalog, matching the snapshot-pricing rule applied across the Codey Dev portfolio.

*   Concurrency safety for Phase 4 equipment allocation follows the same portfolio pattern used for other booking systems: a partial unique index preventing two allocations of the same equipment item over overlapping date ranges, checked at SERIALIZABLE isolation.
*   Availability (e.g. "is this date already booked") is computed on read from the bookings table, not tracked via a separate mutable counter that could drift out of sync.
*   Audit logging is append-only: booking/quote/payment mutations write a row to audit\_logs and never update or delete one.

**6\. API Specification**
=========================

Most reads/writes go directly from the client to Supabase (Postgres + RLS) via the generated client, so there is no hand-written REST layer for ordinary CRUD. Explicit API routes exist only where request-time server logic, webhook handling, or a privileged operation is required.

| **Route** | **Method** | **Purpose** | **Auth** |
| --- | --- | --- | --- |
| /api/quotes/\[id\]/accept | POST | Customer accepts a quote; triggers the quote → booking conversion edge function and freezes prices. | User (owner of quote) |
| /api/bookings/\[id\]/status | PATCH | Admin transitions a booking's status (Pending → Confirmed → In Progress → Completed/Cancelled); writes an audit log row. | Admin |
| /api/payments | POST | Records a manual payment (cash/bank/MoMo-direct) against a booking; recalculates outstanding balance. | Admin |
| /api/payments/paystack/initiate | POST | Creates a Paystack transaction for a deposit/balance and returns the checkout reference. | User or Admin |
| /api/webhooks/paystack | POST | Verifies Paystack signature, marks the matching payment as confirmed, triggers a receipt email. | Webhook secret |
| /api/webhooks/cloudinary | POST | Confirms an upload finished processing (esp. video) and updates the media\_library row's status. | Webhook secret |
| /api/media/sign-upload | POST | Issues a short-lived signed Cloudinary upload token scoped to a category/folder. | Admin |
| /api/invoices/\[paymentId\] | GET | Streams a generated invoice/receipt PDF for a given payment. | User (own) or Admin |
| /api/notify | POST (internal) | Called by edge functions/triggers to dispatch an email via Resend for a status/quote/payment event. | Service role only |

**_Note:_** _Ordinary list/detail reads (services, portfolio, packages, own bookings, own quotes) are not listed above — they are RLS-scoped Supabase queries, not custom endpoints._

**7\. Third-Party Integrations**
================================

| **Service** | **Used for** | **Failure handling** |
| --- | --- | --- |
| Paystack | Card and Mobile Money payments for deposits/balances. | Manual payment recording remains available if Paystack is unreachable or the merchant account isn't yet verified — payments tracking never hard-depends on the integration. |
| Cloudinary | Signed media uploads, image/video transforms, CDN delivery for the Media Library and portfolio. | Upload failures surface a retry prompt in the admin uploader; large video uploads are chunked to survive flaky connections. |
| Resend | Transactional email: quote sent, booking confirmed, payment received. | Failed sends are retried once and logged; the underlying record (quote/booking/payment) is never blocked on email succeeding. |
| Arcjet | Rate limiting and bot filtering on the public Quote and Booking forms. | Fails open with a lower rate-limit ceiling rather than blocking legitimate submissions outright if the service is degraded. |
| WhatsApp (click-to-chat, wa.me links) | Primary low-friction contact channel throughout the public site. | No API dependency — it's a deep link, not an integration that can go down. |

**8\. Threat Model**
====================

STRIDE-style review of the assets and flows most exposed by this system: public-facing forms, customer financial data, and admin content controls.

| **Asset / Flow** | **Threat** | **Mitigation** |
| --- | --- | --- |
| Public Quote/Booking forms | Spam/bot flooding, or scraping for enumeration. | Arcjet rate limiting + honeypot field; Zod server-side validation independent of client validation; no auto-confirmation (admin reviews every submission). |
| Customer session / auth | Session hijacking, credential stuffing. | Supabase Auth (hashed credentials, secure HTTP-only cookies); rate-limited login attempts; password reset via time-limited email token. |
| Cross-customer data access | One customer viewing another's booking, quote, or payment data. | Row-Level Security on every customer-facing table, scoped to auth.uid() = customer\_id, verified independently of the Next.js middleware guard (defense in depth). |
| Admin console takeover | Compromised admin credentials used to alter prices, delete portfolio content, or exfiltrate customer data. | Admin role required at both middleware and RLS; all admin mutations on bookings/quotes/payments write an append-only audit log; 2FA for admin scoped as a Phase 4 hardening item. |
| File upload abuse | Malicious file types uploaded via the Media Library or a booking attachment, oversized files exhausting storage. | MIME-type and extension allowlist enforced server-side (not just in the file picker), size caps per upload, Cloudinary-side scanning/transformation before public serving. |
| Payment webhook spoofing | Forged Paystack webhook calls marking an unpaid booking as paid. | Paystack signature verification on every /api/webhooks/paystack call; payment status only changes from a verified webhook or an authenticated admin action, never from client input. |
| Price tampering | Client-side manipulation of a submitted price/total before it reaches the server. | Server always recalculates totals from stored line items server-side; client-submitted totals are display-only and never trusted for the write. |
| Quote/price integrity over time | A later service price change silently altering an already-agreed quote or booking total. | Snapshot pricing (see §5): line items store the agreed price at acceptance time, immune to later catalog changes. |
| Media/content injection | Stored XSS via blog post body, testimonial text, or service descriptions rendered on the public site. | Rich text sanitized server-side before storage and again at render (allowlist-based sanitizer), no raw HTML accepted from non-admin input. |
| Secrets exposure | Cloudinary/Paystack/Resend/Arcjet API keys leaking via client bundle or repo. | All secret keys server-only env vars, never NEXT\_PUBLIC\_\*; signed/short-lived tokens issued to the client for uploads instead of exposing the Cloudinary API secret. |

**9\. Media & File Handling Pipeline**
======================================

1.  Admin selects files in the Media Library uploader; the client requests a signed upload credential from /api/media/sign-upload, scoped to the chosen category/folder.
2.  Client uploads directly to Cloudinary using the signed credential (server never proxies the file bytes).
3.  Cloudinary transforms the asset (responsive image derivatives; adaptive bitrate for video where applicable) and calls /api/webhooks/cloudinary on completion.
4.  The webhook writes/updates the corresponding media\_library row (status, dimensions, duration, delivery URL) and, if the upload was attached to a portfolio project during the upload step, links it via project\_media.
5.  Public pages request Cloudinary-delivered, responsively-sized derivatives — never the original upload — for performance.

**10\. Performance & Scalability Considerations**
=================================================

*   ISR (Incremental Static Regeneration) for Service and Portfolio pages — content changes in the CMS but doesn't need to be instantaneous on the public site, so pages regenerate on a short revalidation window rather than being fully dynamic on every request.
*   The Production Calendar and Admin Dashboard are the only genuinely real-time surfaces (new booking/quote should appear without a refresh) — implemented with Supabase Realtime subscriptions, not polling.
*   Portfolio/gallery images use Cloudinary's responsive delivery (srcset-driven) rather than shipping one fixed size to every device.
*   Database indexes on booking\_date, status columns, and foreign keys used in RLS policies (customer\_id, admin lookups) to keep calendar and dashboard queries fast as booking volume grows — see Backend Schema §6.

**11\. Environment & Configuration**
====================================

| **Variable** | **Purpose** |
| --- | --- |
| NEXT\_PUBLIC\_SUPABASE\_URL / NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY | Client-side Supabase connection (safe to expose; RLS does the enforcement). |
| SUPABASE\_SERVICE\_ROLE\_KEY | Server-only key for edge functions/webhooks that must bypass RLS deliberately (e.g. writing an audit log on behalf of the system). |
| CLOUDINARY\_CLOUD\_NAME / API\_KEY / API\_SECRET | Server-only; used to mint signed upload tokens. |
| PAYSTACK\_SECRET\_KEY / NEXT\_PUBLIC\_PAYSTACK\_PUBLIC\_KEY | Payment initiation and webhook signature verification. |
| RESEND\_API\_KEY | Transactional email dispatch. |
| ARCJET\_KEY | Bot/spam protection on public forms. |
| WHATSAPP\_BUSINESS\_NUMBER | Used to build wa.me deep links consistently across the site. |

**12\. Error Handling & Logging**
=================================

*   User-facing form errors are field-level (Zod messages surfaced inline), never a raw stack trace or database error string.
*   Server errors in API routes/edge functions are logged with enough context to reproduce (route, payload shape, user/role) but never log full payment card data or raw webhook secrets.
*   All admin-performed create/update/delete on bookings, quotes, payments, and content is written to audit\_logs (append-only, actor, action, before/after where practical, timestamp).
*   Failed webhook verifications (Paystack/Cloudinary) are logged and alert the admin rather than failing silently, since a missed payment webhook directly affects the balance shown to a customer.