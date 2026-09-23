import { Metadata } from "next";
import { getAdminFaqs } from "@/lib/actions";
import FaqsClient from "./FaqsClient";

export const metadata: Metadata = {
  title: "FAQs | Admin Dashboard",
};

export default async function AdminFaqsPage() {
  const faqs = await getAdminFaqs();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Frequently Asked Questions</h1>
          <p className="text-gray-500 mt-1">Manage FAQs to help customers understand your services.</p>
        </div>
      </div>

      <FaqsClient initialFaqs={faqs} />
    </div>
  );
}
