import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "Terms and Conditions | Ravenous Studio Production",
  description: "Terms and conditions of service for Ravenous Studio Production.",
};

export default function TermsPage() {
  return (
    <>
      <section className="bg-deep-navy text-white pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-heading font-bold text-4xl md:text-5xl uppercase tracking-tight mb-4">
              Terms & <span className="text-primary">Conditions</span>
            </h1>
            <p className="text-gray-300">Last updated: [DATE_PLACEHOLDER]</p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl prose prose-slate dark:prose-invert">
          <p>
            Please read these terms and conditions carefully before using our services.
            <em> Note: This is a placeholder document until the final legal copy is provided by the client.</em>
          </p>

          <h2>1. Booking and Payment</h2>
          <p>
            A non-refundable deposit of 50% is required to secure your booking date. The remaining balance must be paid in full 7 days prior to the event date. Failure to complete payment may result in cancellation of services.
          </p>

          <h2>2. Cancellations</h2>
          <p>
            Cancellations made more than 30 days before the event will forfeit the deposit but incur no additional charges. Cancellations made within 30 days of the event will require full payment of the agreed contract amount.
          </p>

          <h2>3. Equipment and Venue Access</h2>
          <p>
            The client is responsible for ensuring the venue provides adequate power supply and safe access for our technical crew. Ravenous Studio Production requires access to the venue at least 4 hours prior to the event start time for setup, depending on the scale of the production.
          </p>

          <h2>4. Liability</h2>
          <p>
            While we take every precaution to ensure flawless execution, Ravenous Studio Production is not liable for technical failures caused by factors outside our control (e.g., venue power outages, severe weather, internet connectivity issues for live streams).
          </p>

          <h2>5. Media Rights</h2>
          <p>
            Unless otherwise agreed in writing, Ravenous Studio Production retains the right to use captured footage and photographs for promotional purposes (portfolio, social media, website). 
          </p>

          <div className="mt-12 pt-8 border-t border-border">
            <h3 className="font-heading uppercase">Questions?</h3>
            <p>If you have any questions about these Terms, please contact us at hello@ravenousstudio.com.</p>
            <Link href="/contact" className={buttonVariants({ variant: "outline", className: "mt-4" })}>
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
