"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { services } from "@/lib/mock-data";
import { CheckCircle2 } from "lucide-react";

export default function BookPage() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <>
        <section className="bg-deep-navy text-white pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-heading font-bold text-4xl md:text-6xl uppercase tracking-tight mb-4">
              Booking <span className="text-primary">Confirmed</span>
            </h1>
          </div>
        </section>
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl text-center">
            <CheckCircle2 className="h-16 w-16 text-stage-gold mx-auto mb-6" />
            <h2 className="font-heading font-bold text-3xl uppercase text-secondary mb-4">Booking request received</h2>
            <p className="text-muted-foreground text-lg mb-8">
              We'll confirm availability and send you an invoice with the 50% deposit details within 24 hours. Check your email.
            </p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="bg-deep-navy text-white pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-heading font-bold text-4xl md:text-6xl uppercase tracking-tight mb-4">
              Book a <span className="text-primary">Service</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300">
              Ready to lock in your date? Fill in the details below and we'll confirm availability.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <Card className="border-border/50 shadow-md rounded-sm overflow-hidden">
            <div className="h-1.5 bg-stage-gold w-full"></div>
            <CardContent className="p-8 md:p-10">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="space-y-8"
              >
                <fieldset className="space-y-4">
                  <legend className="font-heading font-bold text-xl uppercase text-secondary mb-2">Your Details</legend>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="b-name">Full Name *</Label>
                      <Input id="b-name" required placeholder="Kwame Asante" className="bg-off-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="b-phone">Phone / WhatsApp *</Label>
                      <Input id="b-phone" type="tel" required placeholder="+233 XX XXX XXXX" className="bg-off-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="b-email">Email Address *</Label>
                    <Input id="b-email" type="email" required placeholder="kwame@example.com" className="bg-off-white" />
                  </div>
                </fieldset>

                <fieldset className="space-y-4">
                  <legend className="font-heading font-bold text-xl uppercase text-secondary mb-2">Event & Service</legend>
                  <div className="space-y-2">
                    <Label htmlFor="b-service">Service *</Label>
                    <select
                      id="b-service"
                      required
                      className="flex h-9 w-full rounded-sm border border-input bg-off-white px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="">Select a service</option>
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>{s.name} — from GHS {s.starting_price.toLocaleString()}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="b-date">Event Date *</Label>
                      <Input id="b-date" type="date" required className="bg-off-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="b-location">Venue / Location *</Label>
                      <Input id="b-location" required placeholder="e.g. AICC, Accra" className="bg-off-white" />
                    </div>
                  </div>
                </fieldset>

                <fieldset className="space-y-4">
                  <legend className="font-heading font-bold text-xl uppercase text-secondary mb-2">Additional Notes</legend>
                  <div className="space-y-2">
                    <Textarea
                      id="b-notes"
                      placeholder="Anything else we should know — schedule, access requirements, special requests."
                      className="min-h-[100px] bg-off-white"
                    />
                  </div>
                </fieldset>

                <div className="bg-off-white border border-border rounded-sm p-4 text-sm text-muted-foreground">
                  By submitting, you acknowledge that a 50% non-refundable deposit is required to secure your date. Full payment terms will be included in your invoice.
                </div>

                <Button type="submit" size="lg" className="w-full uppercase font-bold tracking-wide">
                  Submit Booking Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
