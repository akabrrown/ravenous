import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { services, portfolio, testimonials } from "@/lib/mock-data";
import { ArrowRight, Play, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { HeroSlideshow } from "@/components/ui/hero-slideshow";

export default function Home() {
  const featuredServices = services.filter(s => s.is_featured);
  const featuredPortfolio = portfolio.filter(p => p.is_featured);

  return (
    <>
      {/* HERO SECTION — Full bleed slideshow */}
      <section className="relative bg-deep-navy text-white overflow-hidden min-h-[60vh] flex items-center pt-20">
        {/* Absolute Background Slideshow */}
        <HeroSlideshow />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl py-12 md:py-16">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-stage-gold mb-6">
              Accra &middot; Ghana
            </p>

            <h1 className="font-heading font-bold tracking-tighter leading-[1.05] mb-6">
              <span className="block text-4xl md:text-5xl lg:text-6xl text-white">LED SCREENS & <span className="text-primary">LIVE STREAMS</span></span>
              <span className="block text-4xl md:text-5xl lg:text-6xl text-white/40 mt-1">4K RECORDING & FULL COVERAGE</span>
            </h1>

            <p className="text-base md:text-lg text-gray-300 max-w-2xl mb-8 leading-relaxed">
              Modular LED walls, multi-camera broadcast rigs, and on-site audio engineering for concerts, weddings, and corporate events.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link href="/book" className={cn(buttonVariants({ size: "lg" }), "h-12 px-8 text-base font-bold uppercase tracking-wide")}>
                Book a Service <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/quote" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-12 px-8 text-base font-bold uppercase tracking-wide bg-transparent border-white/20 hover:bg-white/10 hover:text-white hover:border-white/40")}>
                Get a Quote
              </Link>
            </div>

            {/* Stats bar */}
            <div className="flex gap-8 border-t border-white/10 pt-6">
              <div>
                <p className="font-heading font-bold text-2xl text-white">150<span className="text-primary">+</span></p>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 mt-1">Events</p>
              </div>
              <div>
                <p className="font-heading font-bold text-2xl text-white">4K</p>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 mt-1">Multi-Cam</p>
              </div>
              <div>
                <p className="font-heading font-bold text-2xl text-white">12<span className="text-stage-gold">m</span></p>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 mt-1">LED Width</p>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Scrolling service marquee */}
      <div className="border-t border-b border-white/5 bg-deep-navy overflow-hidden">
        <div className="flex animate-[marquee_20s_linear_infinite] whitespace-nowrap py-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex shrink-0 items-center gap-8 px-8">
              {["LED SCREEN RENTAL", "LIVE STREAMING", "4K RECORDING", "WEDDING COVERAGE", "FUNERAL COVERAGE", "CORPORATE EVENTS", "GOSPEL CONCERTS"].map((label) => (
                <span key={label} className="text-xs font-bold uppercase tracking-[0.15em] text-gray-500 flex items-center gap-8">
                  {label} <span className="w-1.5 h-1.5 rounded-full bg-primary/60"></span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* SERVICES SHOWCASE */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="font-heading font-bold text-3xl md:text-5xl text-secondary mb-4 uppercase">Our Services</h2>
              <p className="text-muted-foreground text-lg">
                From intimate weddings to stadium-scale gospel concerts, we provide the equipment and expertise to execute flawlessly.
              </p>
            </div>
            <Link href="/services" className={buttonVariants({ variant: "outline" })}>
              View All Services
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service) => (
              <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/50 overflow-hidden bg-white">
                <div className="h-48 bg-muted relative overflow-hidden">
                  <div className="absolute inset-0 bg-secondary/10 group-hover:bg-transparent transition-colors z-10"></div>
                  <img src={service.cover_media || "/placeholder.webp"} alt={service.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                </div>
                <CardHeader>
                  <CardTitle className="font-heading text-xl text-secondary uppercase">{service.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.short_description}</p>
                </CardContent>
                <CardFooter className="pt-4 border-t border-border/50">
                  <Link href={`/services/${service.slug}`} className="text-primary font-medium flex items-center group-hover:underline">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* VIDEO SHOWCASE / WHY CHOOSE US */}
      <section className="py-24 bg-deep-navy text-white relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-heading font-bold text-3xl md:text-5xl mb-6 uppercase">
                Production Without <span className="text-primary">Compromise</span>
              </h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                We don't just supply equipment; we supply peace of mind. Our team of experienced engineers and operators ensure your event runs smoothly from the first cable plugged in to the final applause.
              </p>
              
              <div className="space-y-4">
                {[
                  "Industry-standard 4K cameras and multi-track audio",
                  "High-resolution outdoor & indoor LED screens",
                  "Experienced technical crew for live mixing",
                  "Reliable multi-platform streaming architecture"
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-stage-gold shrink-0" />
                    <span className="text-gray-200">{point}</span>
                  </div>
                ))}
              </div>
              
              <Link href="/about" className={cn(buttonVariants({ size: "lg" }), "mt-10")}>
                About Our Equipment
              </Link>
            </div>
            
            <div className="relative aspect-video bg-studio-navy rounded-lg overflow-hidden border border-white/10 group shadow-2xl">
              <img src="/images/live_stream.jpg" alt="Behind the scenes" className="object-cover w-full h-full opacity-70 group-hover:opacity-90 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center cursor-pointer hover:bg-primary transition-colors hover:scale-110 duration-300">
                  <Play className="h-8 w-8 text-white ml-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED WORK */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-heading font-bold text-3xl md:text-5xl text-secondary mb-4 uppercase">Featured Work</h2>
            <p className="text-muted-foreground text-lg">
              Explore our recent projects across weddings, corporate events, and live concerts.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredPortfolio.map((project) => (
              <Link key={project.id} href={`/portfolio/${project.id}`} className="group relative aspect-[4/3] rounded-sm overflow-hidden bg-muted cursor-pointer border border-border block">
                <img src={project.cover_media} alt={project.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-navy/90 via-deep-navy/20 to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold uppercase mb-3 rounded-sm">
                    {project.event_type}
                  </div>
                  <h3 className="font-heading text-2xl md:text-3xl font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-gray-300 line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    {project.description}
                  </p>
                  <span className="inline-flex items-center text-stage-gold p-0 h-auto font-medium group-hover:text-white transition-colors">
                    View Project <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/portfolio" className={buttonVariants({ variant: "outline", size: "lg" })}>
              Explore Full Portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-off-white border-t border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-center text-secondary mb-12 uppercase">Client Stories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {testimonials.map((t) => (
              <Card key={t.id} className="bg-white border-none shadow-sm">
                <CardContent className="pt-8">
                  <div className="flex gap-1 mb-4 text-stage-gold">
                    {[...Array(t.rating)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-lg text-foreground italic mb-6">"{t.quote_text}"</p>
                  <p className="font-bold text-secondary">{t.customer_name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA BAND */}
      <section className="py-20 bg-primary text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="font-heading font-bold text-3xl md:text-5xl uppercase mb-6">Ready to Capture Your Next Event?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-white/90">Get in touch today to discuss your requirements and get a custom quote.</p>
          <Link href="/book" className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "h-14 px-8 text-lg font-bold bg-white text-primary hover:bg-gray-100")}>
            Let's Talk About Your Event
          </Link>
        </div>
      </section>
    </>
  );
}
