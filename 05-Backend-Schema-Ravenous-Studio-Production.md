**RAVENOUS STUDIO PRODUCTION**  
**Backend Schema**  
Database Design & Entity Reference  
**Prepared for:** Ravenous Studio Production  
**Prepared by:** Codey Dev — Aka Brown  
**Version:** 1.0  
**Date:** September 2026

Table of Contents
=================

**1\. Schema Overview & Conventions**
=====================================

*   Database: PostgreSQL via Supabase. All tables use uuid primary keys (default gen\_random\_uuid()).
*   Every table has created\_at and updated\_at (timestamptz, default now(), updated via trigger).
*   Soft-delete is not used for financial records (quotes, bookings, payments) — these are status-flagged (e.g. cancelled) and retained; content tables (services, portfolio, blog) use a published boolean plus a deleted\_at nullable column for admin-facing trash/restore.
*   Money columns are numeric(12,2) and always denominated in GHS for V1 (see PRD §8, Out of Scope).
*   Two-role model: a single users table (mirroring auth.users) carries a role enum ('admin' | 'customer') plus an is\_staff boolean for the Phase 4 contextual staff flag — there is no separate staff table with its own login.

**_Note:_** _Tables marked (Phase 4) are included now so the schema doesn't need breaking migrations later, per PRD §4 — they are not exposed in the V1 UI._

**2\. Entity Summary**
======================

| **Table** | **Purpose** | **Phase** |
| --- | --- | --- |
| users | Extends Supabase auth.users with role, contact info, staff flag. | 1 |
| service\_categories | Groups services (e.g. "Event Coverage", "Streaming & Recording"). | 1 |
| services | Individual bookable services (LED Screen, Live Streaming, …). | 1 |
| packages | Bundled offers grouping several services with a combined price. | 1 |
| package\_items | Join table: which services (and quantities) make up a package. | 1 |
| portfolio\_projects | Past event case studies shown in the Portfolio. | 1 |
| project\_media | Join table: media items attached to a portfolio project. | 1 |
| media\_library | Every uploaded photo/video/document and its Cloudinary reference. | 1 |
| quote\_requests | Raw incoming quote enquiries (guest or customer). | 1 |
| quotes | An admin-prepared, priced quote against a quote\_request. | 2 |
| quote\_line\_items | Priced line items on a quote (snapshot pricing). | 2 |
| bookings | A confirmed or pending engagement for a date/service. | 1 |
| booking\_services | Join table: services on a booking, with snapshot price. | 1 |
| payments | A single payment (deposit/balance) against a booking. | 3 |
| invoices | Generated invoice/receipt documents for a payment. | 3 |
| equipment | Inventory items (cameras, LED panels, mixers, …). | 4 |
| equipment\_assignments | Which equipment is allocated to which booking/date range. | 4 |
| staff\_assignments | Which staff (is\_staff users) are assigned to a booking. | 4 |
| testimonials | Customer reviews shown on the public site. | 1 |
| blog\_posts | Blog/News articles. | 1 |
| faqs | Frequently asked questions, grouped by topic. | 1 |
| site\_content | Editable CMS blocks (homepage hero, about page, why-us bullets, etc.). | 1 |
| notifications | Dispatched/queued notification log (email/SMS/WhatsApp). | 1 |
| audit\_logs | Append-only record of admin mutations on sensitive tables. | 1 |
| settings | Single-row/key-value business settings (contact info, SEO defaults, payment config). | 1 |

**3\. Table Definitions**
=========================

**users**
---------

Mirrors auth.users (id is the same uuid as Supabase Auth); extended with app-specific fields.

| **Column** | **Type** | **Notes** |
| --- | --- | --- |
| id | uuid, PK | \= auth.users.id |
| full\_name | text | Required |
| phone | text | Ghana format; used for WhatsApp linking and guest-record matching |
| email | text, unique | Mirrors auth email |
| role | enum('admin','customer') | Default 'customer' |
| is\_staff | boolean | Phase 4 contextual flag; false in V1 for everyone |
| avatar\_url | text, nullable |  |
| created\_at / updated\_at | timestamptz |  |

**service\_categories**
-----------------------

| **Column** | **Type** | **Notes** |
| --- | --- | --- |
| id | uuid, PK |  |
| name | text | e.g. "Event Coverage", "Streaming & Recording" |
| slug | text, unique |  |
| sort\_order | int | Admin-controlled display order |

**services**
------------

