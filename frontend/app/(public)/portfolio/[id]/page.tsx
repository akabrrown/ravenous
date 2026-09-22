import { notFound } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { portfolio, services } from "@/lib/mock-data";
import { ArrowRight, Calendar, MapPin, User, Tag } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = portfolio.find((p) => p.id === id);
  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} | Ravenous Studio Portfolio`,
    description: project.description,
  };
}

export default async function PortfolioDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = portfolio.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  // Map service IDs back to full service objects for rendering links
  const projectServices = project.services_provided
    .map(serviceId => services.find(s => s.id === serviceId))
    .filter(s => s !== undefined);

  return (
    <>
      <section className="bg-deep-navy text-white pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/portfolio" className="inline-flex items-center text-sm font-bold tracking-wider uppercase text-gray-400 hover:text-white mb-8 transition-colors">
            <ArrowRight className="mr-2 h-4 w-4 rotate-180" /> Back to Portfolio
          </Link>
          <div className="max-w-4xl">
            <div className="inline-block px-3 py-1 bg-white/10 text-stage-gold text-xs font-bold uppercase tracking-widest rounded-sm mb-6 border border-stage-gold/30">
              {project.event_type}
            </div>
            <h1 className="font-heading font-bold text-4xl md:text-6xl uppercase tracking-tight mb-6">
              {project.title}
            </h1>
          </div>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Left: Main Content & Media */}
            <div className="w-full lg:w-2/3 space-y-8">
              <div className="aspect-video bg-muted rounded-sm overflow-hidden border border-border">
                <img 
                  src={project.cover_media || "/placeholder.webp"} 
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="prose prose-slate dark:prose-invert max-w-none">
                <h2 className="font-heading font-bold text-3xl uppercase text-secondary mb-6">About The Project</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
                {/* Simulated extensive case study content */}
                <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                  Ravenous Studio Production was tasked with delivering an exceptional audio-visual experience for this event. 
                  Our team handled the end-to-end production workflow, ensuring flawless execution from pre-production planning 
                  to the final live delivery.
                </p>
              </div>
            </div>

            {/* Right: Project Meta Details */}
            <div className="w-full lg:w-1/3">
              <div className="bg-off-white border border-border p-8 rounded-sm">
                <h3 className="font-heading font-bold text-xl uppercase text-secondary mb-6 pb-4 border-b border-border">Project Details</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <User className="h-5 w-5 text-primary shrink-0 mr-4 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Client</p>
                      <p className="font-medium text-secondary text-lg">{project.client_name}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-primary shrink-0 mr-4 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Date</p>
                      <p className="font-medium text-secondary text-lg">
                        {new Date(project.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-primary shrink-0 mr-4 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Location</p>
                      <p className="font-medium text-secondary text-lg">{project.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Tag className="h-5 w-5 text-primary shrink-0 mr-4 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Services Provided</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {projectServices.map((service) => (
                          <Link 
                            key={service.id} 
                            href={`/services/${service.slug}`}
                            className="inline-block bg-white border border-border px-3 py-1 rounded-sm text-sm font-medium text-secondary hover:text-primary hover:border-primary transition-colors"
                          >
                            {service.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-border">
                  <h4 className="font-heading font-bold text-lg uppercase text-secondary mb-4">Start Your Project</h4>
                  <Link href="/contact" className={cn(buttonVariants({ size: "lg" }), "w-full")}>
                    Contact Us Today
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
