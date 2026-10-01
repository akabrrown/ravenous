-- seed.sql
-- Run this script in the Supabase SQL Editor to populate the database with initial mock data.

-- ==========================================
-- 1. Create a dummy admin user
-- ==========================================
INSERT INTO public.users (id, full_name, email, role, is_staff)
VALUES (
  '22222222-2222-2222-2222-222222222222', 
  'System Admin', 
  'admin@ravenous.com', 
  'admin', 
  true
)
ON CONFLICT (email) DO NOTHING;

-- ==========================================
-- 2. Create a dummy service category
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
-- 3. Insert Media Library items for Covers
-- ==========================================
INSERT INTO public.media_library (id, type, category, title, alt_text, delivery_url, status, uploaded_by)
VALUES 
  ('33333333-3333-3333-3333-000000000001', 'image', 'general', 'LED Screen', 'Mock Image', '/images/led.jpg', 'ready', '22222222-2222-2222-2222-222222222222'),
  ('33333333-3333-3333-3333-000000000002', 'image', 'general', 'Live Streaming', 'Mock Image', '/images/live_stream.jpg', 'ready', '22222222-2222-2222-2222-222222222222'),
  ('33333333-3333-3333-3333-000000000003', 'image', 'general', 'Funeral Coverage', 'Mock Image', '/images/funeral_coverage.jpg', 'ready', '22222222-2222-2222-2222-222222222222'),
  ('33333333-3333-3333-3333-000000000004', 'image', 'general', 'Outdoor Events', 'Mock Image', '/images/outdoor.jpg', 'ready', '22222222-2222-2222-2222-222222222222'),
  ('33333333-3333-3333-3333-000000000005', 'image', 'general', 'Wedding Coverage', 'Mock Image', '/images/wedding.jpg', 'ready', '22222222-2222-2222-2222-222222222222'),
  ('33333333-3333-3333-3333-000000000006', 'image', 'general', 'Gospel Events', 'Mock Image', '/images/gospel_coverage.jpg', 'ready', '22222222-2222-2222-2222-222222222222'),
  ('33333333-3333-3333-3333-000000000007', 'image', 'general', 'Live Recording', 'Mock Image', '/images/live_recording.jpg', 'ready', '22222222-2222-2222-2222-222222222222'),
  ('33333333-3333-3333-3333-000000000008', 'image', 'general', 'Event Photography', 'Mock Image', '/images/photography.jpg', 'ready', '22222222-2222-2222-2222-222222222222'),
  ('33333333-3333-3333-3333-000000000009', 'image', 'general', 'Event Videography', 'Mock Image', '/images/videography.jpg', 'ready', '22222222-2222-2222-2222-222222222222'),
  ('33333333-3333-3333-3333-000000000101', 'image', 'general', 'Accra Gospel Concert', 'Mock Image', '/images/accra_gospel_concert.jpg', 'ready', '22222222-2222-2222-2222-222222222222'),
  ('33333333-3333-3333-3333-000000000102', 'image', 'general', 'Kwame & Amas Wedding', 'Mock Image', '/images/kwame_amas_wedding.jpg', 'ready', '22222222-2222-2222-2222-222222222222'),
  ('33333333-3333-3333-3333-000000000103', 'image', 'general', 'Tech Summit Ghana', 'Mock Image', '/images/tech_summit_ghana.jpg', 'ready', '22222222-2222-2222-2222-222222222222')
ON CONFLICT DO NOTHING;

