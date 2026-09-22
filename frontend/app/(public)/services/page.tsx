import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { services } from "@/lib/mock-data";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Services | Ravenous Studio Production",
  description: "Explore our professional event production services including LED screen rentals, live streaming, and event coverage.",
};

export default function ServicesIndexPage() {
  return (
    <>
      <section className="bg-deep-navy text-white pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-heading font-bold text-4xl md:text-6xl uppercase tracking-tight mb-4">
              Our <span className="text-primary">Services</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300">
              Professional production solutions tailored to your event's specific needs and scale.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {services.map((service, index) => (
              <div key={service.id} className={`flex flex-col lg:flex-row gap-12 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                
                {/* Image Side */}
                <div className="w-full lg:w-1/2">
                  <div className="aspect-[4/3] bg-muted relative rounded-sm overflow-hidden border border-border shadow-md group">
                    <img src="/placeholder.webp" alt={service.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" />
                  </div>
                </div>
                
                {/* Content Side */}
                <div className="w-full lg:w-1/2 space-y-6">
                  <h2 className="font-heading font-bold text-3xl md:text-4xl text-secondary uppercase">{service.name}</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                  
                  {service.starting_price && (
                    <div className="inline-block bg-off-white border border-border px-4 py-2 rounded-sm mt-2">
                      <span className="text-sm text-muted-foreground uppercase font-bold tracking-wider">Starting from</span>
                      <p className="font-heading font-bold text-2xl text-secondary">GHS {service.starting_price.toLocaleString()}</p>
                    </div>
                  )}

                  <div className="pt-6 flex gap-4">
                    <Link href={`/services/${service.slug}`} className={buttonVariants({ size: "lg" })}>
                      View Details
                    </Link>
                    <Link href={`/quote?service=${service.id}`} className={cn(buttonVariants({ variant: "outline", size: "lg" }), "text-primary hover:text-primary hover:bg-primary/5")}>
                      Request Quote <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="py-20 bg-off-white border-t border-border/50 text-center">
        <div className="container mx-auto px-4">
          <h2 className="font-heading font-bold text-3xl uppercase text-secondary mb-4">Don't see exactly what you need?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">We offer custom packages for unique events. Contact us to discuss your specific requirements.</p>
          <Link href="/contact" className={cn(buttonVariants({ size: "lg" }), "px-8")}>
            Contact Us for a Custom Quote
          </Link>
        </div>
      </section>
    </>
  );
}
