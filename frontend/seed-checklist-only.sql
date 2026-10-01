-- seed-checklist-only.sql
-- Run this script in the Supabase SQL Editor to append ONLY the new items 
-- from the Client Checklist (Photography & Videography).

-- ==========================================
-- 1. Ensure at least one Category exists
-- ==========================================
INSERT INTO public.service_categories (id, name, slug, sort_order)
VALUES (
  '11111111-1111-1111-1111-111111111111', 
  'General Services', 
  'general-services', 
  1
)
ON CONFLICT (slug) DO NOTHING;

-- ==========================================
-- 2. Insert Media Library items for Covers
-- (Uses your existing admin account ID)
-- ==========================================
INSERT INTO public.media_library (id, type, category, title, alt_text, delivery_url, status, uploaded_by)
SELECT 
  '33333333-3333-3333-3333-000000000008', 'image', 'general', 'Event Photography', 'Mock Image', '/images/photography.jpg', 'ready', id
FROM public.users WHERE role = 'admin' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO public.media_library (id, type, category, title, alt_text, delivery_url, status, uploaded_by)
SELECT 
  '33333333-3333-3333-3333-000000000009', 'image', 'general', 'Event Videography', 'Mock Image', '/images/videography.jpg', 'ready', id
FROM public.users WHERE role = 'admin' LIMIT 1
ON CONFLICT DO NOTHING;

-- ==========================================
-- 3. Insert the New Services
-- ==========================================
INSERT INTO public.services (id, category_id, name, slug, short_description, description, equipment_used, starting_price, cover_media_id, is_featured, published, sort_order)
SELECT 
  gen_random_uuid(), c.id, 'Event Photography', 'event-photography', 'Professional photography for all types of events.', 'High-quality, crisp, and vibrant event photography. We capture the essence of your event, delivering perfectly edited shots for your personal memories or corporate marketing.', ARRAY['Sony A7R IV', 'Professional Strobe Lighting', 'Prime Lenses'], NULL, '33333333-3333-3333-3333-000000000008', true, true, 8
FROM public.service_categories c LIMIT 1
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.services (id, category_id, name, slug, short_description, description, equipment_used, starting_price, cover_media_id, is_featured, published, sort_order)
SELECT 
  gen_random_uuid(), c.id, 'Event Videography', 'event-videography', 'Cinematic highlight reels and full event coverage.', 'Tell the story of your event through cinematic video. We produce dynamic highlight reels, social media teasers, and full-length documentary cuts.', ARRAY['Sony FX3', 'DJI Ronin', 'Wireless Audio'], NULL, '33333333-3333-3333-3333-000000000009', false, true, 9
FROM public.service_categories c LIMIT 1
ON CONFLICT (slug) DO NOTHING;
