**RAVENOUS STUDIO PRODUCTION**  
**Product Requirements Document**  
Studio Production & Media Management Platform  
**Prepared for:** Ravenous Studio Production  
**Prepared by:** Codey Dev — Aka Brown  
**Version:** 1.0  
**Date:** September 2026

Table of Contents
=================

**1\. Executive Summary**
=========================

Ravenous Studio Production is an event production and media company offering LED screen rental, live streaming, live recording, funeral and wedding coverage, gospel and outdoor event production, photography, and videography, backed by a full production rig (cameras, mixers, streaming encoders, wireless links). The business currently markets itself through a single flyer and a phone number, with no web presence, no self-serve way for a client to see past work, request a quote, or book a date, and no system for the owner to publish new photos or videos without developer help.  
This document defines the product to be built: not a brochure website, but a Studio Production & Media Management Platform — a public marketing site backed by a booking and quoting engine, a media library the owner can manage independently, and a lightweight business-operations layer (bookings, payments, calendar) that grows into a full customer portal and equipment/staff scheduling system in later phases.  
**_Note:_** _The client asked to "use blue and black"; the reasoning behind the proposed palette (blue as the structural color, black kept as a supporting neutral rather than the whole identity) is in the Design Brief, §2. This document is scoped so the visual direction can be finalized without blocking functional requirements._

**2\. Problem Statement & Business Goals**
==========================================

**2.1 Problem Statement**
-------------------------

*   Prospective clients discover Ravenous through word of mouth, WhatsApp forwards of the flyer, or in-person referral — there is no searchable, always-on presence.
*   There is no way for a prospect to see categorized past work (weddings vs. funerals vs. gospel events) before committing to a booking enquiry.
*   Enquiries, quotes, and booking dates are currently tracked informally (calls/WhatsApp), risking double-booking of equipment or crew and lost follow-ups.
*   The owner has no way to publish new event photos/videos without contacting a developer, so the portfolio goes stale between projects.
*   There is no record of who paid what deposit/balance for which event, and no formal quote-to-invoice trail.

**2.2 Business Goals**
----------------------

1.  Convert flyer traffic (WhatsApp/Instagram shares) into a credible, searchable web presence that ranks for Accra-area production searches (e.g. "live streaming services in Accra").
2.  Reduce enquiry-to-booking friction with a structured quote/booking flow that still allows a one-tap WhatsApp escape hatch, since that is how the client currently operates.
3.  Give the owner full self-service control over services, packages, portfolio, and media without needing a developer for routine updates.
4.  Create a single source of truth for bookings, quotes, deposits/balances, and the events calendar so equipment and crew are not double-booked.
5.  Lay a foundation (data model + portal shell) that can grow into full customer-facing event delivery — private galleries, downloadable files, payment history — without a rebuild.

**3\. Target Users & Personas**
===============================

**3.1 Public Visitor**
----------------------

Someone planning a wedding, funeral, gospel event, or corporate/outdoor function in or around Accra, searching for a production vendor or following a WhatsApp/Instagram referral. Wants to see real past work in their event category, understand what is included, and get a price or availability answer with minimal back-and-forth.

**3.2 Client / Customer**
-------------------------

A visitor who has requested a quote or made a booking. Wants to track the status of their booking/quote, see what they owe and what they have paid, and — once the event has happened — receive their photos and videos without chasing the studio for a WeTransfer link.

**3.3 Studio Owner / Admin**
----------------------------

Runs the business day-to-day: confirms bookings, prepares and sends quotes, uploads new portfolio media after every event, tracks who has paid, and needs a calendar view so two events don't get booked against the same LED screen or camera operator on the same day.

**3.4 Crew / Staff (V2)**
-------------------------

Photographers, camera operators, and technicians who need to know what they're assigned to and when. Full self-service scheduling for staff is scoped as Phase 3+ (see §4); V1 crew names may be recorded against a booking for the admin's own reference, but staff do not get logins in V1.

**4\. Product Scope — Phased Roadmap**
======================================

