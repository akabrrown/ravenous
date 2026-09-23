import { getAdminPortfolio } from "@/lib/actions";
import PortfolioClient from "./PortfolioClient";

export const metadata = {
  title: "Admin - Portfolio | Ravenous Studio",
};

export default async function AdminPortfolioPage() {
  const projects = await getAdminPortfolio();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-secondary uppercase">Portfolio Management</h1>
        <p className="text-muted-foreground mt-2">Manage the events and projects showcased in your portfolio.</p>
      </div>

      <PortfolioClient initialProjects={projects} />
    </div>
  );
}
