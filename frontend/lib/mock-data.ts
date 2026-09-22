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
    cover_media: "/images/led_screen.jpg"
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
    cover_media: "/images/live_stream.jpg"
  },
  {
    id: "s3",
    name: "Funeral Coverage",
    slug: "funeral-coverage",
    short_description: "Respectful and comprehensive funeral media coverage.",
    description: "Respectful, unobtrusive coverage of funeral services, including live streaming for family members abroad and printed memorial materials.",
    equipment_used: ["Sony PXW-Z190 Cameras", "Portable PA Systems"],
    starting_price: 3000,
    is_featured: false,
    cover_media: "/images/funeral_coverage.jpg"
  },
  {
    id: "s4",
    name: "Outdoor Events",
    slug: "outdoor-events",
    short_description: "Complete media and production solutions for outdoor events.",
    description: "From elegant outdoor dinners to massive festivals, we provide comprehensive staging, lighting, and coverage for any open-air occasion.",
    equipment_used: ["Weatherproof Cameras", "Outdoor PA Systems", "Generators"],
    starting_price: 4000,
    is_featured: true,
    cover_media: "/images/outdoor.jpg"
  },
  {
    id: "s5",
    name: "Wedding Coverage",
    slug: "wedding-coverage",
    short_description: "Cinematic wedding videography and photography.",
    description: "Beautiful, cinematic capture of your special day. We provide comprehensive coverage from preparation to the reception, delivering high-end photos and a highlight film you'll cherish forever.",
    equipment_used: ["Sony A7S III", "DJI Ronin Gimbals", "DJI Mavic 3 Drones"],
    starting_price: 4500,
    is_featured: true,
    cover_media: "/images/wedding.jpg"
  },
  {
    id: "s6",
    name: "Gospel Events",
    slug: "gospel-events",
    short_description: "Dynamic production for gospel concerts and church services.",
    description: "We specialize in capturing the energy and spirit of gospel events with multi-camera setups, crisp audio recording, and dynamic stage lighting.",
    equipment_used: ["PTZ Cameras", "DMX Lighting Controllers", "Digital Audio Snakes"],
    starting_price: 3500,
    is_featured: false,
    cover_media: "/images/gospel_coverage.jpg"
  },
  {
    id: "s7",
    name: "Live Recording",
    slug: "live-recording",
    short_description: "Multi-track audio and 4K video recording for post-production.",
    description: "Capture every moment in stunning 4K and pristine multi-track audio. Perfect for theater performances and corporate keynotes that require high-end post-production.",
    equipment_used: ["Canon C300 Mk III", "Zoom F8n Pro Recorders", "Sennheiser Wireless Mics"],
    starting_price: 2000,
    is_featured: false,
    cover_media: "/images/live_recording.jpg"
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
    cover_media: "/images/accra_gospel_concert.jpg",
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
    cover_media: "/images/kwame_amas_wedding.jpg",
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
    cover_media: "/images/tech_summit_ghana.jpg",
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

export const blog_posts = [
  {
    id: "b1",
    title: "Top 5 Benefits of LED Screens at Corporate Events",
    slug: "benefits-of-led-screens-corporate-events",
    excerpt: "Discover why upgrading from standard projectors to high-resolution LED screens can completely transform your next corporate gathering.",
    content: `
When planning a corporate event, one of the most critical decisions you'll make is how to present your visual content. For years, projection has been the standard. However, LED screens are rapidly taking over the industry, and for good reason.

### 1. Unmatched Brightness and Clarity
Unlike projectors, which can struggle in well-lit rooms, LED screens emit their own light. This means you don't have to plunge your audience into darkness just so they can read your presentation slides. 

### 2. Scalability and Custom Shapes
LED panels are modular. You aren't restricted to standard 16:9 aspect ratios. Want a massive ultra-wide screen? Or perhaps separate pillars of video flanking the stage? LED makes it possible.

### 3. Reliability
There are no bulbs to burn out mid-presentation. LED technology is incredibly robust and built for the rigors of live events.

If you're looking to elevate your next corporate event in Ghana, contact Ravenous Studio Production to discuss our P3.91mm Outdoor/Indoor LED panel rentals.
    `,
    author: "Ravenous Studio Team",
    published_at: "2026-09-10T10:00:00Z",
    cover_media: "/placeholder.webp",
  },
  {
    id: "b2",
    title: "Why Multi-Camera Live Streaming is Essential in 2026",
    slug: "why-multi-camera-live-streaming-is-essential",
    excerpt: "A single camera at the back of the room isn't enough anymore. Learn how multi-camera setups keep remote audiences engaged.",
    content: `
The expectation for live streams has skyrocketed. Audiences are no longer satisfied with a single, static wide shot of a stage. To keep viewers engaged, you need dynamic, television-quality production.

### The Power of Multiple Angles
A multi-camera setup allows a technical director to cut between wide shots that establish the room, tight shots that capture the speaker's emotion, and audience reaction shots that make the remote viewer feel like they are in the room.

### Redundancy and Professionalism
If one camera goes down, the broadcast doesn't stop. A multi-camera setup provides essential redundancy. Combined with professional lower-third graphics and pristine audio integration, your stream elevates your brand's perception globally.

At Ravenous Studio, we use Blackmagic ATEM Switchers and broadcast-grade cameras to deliver seamless, engaging live streams.
    `,
    author: "Ravenous Studio Team",
    published_at: "2026-08-25T14:30:00Z",
    cover_media: "/placeholder.webp",
  }
];
