"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Wedding", "Gospel", "Corporate", "Outdoor", "Funeral"];

interface Project {
  id: string;
  title: string;
  eventType: string;
  description: string | null;
  coverMedia?: { deliveryUrl: string } | null;
}

export default function PortfolioGrid({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState("All");

  const filtered = useMemo(() => {
    if (active === "All") return projects;
    return projects.filter((p) =>
      p.eventType.toLowerCase().includes(active.toLowerCase())
    );
  }, [active, projects]);

  return (
    <>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 mb-12">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={cn(
              "px-4 py-2 rounded-sm text-sm font-bold uppercase transition-colors",
              active === cat
                ? "bg-secondary text-white"
                : "bg-muted text-muted-foreground hover:bg-secondary/10"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="col-span-full py-20 text-center text-muted-foreground">
          <p className="text-lg font-medium">No {active} projects yet.</p>
          <p className="text-sm mt-1">Check back after our next event!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((project) => (
            <Link
              key={project.id}
              href={`/portfolio/${project.id}`}
              className="group relative aspect-square rounded-sm overflow-hidden bg-muted cursor-pointer border border-border block"
            >
              <img
                src={project.coverMedia?.deliveryUrl || "/placeholder.webp"}
                alt={project.title}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-navy/90 via-deep-navy/30 to-transparent" />

              <div className="absolute bottom-0 left-0 w-full p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <div className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold uppercase mb-3 rounded-sm">
                  {project.eventType}
                </div>
                <h3 className="font-heading text-2xl font-bold text-white mb-2 leading-tight">
                  {project.title}
                </h3>
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
      )}
    </>
  );
}
