import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Packages | Ravenous Studio Production",
  description: "Pre-configured event production packages for weddings, funerals, corporate events, and gospel concerts.",
};

const packages = [
  {
    id: "pkg-1",
    name: "Essentials",
    tagline: "Single-camera coverage for intimate events",
    price: 2000,
    features: [
      "1× Sony PXW-Z190 camera operator",
      "Basic audio capture (2 wireless mics)",
      "Edited highlight reel (3–5 min)",
      "Delivery within 14 business days",
    ],
    highlighted: false,
  },
  {
    id: "pkg-2",
    name: "Professional",
    tagline: "Multi-camera production with live stream",
    price: 5500,
    features: [
      "3× camera operators (4K)",
      "Live switching via Blackmagic ATEM",
      "Multi-platform live stream (YouTube + Facebook)",
      "Full-length edited video + highlight reel",
      "On-site audio engineer with 8-channel mix",
      "Delivery within 10 business days",
    ],
    highlighted: true,
  },
  {
    id: "pkg-3",
    name: "Stadium",
    tagline: "Full-scale production with LED screens",
    price: 12000,
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
  },
];

export default function PackagesPage() {
  return (
    <>
      <section className="bg-deep-navy text-white pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-heading font-bold text-4xl md:text-6xl uppercase tracking-tight mb-4">
              Production <span className="text-primary">Packages</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300">
              Fixed-price packages designed around common event sizes. Need something custom? Request a tailored quote.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {packages.map((pkg) => (
              <Card
                key={pkg.id}
                className={cn(
                  "relative overflow-hidden border-border/50 shadow-sm",
                  pkg.highlighted && "border-primary border-2 shadow-lg"
                )}
              >
                {pkg.highlighted && (
                  <div className="absolute top-0 left-0 w-full bg-primary text-white text-center text-xs font-bold uppercase tracking-wider py-1.5">
                    Most Popular
                  </div>
                )}
                <CardHeader className={cn("pb-4", pkg.highlighted && "pt-10")}>
                  <CardTitle className="font-heading text-2xl text-secondary uppercase">{pkg.name}</CardTitle>
                  <p className="text-muted-foreground text-sm mt-1">{pkg.tagline}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <span className="text-sm text-muted-foreground uppercase font-bold tracking-wider">Starting from</span>
                    <p className="font-heading font-bold text-4xl text-secondary">
                      GHS {pkg.price.toLocaleString()}
                    </p>
                  </div>

                  <ul className="space-y-3">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-stage-gold shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/quote?package=${pkg.id}`}
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "w-full uppercase font-bold tracking-wide",
                      !pkg.highlighted && "bg-secondary hover:bg-secondary/90"
                    )}
                  >
                    Get This Package
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center border-t border-border pt-12">
            <h2 className="font-heading font-bold text-2xl uppercase text-secondary mb-3">Need a custom setup?</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Every event is different. Tell us about yours and we'll put together a production plan and quote specific to your requirements.
            </p>
            <Link href="/quote" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "px-8")}>
              Request a Custom Quote
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