| **Column** | **Type** | **Notes** |
| --- | --- | --- |
| id | uuid, PK |  |
| category\_id | uuid, FK → service\_categories |  |
| name | text | e.g. "Live Streaming" |
| slug | text, unique | Drives /services/\[slug\] |
| short\_description | text | Card/grid summary |
| description | text (rich) | Full service page body |
| equipment\_used | text\[\] | Bullet list on the service page |
| starting\_price | numeric(12,2), nullable | Null = "Contact for pricing" |
| cover\_media\_id | uuid, FK → media\_library, nullable |  |
| seo\_title / seo\_description / og\_image\_id | text / text / uuid | Per-page SEO (PRD FR-7.1) |
| is\_featured | boolean | Shown in homepage services showcase |
| published | boolean |  |
| sort\_order | int |  |

**packages**
------------

| **Column** | **Type** | **Notes** |
| --- | --- | --- |
| id | uuid, PK |  |
| name | text | e.g. "Wedding Package — Silver" |
| event\_type | text | Wedding / Funeral / Gospel / Outdoor / Custom |
| description | text |  |
| price | numeric(12,2), nullable | Combined package price, if published |
| published | boolean |  |

**package\_items**
------------------

Join table between packages and services.

| **Column** | **Type** | **Notes** |
| --- | --- | --- |
| id | uuid, PK |  |
| package\_id | uuid, FK → packages |  |
| service\_id | uuid, FK → services |  |
| quantity | int | Default 1 |

**portfolio\_projects**
-----------------------

| **Column** | **Type** | **Notes** |
| --- | --- | --- |
| id | uuid, PK |  |
| title | text | e.g. "Gospel Concert — Accra" |
| event\_type | text | Wedding / Funeral / Gospel / Outdoor / Corporate / … |
| client\_name | text, nullable | May be anonymized per client's wishes |
| event\_date | date |  |
| location | text |  |
| services\_provided | uuid\[\] | References services.id — denormalized array for fast tag display |
| cover\_media\_id | uuid, FK → media\_library |  |
| description | text |  |
| is\_featured | boolean |  |
| published | boolean |  |

**project\_media**
------------------

Join table between portfolio\_projects and media\_library.

| **Column** | **Type** | **Notes** |
| --- | --- | --- |
| id | uuid, PK |  |
| project\_id | uuid, FK → portfolio\_projects |  |
| media\_id | uuid, FK → media\_library |  |
| sort\_order | int |  |

**media\_library**
------------------

Every uploaded asset, regardless of where it's used.

| **Column** | **Type** | **Notes** |
| --- | --- | --- |
| id | uuid, PK |  |
| type | enum('image','video','document') |  |
| category | text | Weddings / Funerals / Gospel / Outdoor / Corporate / Behind the Scenes / … |
| title | text |  |
| description | text, nullable |  |
| alt\_text | text | Required for images (Design Brief §8 accessibility rule) |
| cloudinary\_public\_id | text, unique |  |
| delivery\_url | text | CDN URL |
| width / height / duration\_seconds | int / int / numeric | Populated by the Cloudinary webhook (TDD §9) |
| status | enum('processing','ready','failed') |  |
| uploaded\_by | uuid, FK → users |  |

**quote\_requests**
-------------------

Raw incoming enquiry before an admin has priced it.

| **Column** | **Type** | **Notes** |
| --- | --- | --- |
| id | uuid, PK |  |
| customer\_id | uuid, FK → users, nullable | Null for guest submissions |
| guest\_name / guest\_email / guest\_phone | text | Populated when customer\_id is null |
| service\_ids | uuid\[\] | References services.id |
| event\_type | text |  |
| event\_date | date |  |
| location | text |  |
| expected\_attendance | int, nullable |  |
| requirements | text |  |
| status | enum('new','quoted','closed') |  |

**quotes**
----------

An admin-prepared, sent quote against a request.

| **Column** | **Type** | **Notes** |
| --- | --- | --- |
| id | uuid, PK |  |
| quote\_request\_id | uuid, FK → quote\_requests |  |
| customer\_id | uuid, FK → users, nullable | Backfilled once a guest registers (PRD FR-2.3) |
| status | enum('draft','sent','accepted','rejected','changes\_requested') |  |
| total | numeric(12,2) | Server-computed sum of quote\_line\_items — never client-submitted |
| sent\_at / responded\_at | timestamptz, nullable |  |
| customer\_comment | text, nullable | Used for 'Request Changes' |

**quote\_line\_items**
----------------------

Snapshot-priced items on a quote — the core of the pricing-integrity pattern.

| **Column** | **Type** | **Notes** |
| --- | --- | --- |
| id | uuid, PK |  |
| quote\_id | uuid, FK → quotes |  |
| service\_id | uuid, FK → services, nullable | Reference only; price below is authoritative |
| description | text | e.g. "Photography — Full Day" |
| unit\_price | numeric(12,2) | Copied from the service at quote-build time, then frozen |
| quantity | int | Default 1 |
| line\_total | numeric(12,2) | unit\_price × quantity |

