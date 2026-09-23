import { getAdminServices } from "@/lib/actions";
import ServicesClient from "./ServicesClient";

export const metadata = {
  title: "Admin - Services | Ravenous Studio",
};

export default async function AdminServicesPage() {
  const services = await getAdminServices();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-secondary uppercase">Services Management</h1>
        <p className="text-muted-foreground mt-2">Add, edit, or remove services offered by the studio.</p>
      </div>

      <ServicesClient initialServices={services} />
    </div>
  );
}
