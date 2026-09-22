import { notFound } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { services } from "@/lib/mock-data";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return { title: "Service Not Found" };

  return {
    title: `${service.name} | Ravenous Studio Production`,
    description: service.short_description,
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={service.cover_media || "/placeholder.webp"} 
            alt={service.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-deep-navy/80 backdrop-blur-sm"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <Link href="/services" className="inline-flex items-center text-sm font-bold tracking-wider uppercase text-gray-300 hover:text-white mb-8">
            <ArrowRight className="mr-2 h-4 w-4 rotate-180" /> Back to Services
          </Link>
          <div className="max-w-3xl">
            <h1 className="font-heading font-bold text-4xl md:text-6xl uppercase tracking-tight mb-6">
              {service.name}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200">
              {service.short_description}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* Left Column: Description & Details */}
            <div className="w-full lg:w-2/3 space-y-12">
              <div>
                <h2 className="font-heading font-bold text-3xl uppercase text-secondary mb-6">Overview</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>

              {service.equipment_used && service.equipment_used.length > 0 && (
                <div>
                  <h2 className="font-heading font-bold text-3xl uppercase text-secondary mb-6">Equipment Included</h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.equipment_used.map((item, idx) => (
                      <li key={idx} className="flex items-start bg-off-white p-4 rounded-sm border border-border">
                        <CheckCircle2 className="h-5 w-5 text-stage-gold shrink-0 mt-0.5 mr-3" />
                        <span className="font-medium text-secondary">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column: Pricing & Booking Card */}
            <div className="w-full lg:w-1/3">
              <div className="sticky top-24 bg-off-white border border-border p-8 rounded-sm shadow-sm">
                <h3 className="font-heading font-bold text-2xl uppercase text-secondary mb-2">Book This Service</h3>
                <p className="text-muted-foreground mb-6">Get a customized quote for your specific event requirements.</p>
                
                {service.starting_price && (
                  <div className="mb-8 pb-8 border-b border-border">
                    <span className="text-sm text-muted-foreground uppercase font-bold tracking-wider block mb-1">Starting from</span>
                    <p className="font-heading font-bold text-4xl text-primary">
                      GHS {service.starting_price.toLocaleString()}
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  <Link 
                    href={`/quote?service=${service.id}`} 
                    className={cn(buttonVariants({ size: "lg" }), "w-full h-14 text-base uppercase tracking-wide")}
                  >
                    Request a Quote
                  </Link>
                  <Link 
                    href="/contact" 
                    className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full h-14 text-base uppercase tracking-wide")}
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
