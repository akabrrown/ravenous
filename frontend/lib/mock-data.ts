export const services = [
  {
    id: "s1",
    name: "LED Screen Rental",
    slug: "led-screen-rental",
    short_description: "High-resolution LED screens for indoor and outdoor events.",
    description: "Our high-resolution LED screens provide crystal-clear visuals for any event size. From corporate presentations to massive outdoor concerts, we deliver reliable, bright, and scalable screen solutions.",
    equipment_used: ["P3.91mm Outdoor LED Panels", "Novastar Video Processors", "Trussing Support Systems"],
    starting_price: 3500,
    is_featured: true,
  },
  {
    id: "s2",
    name: "Live Streaming",
    slug: "live-streaming",
    short_description: "Professional multi-camera live streaming to any platform.",
    description: "Broadcast your event globally with our professional multi-camera live streaming setup. We handle everything from internet bonding to multi-platform delivery (YouTube, Facebook, Custom RTMP) ensuring your remote audience gets a TV-quality experience.",
    equipment_used: ["Blackmagic ATEM Switchers", "Sony PXW-Z190 Cameras", "LiveU Solo Video Encoders", "Wireless Intercoms"],
    starting_price: 2500,
    is_featured: true,
  },
  {
    id: "s3",
    name: "Live Recording",
    slug: "live-recording",
    short_description: "Multi-track audio and 4K video recording for post-production.",
    description: "Capture every moment in stunning 4K and pristine multi-track audio. Perfect for gospel concerts, theater performances, and corporate keynotes that require high-end post-production.",
    equipment_used: ["Canon C300 Mk III", "Zoom F8n Pro Recorders", "Sennheiser Wireless Mics"],
    starting_price: 2000,
    is_featured: false,
  },
  {
    id: "s4",
    name: "Wedding Coverage",
    slug: "wedding-coverage",
    short_description: "Cinematic wedding videography and photography.",
    description: "Beautiful, cinematic capture of your special day. We provide comprehensive coverage from preparation to the reception, delivering high-end photos and a highlight film you'll cherish forever.",
    equipment_used: ["Sony A7S III", "DJI Ronin Gimbals", "DJI Mavic 3 Drones"],
    starting_price: 4500,
    is_featured: true,
  },
  {
    id: "s5",
    name: "Funeral Coverage",
    slug: "funeral-coverage",
    short_description: "Respectful and comprehensive funeral media coverage.",
    description: "Respectful, unobtrusive coverage of funeral services, including live streaming for family members abroad and printed memorial materials.",
    equipment_used: ["Sony PXW-Z190 Cameras", "Portable PA Systems"],
    starting_price: 3000,
    is_featured: false,
  },
];

export const portfolio = [
  {
    id: "p1",
    title: "Accra Gospel Concert 2026",
    event_type: "Gospel",
    client_name: "Grace Ministries",
    event_date: "2026-08-15",
    location: "Accra International Conference Centre",
    services_provided: ["s1", "s2", "s3"],
    cover_media: "/placeholder.webp",
    description: "A 5000-seat gospel concert requiring a massive 12x4m LED backdrop, multi-camera live stream, and 32-channel live audio recording.",
    is_featured: true,
  },
  {
    id: "p2",
    title: "Kwame & Ama's Wedding",
    event_type: "Wedding",
    client_name: "Kwame & Ama",
    event_date: "2026-07-10",
    location: "Kempinski Hotel Gold Coast City",
    services_provided: ["s4"],
    cover_media: "/placeholder.webp",
    description: "Cinematic full-day wedding coverage including drone shots, preparation, ceremony, and reception. Delivered a 5-minute highlight reel and 800+ edited photos.",
    is_featured: true,
  },
  {
    id: "p3",
    title: "Tech Summit Ghana",
    event_type: "Corporate",
    client_name: "Tech Hub Africa",
    event_date: "2026-06-22",
    location: "Mövenpick Ambassador Hotel",
    services_provided: ["s1", "s2"],
    cover_media: "/placeholder.webp",
    description: "Corporate live stream and stage production featuring dual 4x3m LED screens and seamless lower-thirds integration for remote viewers.",
    is_featured: false,
  },
];

export const testimonials = [
  {
    id: "t1",
    customer_name: "Pastor David Osei",
    quote_text: "Ravenous Studio completely transformed our annual convention. The LED screens were flawless, and the live stream quality was better than national TV. Truly professional.",
    rating: 5,
  },
  {
    id: "t2",
    customer_name: "Ama Mensah",
    quote_text: "They captured our wedding so beautifully! The team was on time, super professional, and the final video made me cry. Highly recommend them for any event.",
    rating: 5,
  }
];

export const faqs = [
  {
    id: "f1",
    question: "How far in advance should I book?",
    answer: "We recommend booking at least 3-4 weeks in advance for smaller events (like single-camera streams) and 2-3 months for large-scale LED and multi-cam productions.",
    group: "Booking",
  },
  {
    id: "f2",
    question: "Do you travel outside Accra?",
    answer: "Yes! While we are based in Accra, we travel nationwide. Travel and accommodation fees may apply depending on the location and scope of the event.",
    group: "Booking",
  },
  {
    id: "f3",
    question: "What deposit is required?",
    answer: "We require a 50% non-refundable deposit to secure your date and equipment. The remaining balance is due on or before the event date.",
    group: "Payments",
  },
];