Building the entire system described in the client's brief in one release would delay launch and risk shipping features the owner isn't yet ready to operate (e.g. staff logins, equipment tracking) before the simpler booking/quote/media loop is even in daily use. Scope is phased so each release is independently useful.

**Phase 1 (V1) — Public Website & Discovery**
---------------------------------------------

*   Home, About, Services (with individual service pages), Portfolio, Media/Gallery, Packages, Testimonials, Blog/News, FAQ, Contact
*   Request a Quote and Book a Service forms (guest-accessible, no login required)
*   WhatsApp click-to-chat entry points throughout (hero, service pages, floating action button)
*   SEO fundamentals: per-service metadata, Open Graph images, sitemap.xml, structured data for LocalBusiness

**Phase 2 (V1) — Admin CMS & Enquiry Handling**
-----------------------------------------------

*   Admin authentication and dashboard (bookings/quotes/revenue snapshot)
*   Services, Packages, and Portfolio management (create/edit/delete, reorder, feature)
*   Media Library: upload photos/videos/documents, categorize by event type, attach to portfolio projects
*   Blog, Testimonials, and FAQ management
*   Quote Requests inbox → build a line-itemed quote → send → track accepted/rejected
*   Bookings inbox with status pipeline: Pending → Confirmed → In Progress → Completed / Cancelled

**Phase 3 (V1) — Business Operations**
--------------------------------------

*   Customer accounts (register/login) tied to their own bookings and quotes — replaces guest-only flow
*   Production Calendar: unified view of bookings by date, with conflict warnings for the same date
*   Payments: record deposits/balances against a quote, generate a simple invoice/receipt (manual or Paystack-initiated, see TDD §7)
*   Notifications: booking confirmed, quote ready, payment received (email; SMS/WhatsApp templates prepared for V2)
*   Basic Reports: bookings by status, revenue by month, most-requested services

**Phase 4 (V2) — Advanced Platform**
------------------------------------

*   Customer Event Portal: private per-event gallery with access link/code, downloadable photos/videos
*   Equipment inventory and per-event equipment allocation with double-booking prevention
*   Staff/crew accounts, assignment, and availability
*   Marketing: promotions, discount codes, newsletter
*   Advanced analytics: traffic sources, enquiry→booking conversion, repeat customers
*   Two-factor authentication for admin, full audit log UI

**_Note:_** _Everything in Phase 4 is designed for in the data model now (see Backend Schema) so V1 does not have to be re-architected to add it — but only Phases 1–3 are built and billed in the initial engagement._

**5\. Functional Requirements**
===============================

**5.1 Public Website**
----------------------

| **ID** | **Requirement** | **Phase** |
| --- | --- | --- |
| FR-1.1 | Homepage with hero, service showcase grid, featured portfolio work, video showcase, testimonials, and primary CTAs (Book a Service, Request a Quote, WhatsApp). | P1 |
| FR-1.2 | Individual page per service (e.g. /services/live-streaming) with description, what's included, equipment used, sample media, related past projects, packages, and a Request Quote / Book Service CTA. | P1 |
| FR-1.3 | Portfolio listing filterable by event type (Weddings, Funerals, Gospel, Outdoor, Corporate, Live Streaming, Live Recording, LED Screen, Photography, Videography). | P1 |
| FR-1.4 | Portfolio project detail page: title, event type, client (optional/anonymized), date, location, services provided, cover image, photo grid, video embeds, description. | P1 |
| FR-1.5 | Media/Gallery hub separate from Portfolio for standalone photos/reels/behind-the-scenes not tied to a specific project. | P1 |
| FR-1.6 | Packages listing grouped by event type, each linking to its constituent services and (optional) published starting price. | P1 |
| FR-1.7 | Testimonials, Blog/News, and FAQ pages, all sourced from the admin CMS. | P1 |
| FR-1.8 | Contact page with business info, map/location, and the same Quote/Book/WhatsApp CTAs. | P1 |

**5.2 Quote & Booking**
-----------------------

