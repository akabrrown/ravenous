import Link from "next/link";
import { getAllPortfolio } from "@/lib/actions";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Portfolio | Ravenous Studio Production",
  description: "View our recent live event productions, including weddings, gospel concerts, and corporate events.",
};

export default async function PortfolioIndexPage() {
  const portfolio = await getAllPortfolio();
  // In a real app, we'd extract unique event types dynamically.
  const categories = ["All", "Wedding", "Gospel", "Corporate", "Outdoor", "Funeral"];

  return (
    <>
      <section className="bg-deep-navy text-white pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-heading font-bold text-4xl md:text-6xl uppercase tracking-tight mb-4">
              Our <span className="text-primary">Work</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300">
              A showcase of events where we delivered flawless technical production and media coverage.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Filters (UI only for mock) */}
          <div className="flex flex-wrap gap-2 mb-12">
            {categories.map((cat, i) => (
              <Link 
                key={i}
                href="#"
                className={`px-4 py-2 rounded-sm text-sm font-bold uppercase transition-colors ${i === 0 ? 'bg-secondary text-white' : 'bg-muted text-muted-foreground hover:bg-secondary/10'}`}
              >
                {cat}
              </Link>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolio.map((project) => (
              <Link key={project.id} href={`/portfolio/${project.id}`} className="group relative aspect-square rounded-sm overflow-hidden bg-muted cursor-pointer border border-border block">
                <img src={project.coverMedia?.deliveryUrl || "/placeholder.webp"} alt={project.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-navy/90 via-deep-navy/30 to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 w-full p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold uppercase mb-3 rounded-sm">
                    {project.eventType}
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-white mb-2 leading-tight">{project.title}</h3>
                  <p className="text-gray-300 text-sm line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    {project.description}
                  </p>
                  <span className="inline-flex items-center text-stage-gold p-0 h-auto font-medium group-hover:text-white transition-colors">
                    View Full Details <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
