export const dynamic = "force-dynamic";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAllServices } from "@/lib/actions";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Services | Ravenous Studio Production",
  description: "Explore our professional event production services including LED screen rentals, live streaming, and event coverage.",
};

export default async function ServicesIndexPage() {
  const services = await getAllServices();

  return (
    <>
      <section className="bg-deep-navy text-white pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-heading font-bold text-4xl md:text-6xl uppercase tracking-tight mb-4">
              Our <span className="text-primary">Services</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300">
              Professional production solutions tailored to your event&apos;s specific needs and scale.
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
                    <img src={service.coverMedia?.deliveryUrl || "/placeholder.webp"} alt={service.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" />
                  </div>
                </div>
                
                {/* Content Side */}
                <div className="w-full lg:w-1/2 space-y-6">
                  <h2 className="font-heading font-bold text-3xl md:text-4xl text-secondary uppercase">{service.name}</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="inline-block bg-off-white border border-border px-4 py-2 rounded-sm mt-2">
                    <p className="font-heading font-bold text-lg text-secondary uppercase">Contact For Pricing</p>
                  </div>

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

      {/* EVENTS WE POWER (OCCASIONS) */}
      <section className="py-20 bg-slate-900 text-white border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-primary font-bold uppercase tracking-wider text-xs">Event Specialization</span>
            <h2 className="font-heading font-bold text-3xl md:text-5xl uppercase tracking-tight mt-2 mb-4">
              Events We <span className="text-primary">Power</span>
            </h2>
            <p className="text-gray-300 text-lg">
              We deploy our technical equipment, crew, and broadcast rigs across diverse event types throughout Ghana.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { title: "Weddings", desc: "Cinematic multicam, pristine vows audio & ambient LED screens.", link: "/portfolio" },
              { title: "Gospel Concerts", desc: "High-energy stadium audio, massive LED backdrops & broadcast streaming.", link: "/portfolio" },
              { title: "Corporate Summits", desc: "Keynote presentation screens, low-latency live streaming & multi-track audio.", link: "/portfolio" },
              { title: "Funerals", desc: "Dignified, unobtrusive memorial coverage & diaspora live streams.", link: "/portfolio" },
              { title: "Outdoor Festivals", desc: "Weather-resistant LED walls, line arrays & festival multicam.", link: "/portfolio" },
            ].map((event) => (
              <div key={event.title} className="p-6 rounded-sm bg-slate-800/80 border border-slate-700/60 flex flex-col justify-between hover:border-primary/50 transition-colors">
                <div>
                  <h3 className="font-heading font-bold text-xl uppercase text-white mb-2">{event.title}</h3>
                  <p className="text-sm text-gray-300 leading-relaxed mb-6">{event.desc}</p>
                </div>
                <Link href={event.link} className="inline-flex items-center text-xs font-bold uppercase text-primary hover:text-white transition-colors">
                  View In Portfolio <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="py-20 bg-off-white border-t border-border/50 text-center">
        <div className="container mx-auto px-4">
          <h2 className="font-heading font-bold text-3xl uppercase text-secondary mb-4">Don&apos;t see exactly what you need?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">We offer custom packages for unique events. Contact us to discuss your specific requirements.</p>
          <Link href="/contact" className={cn(buttonVariants({ size: "lg" }), "px-8")}>
            Contact Us for a Custom Quote
          </Link>
        </div>
      </section>
    </>
  );
}
