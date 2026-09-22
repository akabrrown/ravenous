**RAVENOUS STUDIO PRODUCTION**  
**Design Brief**  
Visual Identity & UI Direction  
**Prepared for:** Ravenous Studio Production  
**Prepared by:** Codey Dev — Aka Brown  
**Version:** 1.0  
**Date:** September 2026

Table of Contents
=================

**1\. Brand Overview & Positioning**
====================================

Ravenous Studio Production's existing flyer positions the brand around scale and capability: LED screens, live streaming, live recording, and coverage spanning funerals, weddings, gospel events, and outdoor functions, backed by a visibly serious equipment rig. The site should read the same way — a working production house, not a template photography portfolio — so the direction favors bold, high-contrast layouts, real equipment/behind-the-scenes imagery, and confident typography over soft, decorative treatments.  
The platform spans three audiences with different needs from the same visual system: public visitors deciding whether to enquire, customers tracking a booking they've already committed to, and the admin managing content day to day. One brand system, three tonal registers — bold and persuasive on the public site, calm and legible in the customer portal, dense and functional in the admin.

**2\. Color Palette**
=====================

The client's brief specifies blue and black. Read literally as a flat two-tone, that combination tends to read cold and generic for a live-event production brand — it doesn't carry any of the warmth or energy visible in the client's own event photography (stage lighting, LED washes, gold accents at weddings). The proposal below keeps blue as the structural color and black as a supporting neutral (so the brief is honored), but treats them as two of four colors rather than the whole palette, adding a crimson carried over from the flyer's existing wordmark and a warm gold for premium moments. This is a proposal, not a final decision — flagged pending the client's sign-off before it's locked into the component library.

**2.1 Proposed Palette**
------------------------

| **Swatch** | **Hex** | **Name** | **Usage** |
| --- | --- | --- | --- |
|  | #16294D | **Studio Navy** | Primary — headers, navigation, hero backgrounds, primary buttons |
|  | #0E1B33 | **Deep Navy** | Darkest sections, footer, video showcase backdrop |
|  | #14161C | **Charcoal** | Body text, the "black" half of the brief as a neutral, not a block color |
|  | #C81E3A | **Ravenous Crimson** | Accent — carried over from the flyer's wordmark/CTA; secondary buttons, active states, tags |
|  | #E8A33D | **Stage Gold** | Premium accent — featured badges, pricing highlights, hover accents; used sparingly |
|  | #F7F6F3 | **Off-White** | Page background (not pure white) for a warmer, less clinical canvas |
|  | #5B6472 | **Gray 600** | Secondary text, captions, metadata |
|  | #D8DCE3 | **Gray 300** | Borders, dividers, table lines |

**2.2 Application Rule**
------------------------