-- ==========================================
-- 4. Insert Services
-- ==========================================
INSERT INTO public.services (id, category_id, name, slug, short_description, description, equipment_used, starting_price, cover_media_id, is_featured, published, sort_order)
VALUES 
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'LED Screen Rentals', 'led-screen-rentals', 'High-resolution indoor and outdoor LED walls.', 'Our modular LED walls provide stunning visual clarity for any event size. Whether you need a massive outdoor backdrop for a concert or a crisp indoor display for a corporate presentation, we configure screens to your exact dimensions.', ARRAY['P3.91mm Outdoor/Indoor Panels', 'Novastar Processors', 'Trussing Support'], NULL, '33333333-3333-3333-3333-000000000001', true, true, 1),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'Live Streaming', 'live-streaming', 'Multi-camera broadcast for remote audiences.', 'Broadcast your event globally with our professional live streaming services. We utilize multi-camera setups, clean audio feeds, and custom on-screen graphics to deliver a television-quality experience to YouTube, Facebook, or private links.', ARRAY['Blackmagic ATEM Switchers', 'Sony PXW-Z190 Cameras', 'Teradek Encoders'], NULL, '33333333-3333-3333-3333-000000000002', true, true, 2),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'Funeral Coverage', 'funeral-coverage', 'Respectful and comprehensive funeral media coverage.', 'Respectful, unobtrusive coverage of funeral services, including live streaming for family members abroad and printed memorial materials.', ARRAY['Sony PXW-Z190 Cameras', 'Portable PA Systems'], NULL, '33333333-3333-3333-3333-000000000003', false, true, 3),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'Outdoor Events', 'outdoor-events', 'Complete media and production solutions for outdoor events.', 'From elegant outdoor dinners to massive festivals, we provide comprehensive staging, lighting, and coverage for any open-air occasion.', ARRAY['Weatherproof Cameras', 'Outdoor PA Systems', 'Generators'], NULL, '33333333-3333-3333-3333-000000000004', true, true, 4),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'Wedding Coverage', 'wedding-coverage', 'Cinematic wedding videography and photography.', 'Beautiful, cinematic capture of your special day. We provide comprehensive coverage from preparation to the reception, delivering high-end photos and a highlight film you''ll cherish forever.', ARRAY['Sony A7S III', 'DJI Ronin Gimbals', 'DJI Mavic 3 Drones'], NULL, '33333333-3333-3333-3333-000000000005', true, true, 5),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'Gospel Events', 'gospel-events', 'Dynamic production for gospel concerts and church services.', 'We specialize in capturing the energy and spirit of gospel events with multi-camera setups, crisp audio recording, and dynamic stage lighting.', ARRAY['PTZ Cameras', 'DMX Lighting Controllers', 'Digital Audio Snakes'], NULL, '33333333-3333-3333-3333-000000000006', false, true, 6),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'Live Recording', 'live-recording', 'Multi-track audio and 4K video recording for post-production.', 'Capture every moment in stunning 4K and pristine multi-track audio. Perfect for theater performances and corporate keynotes that require high-end post-production.', ARRAY['Canon C300 Mk III', 'Zoom F8n Pro Recorders', 'Sennheiser Wireless Mics'], NULL, '33333333-3333-3333-3333-000000000007', false, true, 7),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'Event Photography', 'event-photography', 'Professional photography for all types of events.', 'High-quality, crisp, and vibrant event photography. We capture the essence of your event, delivering perfectly edited shots for your personal memories or corporate marketing.', ARRAY['Sony A7R IV', 'Professional Strobe Lighting', 'Prime Lenses'], NULL, '33333333-3333-3333-3333-000000000008', true, true, 8),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'Event Videography', 'event-videography', 'Cinematic highlight reels and full event coverage.', 'Tell the story of your event through cinematic video. We produce dynamic highlight reels, social media teasers, and full-length documentary cuts.', ARRAY['Sony FX3', 'DJI Ronin', 'Wireless Audio'], NULL, '33333333-3333-3333-3333-000000000009', false, true, 9)
ON CONFLICT (slug) DO NOTHING;

-- ==========================================
-- 5. Insert Portfolio Projects
-- ==========================================
INSERT INTO public.portfolio_projects (id, title, event_type, client_name, event_date, location, description, cover_media_id, is_featured, published, services_provided)
VALUES 
  (gen_random_uuid(), 'Accra Gospel Concert 2026', 'Gospel', 'Grace Ministries', '2026-08-15', 'Accra International Conference Centre', 'A 5000-seat gospel concert requiring a massive 12x4m LED backdrop, multi-camera live stream, and 32-channel live audio recording.', '33333333-3333-3333-3333-000000000101', true, true, '{}'),
  (gen_random_uuid(), 'Kwame & Ama''s Wedding', 'Wedding', 'Kwame & Ama', '2026-07-10', 'Kempinski Hotel Gold Coast City', 'Cinematic full-day wedding coverage including drone shots, preparation, ceremony, and reception. Delivered a 5-minute highlight reel and 800+ edited photos.', '33333333-3333-3333-3333-000000000102', true, true, '{}'),
  (gen_random_uuid(), 'Tech Summit Ghana', 'Corporate', 'Tech Hub Africa', '2026-06-22', 'Mövenpick Ambassador Hotel', 'Corporate live stream and stage production featuring dual 4x3m LED screens and seamless lower-thirds integration for remote viewers.', '33333333-3333-3333-3333-000000000103', false, true, '{}')
ON CONFLICT DO NOTHING;

-- ==========================================
-- 6. Insert Testimonials
-- ==========================================
INSERT INTO public.testimonials (id, customer_name, quote_text, rating, status)
VALUES 
  (gen_random_uuid(), 'Pastor David Osei', 'Ravenous Studio completely transformed our annual convention. The LED screens were flawless, and the live stream quality was better than national TV. Truly professional.', 5, 'published'),
  (gen_random_uuid(), 'Ama Mensah', 'They captured our wedding so beautifully! The team was on time, super professional, and the final video made me cry. Highly recommend them for any event.', 5, 'published')
ON CONFLICT DO NOTHING;

-- ==========================================
-- 7. Insert FAQs
-- ==========================================
INSERT INTO public.faqs (id, question, answer, "group", sort_order, published)
VALUES 
  (gen_random_uuid(), 'How far in advance should I book?', 'We recommend booking at least 3-4 weeks in advance for smaller events (like single-camera streams) and 2-3 months for large-scale LED and multi-cam productions.', 'Booking', 1, true),
  (gen_random_uuid(), 'Do you travel outside Accra?', 'Yes! While we are based in Accra, we travel nationwide. Travel and accommodation fees may apply depending on the location and scope of the event.', 'Booking', 2, true),
  (gen_random_uuid(), 'What deposit is required?', 'We require a 50% non-refundable deposit to secure your date and equipment. The remaining balance is due on or before the event date.', 'Payments', 3, true)
ON CONFLICT DO NOTHING;
