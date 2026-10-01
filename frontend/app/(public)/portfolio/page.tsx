export const dynamic = "force-dynamic";

import { getAllPortfolio } from "@/lib/actions";
import PortfolioGrid from "./PortfolioGrid";

export const metadata = {
  title: "Portfolio | Ravenous Studio Production",
  description: "View our recent live event productions, including weddings, gospel concerts, and corporate events.",
};

export default async function PortfolioIndexPage() {
  const portfolio = await getAllPortfolio();

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
          <PortfolioGrid projects={portfolio} />
        </div>
      </section>
    </>
  );
}