*   Navy carries structure (nav bars, section headers, footer, form field focus rings).
*   Crimson is reserved for the primary conversion actions — Book a Service, Request a Quote — so it keeps the same job it has on the flyer today (the red "BOOK NOW" button).
*   Gold is used only for premium/featured signaling (a featured portfolio project, a highlighted package) — not as a second primary color, or it stops reading as special.
*   Charcoal, not pure black, is the deepest neutral throughout — pure black (#000000) is avoided in UI surfaces per the anti-generic rules below.

**2.3 Alternative — If the Client Wants Blue+Black Literally**
--------------------------------------------------------------

If, after seeing the proposal, the client prefers the literal blue-and-black brief, the fallback is: Studio Navy + Charcoal as the only two brand colors, with Crimson retained solely as a small logo/CTA accent (never a UI color) and Gold dropped entirely. This is a same-day swap in the Tailwind theme tokens, not a rebuild, since every component references the semantic tokens (primary, accent, surface) rather than hard-coded hex values.

**3\. Typography**
==================

| **Role** | **Typeface** | **Notes** |
| --- | --- | --- |
| Display / Headings | Oswald (condensed, bold weights) | Matches the cinematic, condensed feel of the flyer's own wordmark; strong at large hero sizes without feeling decorative. |
| Body / UI | Inter | Neutral, highly legible workhorse for long-form service descriptions, forms, and dashboard tables. |
| Numeric / Monospace | JetBrains Mono or system mono | Reserved for invoice/receipt line items and booking reference codes where digit alignment matters. |

**_Note:_** _Oswald + Inter is a deliberate departure from the Space Grotesk + Instrument Serif pairing flagged as an overused AI-generated-site default — no decorative serif accents are used anywhere in this system._

**4\. Logo Usage & Imagery Style**
==================================

*   The existing wordmark (crimson gradient on dark) is retained as-is for the logo itself; this brief governs the site around it, not a logo redesign.
*   Photography is real client/event work only — no stock imagery of generic "corporate team" or "happy customers" photos. Behind-the-scenes and equipment shots (cameras, mixers, LED panels) are used deliberately to reinforce production credibility, matching the flyer's own equipment collage.
*   Dark, high-contrast image treatment on the public marketing surfaces (hero, service pages) to match the flyer's black-backdrop aesthetic; the customer portal and admin use the lighter off-white surface for legibility during day-to-day use.
*   Grain texture, if used at all, is applied as a standalone photographic/print texture — never layered over a gradient purely to disguise it, per the anti-AI-generic rules below.

**5\. UI Component Principles**
===============================

The following are explicit exclusions across every Figma file and generated component for this project, to keep the interface from reading as generically AI-templated:

*   No gradient blobs as background decoration.
*   No glassmorphism as the default card treatment.
*   No uniform pill-shaped buttons everywhere — button shape should vary meaningfully by hierarchy (primary vs. ghost vs. icon).
*   No scroll-triggered fade-in applied to every section indiscriminately.
*   No cursor-following gradient beams.
*   No grain-over-gradient decoration (grain alone, on a flat/photographic surface, is fine — see §4).
*   No fade-only hover states — hover/focus states should show a real state change (border, elevation, or color shift), not just opacity.
*   No decorative italic serif accents dropped into an otherwise sans-serif UI.

**5.1 Cards & Surfaces**
------------------------

Service and portfolio cards use a solid off-white or navy surface with a 1px border and a deliberate shadow on hover — not a blurred/translucent glass panel. Featured items get a thin gold top border rather than a glow effect.

**5.2 Buttons**
---------------

Primary (crimson, filled, sharp-cornered rectangle with a small radius — not a pill) for Book/Quote actions. Secondary (navy outline) for lower-priority actions like "View Package." WhatsApp CTA uses its own recognizable green treatment so it visually reads as "chat now," distinct from the site's own action colors.

**5.3 Forms**
-------------

Quote and Booking forms are multi-step (service → event details → contact info) rather than one long form, with a persistent progress indicator — this matches the step-by-step structure already implied by the client's own booking example (Service → Date → Location → Requirements → Contact).

**6\. Layout & Grid System**
============================

*   12-column responsive grid, 1280px max content width on desktop, 24px gutter.
*   Mobile-first: the majority of prospective clients will arrive via a WhatsApp-shared link on a phone, so every public template is designed at 375px width first, then expanded.
*   Section rhythm on the public site alternates full-bleed dark (navy/charcoal) sections with off-white sections, so the page has visible structure when scrolled quickly — this also gives the video showcase and "Why Ravenous" sections a natural dark home distinct from the lighter service-grid sections.

**7\. Key Screens — Visual Direction**
======================================

**7.1 Homepage**
----------------

Full-bleed dark hero with a short looping or poster-frame video reel behind the headline and the two primary CTAs (Book a Service, Request a Quote) plus a floating WhatsApp button. Services showcase as an icon+label card grid directly below. Featured Work and Video Showcase sit in a dark section; Why Ravenous and Testimonials sit in a lighter section to break the rhythm before the closing CTA band.

**7.2 Service Page**
--------------------

Hero banner named per service (e.g. "Live Streaming") with a short value line, then a two-column layout: left column is the description/what's-included/equipment list, right column is a sticky quote/booking CTA card with the starting price (if published) — keeps the conversion action visible without scrolling back up.

**7.3 Portfolio**
-----------------

Masonry/grid gallery filterable by event-type chips (Weddings, Funerals, Gospel, Outdoor, Corporate…). Each card shows a cover image, event type tag, and title only — detail (client, date, services, full media) lives on the project detail page to keep the grid scannable.

**7.4 Booking / Quote Flow**
----------------------------

Multi-step form as described in §5.3, on a distraction-free layout (no nav distractions, just a logo and a progress bar) so the visitor completes the flow rather than clicking away.

**7.5 Admin Dashboard**
-----------------------

Dense, data-forward layout: KPI row (bookings, pending, upcoming events, revenue) above a two-column split of Recent Bookings and Upcoming Events, matching the structure already sketched in the client's own brief. Navy/off-white theme with functional density prioritized over marketing polish — this is a daily-use tool, not a showcase.

**8\. Accessibility & Responsive Notes**
========================================

*   Text on navy/charcoal backgrounds is off-white or white only — never gray-on-dark below WCAG AA contrast.
*   Crimson-on-navy and gold-on-navy combinations are checked for contrast before use as text color; both are safer as fills/borders than as small text on dark backgrounds.
*   All portfolio and gallery media requires alt text at upload time in the Media Library — enforced as a required field, not optional metadata.
*   Every interactive element (including the floating WhatsApp button) is reachable and operable by keyboard, with a visible focus ring in Studio Navy.

**9\. Motion & Interaction Principles**
=======================================

*   Motion is purposeful, not decorative: page-load reveals are limited to the hero, not applied to every scrolled section.
*   Video content (the flyer's own strongest asset) is the primary "motion" of the site — autoplaying muted background loops in the hero and video showcase carry more weight than UI animation.
*   Status changes in the customer dashboard and admin console (e.g. a booking moving to Confirmed) use a brief, real state transition — not a generic spinner-then-fade — so the change is legible.

**10\. Do's and Don'ts Summary**
================================

| **Do** | **Don't** |
| --- | --- |
| Use real event/equipment photography | Use stock "corporate team" imagery |
| Reserve crimson for primary conversion actions | Spread crimson evenly across every UI element |
| Vary button shape and treatment by hierarchy | Make every button a uniform pill |
| Use gold sparingly for featured/premium signals | Turn gold into a second primary color |
| Apply grain as a standalone photographic texture | Layer grain over a gradient to fake texture |
| Show a real hover/focus state (border, elevation) | Rely on opacity fade as the only hover state |