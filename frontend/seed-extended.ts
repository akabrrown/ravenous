import { db } from "./lib/db";
import { 
  services, 
  portfolioProjects, 
  testimonials, 
  faqs, 
  serviceCategories,
  mediaLibrary,
  users
} from "./lib/schema";

const mockServices = [
  {
    name: "LED Screen Rentals",
    slug: "led-screen-rentals",
    shortDescription: "High-resolution indoor and outdoor LED walls.",
    description: "Our modular LED walls provide stunning visual clarity for any event size. Whether you need a massive outdoor backdrop for a concert or a crisp indoor display for a corporate presentation, we configure screens to your exact dimensions.",
    equipmentUsed: ["P3.91mm Outdoor/Indoor Panels", "Novastar Processors", "Trussing Support"],
    startingPrice: "5000",
    isFeatured: true,
    coverMediaUrl: "/images/led.jpg"
  },
  {
    name: "Live Streaming",
    slug: "live-streaming",
    shortDescription: "Multi-camera broadcast for remote audiences.",
    description: "Broadcast your event globally with our professional live streaming services. We utilize multi-camera setups, clean audio feeds, and custom on-screen graphics to deliver a television-quality experience to YouTube, Facebook, or private links.",
    equipmentUsed: ["Blackmagic ATEM Switchers", "Sony PXW-Z190 Cameras", "Teradek Encoders"],
    startingPrice: "2500",
    isFeatured: true,
    coverMediaUrl: "/images/live_stream.jpg"
  },
  {
    name: "Funeral Coverage",
    slug: "funeral-coverage",
    shortDescription: "Respectful and comprehensive funeral media coverage.",
    description: "Respectful, unobtrusive coverage of funeral services, including live streaming for family members abroad and printed memorial materials.",
    equipmentUsed: ["Sony PXW-Z190 Cameras", "Portable PA Systems"],
    startingPrice: "3000",
    isFeatured: false,
    coverMediaUrl: "/images/funeral_coverage.jpg"
  },
  {
    name: "Outdoor Events",
    slug: "outdoor-events",
    shortDescription: "Complete media and production solutions for outdoor events.",
    description: "From elegant outdoor dinners to massive festivals, we provide comprehensive staging, lighting, and coverage for any open-air occasion.",
    equipmentUsed: ["Weatherproof Cameras", "Outdoor PA Systems", "Generators"],
    startingPrice: "4000",
    isFeatured: true,
    coverMediaUrl: "/images/outdoor.jpg"
  },
  {
    name: "Wedding Coverage",
    slug: "wedding-coverage",
    shortDescription: "Cinematic wedding videography and photography.",
    description: "Beautiful, cinematic capture of your special day. We provide comprehensive coverage from preparation to the reception, delivering high-end photos and a highlight film you'll cherish forever.",
    equipmentUsed: ["Sony A7S III", "DJI Ronin Gimbals", "DJI Mavic 3 Drones"],
    startingPrice: "4500",
    isFeatured: true,
    coverMediaUrl: "/images/wedding.jpg"
  },
  {
    name: "Gospel Events",
    slug: "gospel-events",
    shortDescription: "Dynamic production for gospel concerts and church services.",
    description: "We specialize in capturing the energy and spirit of gospel events with multi-camera setups, crisp audio recording, and dynamic stage lighting.",
    equipmentUsed: ["PTZ Cameras", "DMX Lighting Controllers", "Digital Audio Snakes"],
    startingPrice: "3500",
    isFeatured: false,
    coverMediaUrl: "/images/gospel_coverage.jpg"
  },
  {
    name: "Live Recording",
    slug: "live-recording",
    shortDescription: "Multi-track audio and 4K video recording for post-production.",
    description: "Capture every moment in stunning 4K and pristine multi-track audio. Perfect for theater performances and corporate keynotes that require high-end post-production.",
    equipmentUsed: ["Canon C300 Mk III", "Zoom F8n Pro Recorders", "Sennheiser Wireless Mics"],
    startingPrice: "2000",
    isFeatured: false,
    coverMediaUrl: "/images/live_recording.jpg"
  },
];

const mockPortfolio = [
  {
    title: "Accra Gospel Concert 2026",
    eventType: "Gospel",
    clientName: "Grace Ministries",
    eventDate: "2026-08-15",
    location: "Accra International Conference Centre",
    coverMediaUrl: "/images/accra_gospel_concert.jpg",
    description: "A 5000-seat gospel concert requiring a massive 12x4m LED backdrop, multi-camera live stream, and 32-channel live audio recording.",
    isFeatured: true,
  },
  {
    title: "Kwame & Ama's Wedding",
    eventType: "Wedding",
    clientName: "Kwame & Ama",
    eventDate: "2026-07-10",
    location: "Kempinski Hotel Gold Coast City",
    coverMediaUrl: "/images/kwame_amas_wedding.jpg",
    description: "Cinematic full-day wedding coverage including drone shots, preparation, ceremony, and reception. Delivered a 5-minute highlight reel and 800+ edited photos.",
    isFeatured: true,
  },
  {
    title: "Tech Summit Ghana",
    eventType: "Corporate",
    clientName: "Tech Hub Africa",
    eventDate: "2026-06-22",
    location: "Mövenpick Ambassador Hotel",
    coverMediaUrl: "/images/tech_summit_ghana.jpg",
    description: "Corporate live stream and stage production featuring dual 4x3m LED screens and seamless lower-thirds integration for remote viewers.",
    isFeatured: false,
  },
];