| **ID** | **Requirement** | **Phase** |
| --- | --- | --- |
| FR-2.1 | Request a Quote form: service(s), event type, date, location, expected attendance, additional requirements, contact details. Submittable without an account. | P1 |
| FR-2.2 | Book a Service form: service, event, date, location, requirements, contact info — creates a Pending booking for admin review (this is a request, not an instant-confirm slot). | P1 |
| FR-2.3 | Guest submissions are linked to a customer account automatically if the visitor later registers with the same email/phone. | P1 |
| FR-2.4 | Admin builds a line-itemed quote (service, description, unit price, quantity, total) against a quote request and sends it to the customer. | P2 |
| FR-2.5 | Customer can view a sent quote and Accept, Reject, or Request Changes (comment) on it. | P3 |
| FR-2.6 | Accepting a quote can create/confirm a booking and freezes the quoted prices against that booking (snapshot pricing — see TDD §5 and Engineering Principles). | P3 |
| FR-2.7 | Booking status pipeline: Pending → Confirmed → In Progress → Completed, with a separate Cancelled state, each with an admin-visible timestamped history. | P2 |

**5.3 Customer Account**
------------------------

| **ID** | **Requirement** | **Phase** |
| --- | --- | --- |
| FR-3.1 | Register, log in, and reset password via email; social login is out of scope for V1. | P3 |
| FR-3.2 | Dashboard overview: active bookings, open quotes, upcoming event date, outstanding balance. | P3 |
| FR-3.3 | My Bookings / My Quotes lists with detail pages mirroring the admin's record for that customer. | P3 |
| FR-3.4 | Payments view: total, paid-to-date, balance, and receipt downloads per payment. | P3 |
| FR-3.5 | Event Files / private gallery (photos, videos, downloads) tied to a completed booking. | P4 |
| FR-3.6 | In-app messages thread between customer and admin per booking, backed by the same notification pipeline used for status changes. | P4 |

**5.4 Media Library & Content Management**
------------------------------------------

| **ID** | **Requirement** | **Phase** |
| --- | --- | --- |
| FR-4.1 | Admin can upload images (JPG/PNG/WebP), video (MP4 and common formats), and documents (PDF), tag with type/category/event, title, and description. | P2 |
| FR-4.2 | Uploaded media can be attached to a Portfolio project, the general Gallery, a Service page, or the Homepage featured sections. | P2 |
| FR-4.3 | Admin can create/edit/delete/reorder/feature Services, Packages, Portfolio projects, Blog posts, Testimonials, and FAQs without developer involvement. | P2 |
| FR-4.4 | Homepage hero copy/media, "Why Ravenous" bullets, and featured services/projects are editable from the CMS. | P2 |

**5.5 Calendar & Operations**
-----------------------------

| **ID** | **Requirement** | **Phase** |
| --- | --- | --- |
| FR-5.1 | Production Calendar showing bookings by date; the same date can hold multiple bookings, but the admin sees a visible flag when combined equipment/crew requirements look likely to conflict. | P3 |
| FR-5.2 | Equipment inventory with per-item status and per-event allocation, enforcing no equipment item is double-booked for overlapping event dates. | P4 |
| FR-5.3 | Staff/crew records, role, and per-event assignment; staff availability calendar. | P4 |

**5.6 Payments & Notifications**
--------------------------------

| **ID** | **Requirement** | **Phase** |
| --- | --- | --- |
| FR-6.1 | Record a deposit and a balance payment against a confirmed quote/booking; compute and display outstanding balance. | P3 |
| FR-6.2 | Generate a simple invoice/receipt PDF per payment. | P3 |
| FR-6.3 | Online payment initiation via Paystack (card + Mobile Money) as an option alongside manually-recorded (cash/bank/MoMo-direct) payments. | P3 |
| FR-6.4 | Email notifications for: quote sent, quote accepted, booking confirmed, payment received, event gallery available (V2). SMS/WhatsApp templates prepared but not required to send in V1. | P3 |

**5.7 Marketing & SEO**
-----------------------

| **ID** | **Requirement** | **Phase** |
| --- | --- | --- |
| FR-7.1 | Per-page SEO fields (title, meta description, OG image, canonical URL) editable in the CMS for services and portfolio projects. | P1 |
| FR-7.2 | Auto-generated sitemap.xml and robots.txt. | P1 |
| FR-7.3 | Promotions/discount codes and newsletter signup. | P4 |

