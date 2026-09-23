import { db } from "./lib/db";
import { packages, siteContent } from "./lib/schema";

const initialPackages = [
  {
    name: "Essentials",
    eventType: "Single-camera coverage for intimate events",
    description: "Perfect for small gatherings needing professional documentation.",
    price: "2000",
    features: [
      "1× Sony PXW-Z190 camera operator",
      "Basic audio capture (2 wireless mics)",
      "Edited highlight reel (3–5 min)",
      "Delivery within 14 business days",
    ],
    highlighted: false,
    published: true,
  },
  {
    name: "Professional",
    eventType: "Multi-camera production with live stream",
    description: "Our most popular package for comprehensive event coverage.",
    price: "5500",
    features: [
      "3× camera operators (4K)",
      "Live switching via Blackmagic ATEM",
      "Multi-platform live stream (YouTube + Facebook)",
      "Full-length edited video + highlight reel",
      "On-site audio engineer with 8-channel mix",
      "Delivery within 10 business days",
    ],
    highlighted: true,
    published: true,
  },
  {
    name: "Stadium",
    eventType: "Full-scale production with LED screens",
    description: "The ultimate package for large-scale events and concerts.",
    price: "12000",
    features: [
      "Everything in Professional",
      "P3.91mm outdoor LED wall (up to 6×3m)",
      "Novastar video processing",
      "Dedicated LED technician",
      "Drone aerial coverage",
      "32-channel multi-track audio recording",
      "Priority delivery within 7 business days",
    ],
    highlighted: false,
    published: true,
  }
];

const initialSiteContent = [
  { key: "hero_title", value: "LED SCREENS & LIVE STREAMS" },
  { key: "hero_title_secondary", value: "4K RECORDING & FULL COVERAGE" },
  { key: "hero_subtitle", value: "Accra · Ghana" },
  { key: "hero_description", value: "Modular LED walls, multi-camera broadcast rigs, and on-site audio engineering for concerts, weddings, and corporate events." },
  { key: "about_story", value: "We started with a simple goal: to elevate the standard of event production in Ghana. Today, we power some of the most significant weddings, funerals, and gospel concerts in Accra." },
  { key: "about_mission", value: "To deliver seamless, high-quality production services that amplify the impact of every event, ensuring audiences both in-person and online experience the moment fully." },
  { key: "about_vision", value: "To be the most trusted live production partner in West Africa, recognized for our technical excellence and reliability." }
];

async function seed() {
  console.log("Seeding packages...");
  for (const pkg of initialPackages) {
    await db.insert(packages).values(pkg);
  }
  
  console.log("Seeding site content...");
  for (const content of initialSiteContent) {
    await db.insert(siteContent).values({
      key: content.key,
      value: content.value
    }).onConflictDoNothing();
  }
  
  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch(err => {
  console.error("Seeding failed", err);
  process.exit(1);
});
