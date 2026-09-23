import { Metadata } from "next";
import { getAdminSiteContent } from "@/lib/actions";
import SiteContentClient from "./SiteContentClient";

export const metadata: Metadata = {
  title: "Site Content | Admin Dashboard",
};

export default async function AdminSiteContentPage() {
  const content = await getAdminSiteContent();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Site Content</h1>
          <p className="text-gray-500 mt-1">Manage global copy, hero text, and statements.</p>
        </div>
      </div>

      <SiteContentClient initialContent={content} />
    </div>
  );
}