**6\. Non-Functional Requirements**
===================================

| **Category** | **Requirement** |
| --- | --- |
| Performance | Public pages (Home, Service, Portfolio) achieve Lighthouse Performance ≥ 90 on mobile; images/video served through a CDN with responsive sizing. |
| Availability | Free-tier-first infrastructure (Vercel + Supabase) is acceptable for this business's traffic profile; no 24/7 uptime SLA required (this is not an emergency-critical system). |
| Security | Admin routes protected by authentication + role check at both the middleware and database (RLS) layer; file uploads validated by type/size before storage; booking/quote forms protected against bot spam (Arcjet). |
| Accessibility | Public site meets WCAG 2.1 AA for color contrast, keyboard navigation, and alt text on all published media. |
| Localization | Ghana market defaults: GHS currency formatting, Ghana Post GPS-friendly address fields, phone numbers in local format, WhatsApp as a first-class contact channel. |
| Data integrity | Quote/booking prices are frozen at acceptance and never silently recalculated from a later price change to the underlying service (snapshot pricing). |
| Media limits | Video uploads reasonably capped (e.g. 500 MB per file) with clear owner-facing error messaging on rejection. |
| Auditability | All admin create/update/delete actions on bookings, quotes, and payments are recorded in an append-only audit log. |

**7\. Success Metrics**
=======================

| **Category** | **Requirement** |
| --- | --- |
| Discovery | Organic search impressions/clicks for target service keywords, tracked from launch month 1 (baseline: effectively zero pre-launch). |
| Conversion | Visitor → quote-request rate, and quote-request → confirmed-booking rate. |
| Owner efficiency | Reduction in developer-assisted content updates (target: zero routine media/portfolio updates need a developer after handover). |
| Operational accuracy | Zero double-booked equipment/dates once Phase 4 equipment tracking ships; deposit/balance figures always reconcile to recorded payments. |
| Retention | Repeat-customer bookings and testimonial volume, tracked from Phase 3 onward. |

**8\. Out of Scope (V1)**
=========================

*   Staff/crew logins and self-service scheduling (Phase 4).
*   Equipment inventory and allocation (Phase 4).
*   Private per-event customer galleries and file downloads (Phase 4) — the data model supports it, the UI does not ship in V1.
*   Promotions, discount codes, and newsletter (Phase 4).
*   Native mobile app — V1 is a responsive web app only.
*   Multi-currency support beyond GHS.

**9\. Assumptions & Dependencies**
==================================

*   Client supplies logo source files, a final brand color decision (see Design Brief §2), and initial portfolio media (photos/videos from past events) for launch content.
*   Client has or will obtain a Paystack merchant account before Phase 3 payments go live.
*   A dedicated business WhatsApp number is available for the click-to-chat integration.
*   Domain name and DNS access are available for Vercel deployment.
*   Video hosting/transcoding is handled by Cloudinary within its free/starter tier limits for V1 volume; this is a documented upgrade trigger if event video volume grows quickly (see TDD §2).

**10\. Risks**
==============

| **Category** | **Requirement** |
| --- | --- |
| Content readiness | The site's credibility depends on real portfolio media; if the client is slow to supply organized past-event photos/video, launch quality suffers. Mitigation: placeholder-flagged sections per project checklist, populated post-handover via the Media Library. |
| Scope creep | The client's original brief describes the full Phase 1–4 system; there is a risk of expecting all of it in V1. Mitigation: this document's phased roadmap is the contract reference for what ships when. |
| Payment provider onboarding | Paystack merchant verification can take time. Mitigation: manual payment recording (FR-6.1/6.2) does not depend on Paystack, so bookings/payments tracking works even before online payment goes live. |
| Free-tier limits | Media-heavy usage (many large videos) can exceed Supabase/Cloudinary free-tier storage or bandwidth. Mitigation: documented upgrade triggers per Engineering Principles' infrastructure philosophy. |