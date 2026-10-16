"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { services, EVENT_TYPES } from "@/lib/mock-data";
import { CheckCircle2, MessageSquare, Loader2, AlertCircle } from "lucide-react";
import { submitBookingRequest } from "@/lib/actions";

export default function BookPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    eventType: "",
    serviceId: "",
    date: "",
    location: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const selectedService = services.find((s) => s.id === formData.serviceId);

    try {
      const res = await submitBookingRequest({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        eventType: formData.eventType,
        serviceId: formData.serviceId,
        serviceName: selectedService ? selectedService.name : "Event Production",
        date: formData.date,
        location: formData.location,
        notes: formData.notes,
      });

      if (res.success) {
        setWhatsappUrl(res.whatsappUrl);
        setSubmitted(true);
      } else {
        setErrorMessage("Could not submit booking request. Please try again.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "An unexpected error occurred. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <>
        <section className="bg-deep-navy text-white pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-heading font-bold text-4xl md:text-6xl uppercase tracking-tight mb-4">
              Booking <span className="text-primary">Received</span>
            </h1>
          </div>
        </section>
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl text-center">
            <CheckCircle2 className="h-16 w-16 text-stage-gold mx-auto mb-6" />
            <h2 className="font-heading font-bold text-3xl uppercase text-secondary mb-4">
              Booking request received
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              We'll confirm availability and get back to you with a detailed quote within 24 hours. Check your email for confirmation.
            </p>

            {whatsappUrl && (
              <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-sm text-center shadow-sm">
                <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-xl uppercase text-green-950 mb-1">
                  Speed up your confirmation
                </h3>
                <p className="text-sm text-green-800 mb-4 max-w-md mx-auto">
                  Our admin has been alerted. You can also chat directly on WhatsApp with all your event details already pre-filled.
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold uppercase tracking-wider text-sm px-6 py-3 rounded-sm shadow transition-colors"
                >
                  <MessageSquare className="w-5 h-5" />
                  Chat with Admin on WhatsApp
                </a>
              </div>
            )}

            <div className="mt-6 bg-off-white border border-border rounded-sm p-4 text-sm text-left space-y-1">
              <p className="font-bold text-secondary uppercase tracking-wide text-xs mb-2">Payment Methods</p>
              <p className="text-muted-foreground">📱 Mobile Money: <span className="font-semibold text-secondary">Upon request — details in your invoice</span></p>
              <p className="text-muted-foreground">🏦 Bank Transfer: <span className="font-semibold text-secondary">Upon request — details in your invoice</span></p>
            </div>

            <div className="mt-8">
              <Link href="/">
                <Button variant="outline" className="uppercase font-semibold">
                  Return to Homepage
                </Button>
              </Link>
            </div>
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
              {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-sm flex items-center gap-3 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <fieldset className="space-y-4">
                  <legend className="font-heading font-bold text-xl uppercase text-secondary mb-2">Your Details</legend>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="b-name">Full Name *</Label>
                      <Input 
                        id="b-name" 
                        required 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Kwame Asante" 
                        className="bg-off-white" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="b-phone">Phone / WhatsApp *</Label>
                      <Input 
                        id="b-phone" 
                        type="tel" 
                        required 
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+233 XX XXX XXXX" 
                        className="bg-off-white" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="b-email">Email Address *</Label>
                    <Input 
                      id="b-email" 
                      type="email" 
                      required 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="kwame@example.com" 
                      className="bg-off-white" 
                    />
                  </div>
                </fieldset>

                <fieldset className="space-y-4">
                  <legend className="font-heading font-bold text-xl uppercase text-secondary mb-2">Event & Technical Service</legend>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="b-event-type">Event Type *</Label>
                      <select
                        id="b-event-type"
                        required
                        value={formData.eventType}
                        onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                        className="flex h-9 w-full rounded-sm border border-input bg-off-white px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <option value="">Select event type</option>
                        {EVENT_TYPES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="b-service">Primary Service Needed *</Label>
                      <select
                        id="b-service"
                        required
                        value={formData.serviceId}
                        onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                        className="flex h-9 w-full rounded-sm border border-input bg-off-white px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <option value="">Select a service</option>
                        {services.map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="b-date">Event Date *</Label>
                      <Input 
                        id="b-date" 
                        type="date" 
                        required 
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="bg-off-white" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="b-location">Venue / Location *</Label>
                      <Input 
                        id="b-location" 
                        required 
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g. AICC, Accra" 
                        className="bg-off-white" 
                      />
                    </div>
                  </div>
                </fieldset>

                <fieldset className="space-y-4">
                  <legend className="font-heading font-bold text-xl uppercase text-secondary mb-2">Additional Notes</legend>
                  <div className="space-y-2">
                    <Textarea
                      id="b-notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Anything else we should know — schedule, access requirements, special requests."
                      className="min-h-[100px] bg-off-white"
                    />
                  </div>
                </fieldset>

                <div className="bg-off-white border border-border rounded-sm p-4 text-sm text-muted-foreground">
                  By submitting, our team receives an immediate notification on WhatsApp and will review your request to provide a detailed quote.
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={isSubmitting}
                  className="w-full uppercase font-bold tracking-wide flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting Request...
                    </>
                  ) : (
                    "Submit Booking Request"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
