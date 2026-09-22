**RAVENOUS STUDIO PRODUCTION**  
**App Flow**  
Sitemap, Journeys & Process Flows  
**Prepared for:** Ravenous Studio Production  
**Prepared by:** Codey Dev — Aka Brown  
**Version:** 1.0  
**Date:** September 2026

Table of Contents
=================

**1\. Sitemap (V1 Scope)**
==========================

Reflects the client's full sitemap, marked by phase (see PRD §4). Phase 4-only branches are noted but not built in V1.  
RAVENOUS STUDIO PRODUCTION  
│  
├── PUBLIC WEBSITE \[Phase 1\]  
│ ├── Home  
│ ├── About (Story · Mission · Vision · Team · Equipment · Why Us)  
│ ├── Services (index + one page per service, e.g. /services/live-streaming)  
│ ├── Portfolio (filterable index + project detail)  
│ ├── Media / Gallery  
│ ├── Packages  
│ ├── Testimonials  
│ ├── Blog / News  
│ ├── FAQ  
│ ├── Request a Quote  
│ ├── Book a Service  
│ └── Contact  
│  
├── CUSTOMER AREA \[Phase 3, portal shell; galleries in Phase 4\]  
│ ├── Login / Register / Forgot Password  
│ └── Dashboard  
│ ├── Overview · My Bookings · My Quotes · Payments · Messages · Profile  
│ └── Event Portal (Photos/Videos/Downloads) \[Phase 4\]  
│  
└── ADMIN \[Phase 2–3 core, Phase 4 extensions\]  
├── Dashboard  
├── Bookings · Quotes · Customers  
├── Services · Packages · Portfolio · Media Library  
├── Content (Homepage/About/Blog/Testimonials/FAQ)  
├── Payments · Calendar · Reports  
├── Equipment · Staff \[Phase 4\]  
└── Settings · Users & Permissions · Audit Logs

**2\. Public Visitor Journey**
==============================

Lands on site (Google search, WhatsApp share, Instagram bio link)  
│  
▼  
Homepage — sees hero, service grid, featured work, testimonials  
│  
├──► Browses a Service page ──► sees included items, sample media,  
│ related portfolio, packages  
│  
├──► Browses Portfolio ──► filters by event type ──► opens a project  
│  
└──► Ready to act  
│  
├──► "Chat on WhatsApp" → opens wa.me deep link, exits flow  
├──► "Request a Quote" → Quote Request flow (§3)  
└──► "Book a Service" → Booking flow (§4)

**3\. Quote Request Flow**
==========================

Request a Quote (no login required)  
│  
Step 1 — Service(s) select one or more services  
Step 2 — Event details event type · date · location · expected attendance  
Step 3 — Requirements free-text additional requirements  
Step 4 — Contact info name · phone · email  
│  
▼  
Submit ──► Quote Request record created (status: New)  
│ │  
│ ▼  
│ Admin inbox: Quote Requests › New  
│ │  
│ ▼  
│ Admin builds a line-itemed quote (service, price, qty, total)  
│ │  
│ ▼  
│ Quote sent ──► email notification to customer  
│  
▼  
If the requester has/creates an account:  
Customer opens the quote ──► Accept / Reject / Request Changes  
│  
├──► Accept ──► Booking created/confirmed, prices frozen (snapshot)  
├──► Reject ──► Quote closed, admin notified  
└──► Request Changes ──► comment thread back to admin, quote revised

**4\. Booking Flow**
====================

Book a Service (no login required)  
│  
Service → Event → Date → Location → Requirements → Contact info  
│  
▼  
Submit ──► Booking created (status: Pending)  
│  
▼  
Admin reviews in Bookings › Pending  
│  
├──► Confirm ──► status: Confirmed ──► appears on Production Calendar  
│ ──► email: "Booking confirmed"  
│  
└──► Needs pricing first ──► hands off into Quote flow (§3),  
quote acceptance re-confirms the booking  
│  
▼ (on/after event date)  
Admin marks: In Progress ──► Completed  
│  
▼  
\[Phase 4\] Event gallery published ──► customer notified ──► Event Portal

**5\. Customer Account Flow**
=============================

Register / Login (email + password via Supabase Auth)  
│  
▼  
Dashboard Overview  
├── Active bookings, open quotes, upcoming event date, balance due  
│  
├──► My Bookings ──► Booking Detail (status, services, files \[P4\])  
├──► My Quotes ──► Quote Detail (Accept/Reject/Request Changes)  
├──► Payments ──► total / paid / balance, receipt downloads  
├──► Messages ──► thread with admin, tied to a booking \[P4\]  
└──► Profile ──► contact details  
  
On first login, any guest Quote/Booking submitted earlier with the same  
email/phone is automatically linked to the new account (see TDD FR-2.3).

**6\. Admin Operations Flow**
=============================

Admin Login ──► Dashboard  
│ KPIs: total/pending bookings, upcoming/completed events, revenue  
│ Recent Bookings · Upcoming Events (calendar preview)  
│  
├──► Bookings review, confirm, progress status, cancel  
├──► Quotes build line items, send, track accepted/rejected  
├──► Customers view customer + their booking/quote history  
├──► Services \\  
├──► Packages > create / edit / delete / reorder / feature  
├──► Portfolio /  
├──► Media Library upload → categorize → attach to project/gallery/service  
├──► Content homepage hero, about, blog, testimonials, FAQ  
├──► Payments record manual payment / view Paystack-confirmed payments  
├──► Calendar production calendar, conflict flags  
├──► Reports bookings by status, revenue by month, top services  
└──► Settings business info, SEO defaults, notification settings, users

**7\. Media Upload Flow (Admin)**
=================================

Media Library › Upload Media  
│  
Select files → Select type (Photo/Video/Document)  
│  
▼  
Client requests signed upload token ──► uploads directly to Cloudinary  
│  
▼  
Add metadata: title · description · category · event type · alt text (required)  
│  
▼  
Attach to: Portfolio project | General Gallery | Service page | Homepage feature  
│  
▼  
Publish ──► Cloudinary finishes processing ──► webhook updates media\_library row  
──► asset appears on the public site

**8\. Notification Flow**
=========================

| **Trigger event** | **Recipient** | **Channel (V1)** | **Channel (V2)** |
| --- | --- | --- | --- |
| New Quote Request submitted | Admin | Dashboard + email | \+ SMS/WhatsApp |
| New Booking Request submitted | Admin | Dashboard + email | \+ SMS/WhatsApp |
| Quote sent to customer | Customer | Email | \+ WhatsApp |
| Quote accepted / rejected | Admin | Dashboard + email | \+ SMS |
| Booking status changed | Customer | Email | \+ WhatsApp |
| Payment received (manual or Paystack) | Customer + Admin | Email + receipt | \+ SMS |
| Event gallery published | Customer | — | Email + WhatsApp (Phase 4) |

**9\. Payment Flow**
====================

Quote accepted ──► Booking confirmed, total frozen (snapshot pricing)  
│  
▼  
Deposit due  
├──► Customer pays via Paystack (card/MoMo) ──► webhook verifies ──► status: Paid  
└──► OR Admin records a manual payment (cash/bank/MoMo-direct) ──► status: Paid  
│  
▼  
Balance = Total − Sum(confirmed payments) (recalculated server-side on every payment)  
│  
▼  
Receipt/invoice generated per payment ──► emailed + downloadable from customer dashboard  
│  
▼  
Balance reaches 0 ──► booking flagged fully paid on admin dashboard and calendar