**bookings**
------------

| **Column** | **Type** | **Notes** |
| --- | --- | --- |
| id | uuid, PK |  |
| customer\_id | uuid, FK → users, nullable | Null until a guest registers |
| quote\_id | uuid, FK → quotes, nullable | Set if the booking originated from an accepted quote |
| guest\_name / guest\_email / guest\_phone | text | Populated for guest bookings |
| event\_type | text |  |
| event\_date | date |  |
| location | text |  |
| requirements | text |  |
| status | enum('pending','confirmed','in\_progress','completed','cancelled') |  |
| total | numeric(12,2) | Snapshot total — from quote\_line\_items if quoted, else set directly by admin |
| status\_history | jsonb | Append-only array of {status, changed\_by, at} for the admin-visible timeline (PRD FR-2.7) |

**booking\_services**
---------------------

Services on a booking that did not go through a formal quote (direct booking path).

| **Column** | **Type** | **Notes** |
| --- | --- | --- |
| id | uuid, PK |  |
| booking\_id | uuid, FK → bookings |  |
| service\_id | uuid, FK → services |  |
| unit\_price | numeric(12,2) | Snapshot price at booking confirmation |
| quantity | int | Default 1 |

**payments**
------------

| **Column** | **Type** | **Notes** |
| --- | --- | --- |
| id | uuid, PK |  |
| booking\_id | uuid, FK → bookings |  |
| type | enum('deposit','balance','full') |  |
| amount | numeric(12,2) |  |
| method | enum('paystack\_card','paystack\_momo','cash','bank\_transfer','momo\_direct') |  |
| status | enum('pending','confirmed','failed') |  |
| paystack\_reference | text, nullable | Set for Paystack-initiated payments |
| recorded\_by | uuid, FK → users, nullable | Admin who recorded a manual payment; null for customer-initiated Paystack |
| confirmed\_at | timestamptz, nullable |  |

**invoices**
------------

| **Column** | **Type** | **Notes** |
| --- | --- | --- |
| id | uuid, PK |  |
| payment\_id | uuid, FK → payments |  |
| invoice\_number | text, unique | Human-readable sequential reference |
| pdf\_url | text | Generated document location |

**equipment**
-------------

(Phase 4)

| **Column** | **Type** | **Notes** |
| --- | --- | --- |
| id | uuid, PK |  |
| name | text | e.g. "Canon C300 Mk III — Unit A" |
| category | enum('camera','lens','led\_screen','audio','lighting','streaming','other') |  |
| serial\_number | text, nullable |  |
| condition | enum('good','needs\_service','retired') |  |

**equipment\_assignments**
--------------------------

(Phase 4) — enforces no double-booking of the same item.

| **Column** | **Type** | **Notes** |
| --- | --- | --- |
| id | uuid, PK |  |
| equipment\_id | uuid, FK → equipment |  |
| booking\_id | uuid, FK → bookings |  |
| date\_range | daterange | Constrained by an EXCLUDE USING gist so overlapping ranges for the same equipment\_id are rejected at the database level |

**staff\_assignments**
----------------------

(Phase 4)

| **Column** | **Type** | **Notes** |
| --- | --- | --- |
| id | uuid, PK |  |
| booking\_id | uuid, FK → bookings |  |
| staff\_user\_id | uuid, FK → users (where is\_staff = true) |  |
| role\_on\_event | text | e.g. "Camera Operator", "Streaming Engineer" |

**testimonials**
----------------

| **Column** | **Type** | **Notes** |
| --- | --- | --- |
| id | uuid, PK |  |
| customer\_name | text |  |
| customer\_photo\_id | uuid, FK → media\_library, nullable |  |
| quote\_text | text |  |
| rating | int, nullable | 1–5 |
| status | enum('pending','published','rejected') |  |

**blog\_posts**
---------------

| **Column** | **Type** | **Notes** |
| --- | --- | --- |
| id | uuid, PK |  |
| title | text |  |
| slug | text, unique |  |
| body | text (rich, sanitized) | See TDD §8 — sanitized server-side against stored XSS |
| cover\_media\_id | uuid, FK → media\_library |  |
| author\_id | uuid, FK → users |  |
| published\_at | timestamptz, nullable | Null = draft/scheduled |

**faqs**
--------

| **Column** | **Type** | **Notes** |
| --- | --- | --- |
| id | uuid, PK |  |
| question / answer | text |  |
| group | text | e.g. "Booking", "Payments", "Equipment" |
| sort\_order | int |  |

**site\_content**
-----------------

Generic editable CMS blocks — one row per named block.

