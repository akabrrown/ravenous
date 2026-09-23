import { Metadata } from "next";
import { getAdminPackages } from "@/lib/actions";
import PackagesClient from "./PackagesClient";

export const metadata: Metadata = {
  title: "Packages | Admin Dashboard",
};

export default async function AdminPackagesPage() {
  const packages = await getAdminPackages();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Packages</h1>
          <p className="text-gray-500 mt-1">Manage your event production packages.</p>
        </div>
      </div>

      <PackagesClient initialPackages={packages} />
    </div>
  );
}