const mockTestimonials = [
  {
    customerName: "Pastor David Osei",
    quoteText: "Ravenous Studio completely transformed our annual convention. The LED screens were flawless, and the live stream quality was better than national TV. Truly professional.",
    rating: 5,
    status: "published" as const,
  },
  {
    customerName: "Ama Mensah",
    quoteText: "They captured our wedding so beautifully! The team was on time, super professional, and the final video made me cry. Highly recommend them for any event.",
    rating: 5,
    status: "published" as const,
  }
];

const mockFaqs = [
  {
    question: "How far in advance should I book?",
    answer: "We recommend booking at least 3-4 weeks in advance for smaller events (like single-camera streams) and 2-3 months for large-scale LED and multi-cam productions.",
    group: "Booking",
    sortOrder: 1,
  },
  {
    question: "Do you travel outside Accra?",
    answer: "Yes! While we are based in Accra, we travel nationwide. Travel and accommodation fees may apply depending on the location and scope of the event.",
    group: "Booking",
    sortOrder: 2,
  },
  {
    question: "What deposit is required?",
    answer: "We require a 50% non-refundable deposit to secure your date and equipment. The remaining balance is due on or before the event date.",
    group: "Payments",
    sortOrder: 3,
  },
];

async function getOrInsertMedia(url: string, uploaderId: string) {
  const result = await db.insert(mediaLibrary).values({
    type: "image",
    category: "general",
    title: "Mock Image",
    altText: "Mock Image",
    deliveryUrl: url,
    status: "ready",
    uploadedBy: uploaderId,
  }).returning({ id: mediaLibrary.id });
  return result[0].id;
}

async function seed() {
  try {
    console.log("Seeding started...");

    // Create a dummy user
    const userResult = await db.insert(users).values({
      fullName: "System Admin",
      email: "admin@ravenous.com",
      role: "admin",
      isStaff: true,
    }).onConflictDoNothing().returning({ id: users.id });
    
    // Fallback if it already exists
    const adminUser = userResult[0]?.id || (await db.query.users.findFirst())?.id;
    if (!adminUser) throw new Error("Could not find or create a user.");

    // Create a dummy category
    const categoryResult = await db.insert(serviceCategories).values({
      name: "General Services",
      slug: "general-services",
      sortOrder: 1,
    }).onConflictDoNothing().returning({ id: serviceCategories.id });
    
    const categoryId = categoryResult[0]?.id || (await db.query.serviceCategories.findFirst())?.id;
    if (!categoryId) throw new Error("Could not find or create a category.");

    console.log("Seeding services...");
    for (const service of mockServices) {
      const mediaId = await getOrInsertMedia(service.coverMediaUrl, adminUser);
      
      await db.insert(services).values({
        categoryId: categoryId,
        name: service.name,
        slug: service.slug,
        shortDescription: service.shortDescription,
        description: service.description,
        equipmentUsed: service.equipmentUsed,
        startingPrice: service.startingPrice,
        coverMediaId: mediaId,
        isFeatured: service.isFeatured,
        published: true,
        sortOrder: 0,
      }).onConflictDoNothing();
    }

    console.log("Seeding portfolio...");
    for (const project of mockPortfolio) {
      const mediaId = await getOrInsertMedia(project.coverMediaUrl, adminUser);
      
      await db.insert(portfolioProjects).values({
        title: project.title,
        eventType: project.eventType,
        clientName: project.clientName,
        eventDate: project.eventDate,
        location: project.location,
        description: project.description,
        coverMediaId: mediaId,
        isFeatured: project.isFeatured,
        published: true,
        servicesProvided: [],
      }).onConflictDoNothing();
    }

    console.log("Seeding testimonials...");
    for (const testimonial of mockTestimonials) {
      await db.insert(testimonials).values({
        customerName: testimonial.customerName,
        quoteText: testimonial.quoteText,
        rating: testimonial.rating,
        status: testimonial.status,
      }).onConflictDoNothing();
    }

    console.log("Seeding FAQs...");
    for (const faq of mockFaqs) {
      await db.insert(faqs).values({
        question: faq.question,
        answer: faq.answer,
        group: faq.group,
        sortOrder: faq.sortOrder,
        published: true,
      }).onConflictDoNothing();
    }

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed", error);
    process.exit(1);
  }
}

seed();