| **Column** | **Type** | **Notes** |
| --- | --- | --- |
| id | uuid, PK |  |
| key | text, unique | e.g. "homepage\_hero", "about\_mission", "why\_ravenous\_bullets" |
| content | jsonb | Shape varies by key; validated against a per-key Zod schema shared with the admin form |
| updated\_by | uuid, FK → users |  |

**notifications**
-----------------

| **Column** | **Type** | **Notes** |
| --- | --- | --- |
| id | uuid, PK |  |
| recipient\_id | uuid, FK → users, nullable | Null for guest-email-only notifications |
| channel | enum('email','sms','whatsapp','dashboard') |  |
| event\_type | text | e.g. 'quote\_sent', 'booking\_confirmed', 'payment\_received' |
| payload | jsonb |  |
| status | enum('queued','sent','failed') |  |

**audit\_logs**
---------------

Append-only; never updated or deleted.

| **Column** | **Type** | **Notes** |
| --- | --- | --- |
| id | uuid, PK |  |
| actor\_id | uuid, FK → users |  |
| action | text | e.g. 'booking.status\_changed', 'quote.sent', 'payment.recorded' |
| entity\_table / entity\_id | text / uuid |  |
| before / after | jsonb, nullable | Best-effort diff snapshot |
| created\_at | timestamptz |  |

**settings**
------------

Single-row-per-key configuration.

| **Column** | **Type** | **Notes** |
| --- | --- | --- |
| key | text, PK | e.g. 'business\_info', 'seo\_defaults', 'whatsapp\_number', 'payment\_config' |
| value | jsonb |  |

**4\. Relationships Overview**
==============================

*   users 1—\* quote\_requests, bookings, quotes, payments (as customer)
*   service\_categories 1—\* services; services \*—\* packages via package\_items
*   services 1—\* quote\_line\_items, booking\_services (referenced for description/price lookup, not for live pricing)
*   portfolio\_projects \*—\* media\_library via project\_media
*   quote\_requests 1—1 quotes (a request produces at most one active quote at a time); quotes 1—\* quote\_line\_items
*   quotes 0—1 bookings (a booking may originate from a quote, or be created directly); bookings 1—\* payments
*   payments 1—1 invoices
*   bookings \*—\* equipment via equipment\_assignments; bookings \*—\* users(is\_staff) via staff\_assignments (Phase 4)
*   Every mutation-sensitive table (bookings, quotes, payments, services, portfolio\_projects, site\_content) is referenced from audit\_logs by entity\_table/entity\_id

**5\. Row-Level Security Policy Summary**
=========================================

| **Table** | **Policy summary** |
| --- | --- |
| users | A user can read/update their own row. Admin can read all rows. No client can change role or is\_staff (server-only via service role). |
| quote\_requests / quotes / bookings / payments / invoices | A customer can SELECT only rows where customer\_id = auth.uid(). Admin (role = 'admin') can SELECT/INSERT/UPDATE all rows. INSERT for guest rows (customer\_id null) is allowed from the anon role only through the validated public form path, never a raw table insert. |
| services / packages / portfolio\_projects / testimonials / blog\_posts / faqs / site\_content | Public (anon + authenticated) can SELECT where published = true. Only admin can INSERT/UPDATE/DELETE, or SELECT unpublished/draft rows. |
| media\_library | Public can SELECT where status = 'ready' and the asset is attached to a published entity. Only admin can INSERT/UPDATE/DELETE. |
| equipment / equipment\_assignments / staff\_assignments (Phase 4) | Admin only — no public or customer access. |
| notifications | A user can SELECT their own notifications (dashboard channel). Only the service role (edge functions) can INSERT. |
| audit\_logs | Admin-only SELECT. INSERT only via the service role — never directly from a client, so the log cannot be forged or skipped by a compromised client session. |
| settings | Public can SELECT specific non-sensitive keys (e.g. business contact info, WhatsApp number) via a view; admin-only for the rest. |

**6\. Indexing & Performance Notes**
====================================

*   bookings(event\_date), bookings(status) — Production Calendar and status-pipeline views filter on both constantly.
*   bookings(customer\_id), quotes(customer\_id), payments(booking\_id) — required both for RLS predicate performance and for the customer dashboard's own queries.
*   services(slug), portfolio\_projects(slug or id) already unique-indexed by their unique constraints; used directly for SSR/ISR page lookups.
*   portfolio\_projects(event\_type) — supports the Portfolio filter-by-category UI without a full scan.
*   media\_library(category), media\_library(status) — Media Library admin views and public gallery filtering.
*   equipment\_assignments — GiST exclusion index on (equipment\_id, date\_range) doubles as both the double-booking constraint and the fast "is this item free on this date" lookup (Phase 4).
*   audit\_logs(entity\_table, entity\_id, created\_at) — supports "show me the history of this booking" without scanning the whole log.