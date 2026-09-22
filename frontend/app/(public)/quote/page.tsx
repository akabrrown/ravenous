"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { services } from "@/lib/mock-data";
import { CheckCircle2 } from "lucide-react";

const eventTypes = ["Wedding", "Funeral", "Gospel Concert", "Corporate Event", "Outdoor Festival", "Other"];

export default function QuotePage() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  function toggleService(id: string) {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  if (submitted) {
    return (
      <>
        <section className="bg-deep-navy text-white pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-heading font-bold text-4xl md:text-6xl uppercase tracking-tight mb-4">
              Quote <span className="text-primary">Requested</span>
            </h1>
          </div>
        </section>
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl text-center">
            <CheckCircle2 className="h-16 w-16 text-stage-gold mx-auto mb-6" />
            <h2 className="font-heading font-bold text-3xl uppercase text-secondary mb-4">We've received your request</h2>
            <p className="text-muted-foreground text-lg">
              Our team will review your event details and send you a detailed quote within 24–48 hours. Check your email for a confirmation.
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
              Request a <span className="text-primary">Quote</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300">
              Tell us about your event and we'll put together a production plan and pricing tailored to your needs.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <Card className="border-border/50 shadow-md rounded-sm overflow-hidden">
            <div className="h-1.5 bg-primary w-full"></div>
            <CardContent className="p-8 md:p-10">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="space-y-8"
              >
                {/* Contact Info */}
                <fieldset className="space-y-4">
                  <legend className="font-heading font-bold text-xl uppercase text-secondary mb-2">Your Details</legend>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="q-name">Full Name *</Label>
                      <Input id="q-name" required placeholder="Kwame Asante" className="bg-off-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="q-phone">Phone / WhatsApp *</Label>
                      <Input id="q-phone" type="tel" required placeholder="+233 XX XXX XXXX" className="bg-off-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="q-email">Email Address *</Label>
                    <Input id="q-email" type="email" required placeholder="kwame@example.com" className="bg-off-white" />
                  </div>
                </fieldset>

                {/* Event Info */}
                <fieldset className="space-y-4">
                  <legend className="font-heading font-bold text-xl uppercase text-secondary mb-2">Event Details</legend>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="q-event-type">Event Type *</Label>
                      <select
                        id="q-event-type"
                        required
                        className="flex h-9 w-full rounded-sm border border-input bg-off-white px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <option value="">Select event type</option>
                        {eventTypes.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="q-date">Preferred Date *</Label>
                      <Input id="q-date" type="date" required className="bg-off-white" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="q-location">Venue / Location</Label>
                      <Input id="q-location" placeholder="e.g. Kempinski Hotel, Accra" className="bg-off-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="q-guests">Expected Attendance</Label>
                      <Input id="q-guests" type="number" placeholder="500" className="bg-off-white" />
                    </div>
                  </div>
                </fieldset>

                {/* Services */}
                <fieldset className="space-y-4">
                  <legend className="font-heading font-bold text-xl uppercase text-secondary mb-2">Services Needed</legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {services.map((s) => (
                      <label
                        key={s.id}
                        className={`flex items-center gap-3 p-3 rounded-sm border cursor-pointer transition-colors ${
                          selectedServices.includes(s.id)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-muted-foreground"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedServices.includes(s.id)}
                          onChange={() => toggleService(s.id)}
                          className="accent-primary h-4 w-4"
                        />
                        <span className="text-sm font-medium">{s.name}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                {/* Additional */}
                <fieldset className="space-y-4">
                  <legend className="font-heading font-bold text-xl uppercase text-secondary mb-2">Additional Information</legend>
                  <div className="space-y-2">
                    <Label htmlFor="q-details">Tell us more about your event</Label>
                    <Textarea
                      id="q-details"
                      placeholder="Describe the event layout, any specific equipment requirements, or questions you have."
                      className="min-h-[120px] bg-off-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="q-budget">Approximate Budget (GHS)</Label>
                    <Input id="q-budget" type="number" placeholder="e.g. 8000" className="bg-off-white" />
                  </div>
                </fieldset>

                <Button type="submit" size="lg" className="w-full uppercase font-bold tracking-wide">
                  Submit Quote Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
