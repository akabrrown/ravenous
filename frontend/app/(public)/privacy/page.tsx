import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "Privacy Policy | Ravenous Studio Production",
  description: "Privacy policy for Ravenous Studio Production.",
};

export default function PrivacyPage() {
  return (
    <>
      <section className="bg-deep-navy text-white pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-heading font-bold text-4xl md:text-5xl uppercase tracking-tight mb-4">
              Privacy <span className="text-primary">Policy</span>
            </h1>
            <p className="text-gray-300">Last updated: [DATE_PLACEHOLDER]</p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl prose prose-slate dark:prose-invert">
          <p>
            Ravenous Studio Production is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
            <em> Note: This is a placeholder document until the final legal copy is provided by the client.</em>
          </p>

          <h2>1. Information We Collect</h2>
          <p>
            We may collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our services, when you participate in activities on the Website, or otherwise when you contact us. This includes:
          </p>
          <ul>
            <li>Name and contact data (email address, phone number)</li>
            <li>Event details (dates, locations, requirements)</li>
            <li>Billing and payment information</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>
            We use personal information collected via our Website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
          </p>
          <ul>
            <li>To facilitate account creation and logon process.</li>
            <li>To fulfill and manage your bookings and orders.</li>
            <li>To send administrative information to you.</li>
            <li>To deliver targeted advertising to you (if opted in).</li>
          </ul>

          <h2>3. Media and Footage</h2>
          <p>
            As a production company, we capture video and audio at live events. Footage captured at public events or private events where we are contracted to film may be stored on our secure servers for post-production editing, archiving, and delivery to the client.
          </p>

          <h2>4. Data Security</h2>
          <p>
            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
          </p>

          <div className="mt-12 pt-8 border-t border-border">
            <h3 className="font-heading uppercase">Questions?</h3>
            <p>If you have any questions or comments about this notice, you may email us at hello@ravenousstudio.com.</p>
            <Link href="/contact" className={buttonVariants({ variant: "outline", className: "mt-4" })}>
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
