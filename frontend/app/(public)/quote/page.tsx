"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { services } from "@/lib/mock-data";
import { CheckCircle2, MessageSquare, Loader2, AlertCircle } from "lucide-react";
import { submitQuoteRequest } from "@/lib/actions";

const eventTypes = ["Wedding", "Funeral", "Gospel Concert", "Corporate Event", "Outdoor Festival", "Other"];

export default function QuotePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    eventType: "",
    eventDate: "",
    location: "",
    expectedAttendance: "",
    requirements: "",
    budget: "",
  });

  function toggleService(id: string) {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const selectedServiceNames = services
      .filter((s) => selectedServices.includes(s.id))
      .map((s) => s.name);

    try {
      const res = await submitQuoteRequest({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        eventType: formData.eventType,
        eventDate: formData.eventDate,
        location: formData.location || "Accra, Ghana",
        serviceIds: selectedServices,
        serviceNames: selectedServiceNames,
        expectedAttendance: formData.expectedAttendance || undefined,
        requirements: formData.requirements ? `${formData.requirements}${formData.budget ? `\nApproximate Budget: GHS ${formData.budget}` : ""}` : undefined,
      });

      if (res.success) {
        setWhatsappUrl(res.whatsappUrl);
        setSubmitted(true);
      } else {
        setErrorMessage("Could not submit quote request. Please try again.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
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
              Quote <span className="text-primary">Requested</span>
            </h1>
          </div>
        </section>
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl text-center">
            <CheckCircle2 className="h-16 w-16 text-stage-gold mx-auto mb-6" />
            <h2 className="font-heading font-bold text-3xl uppercase text-secondary mb-4">We've received your request</h2>
            <p className="text-muted-foreground text-lg mb-8">
              Our team will review your event details and send you a detailed quote within 24–48 hours. Check your email for confirmation.
            </p>

            {whatsappUrl && (
              <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-sm text-center shadow-sm">
                <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-xl uppercase text-green-950 mb-1">
                  Speed up your quote on WhatsApp
                </h3>
                <p className="text-sm text-green-800 mb-4 max-w-md mx-auto">
                  Our admin has received an alert. You can also chat directly on WhatsApp with all your requirements pre-filled for an immediate quote!
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
              {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-sm flex items-center gap-3 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Contact Info */}
                <fieldset className="space-y-4">
                  <legend className="font-heading font-bold text-xl uppercase text-secondary mb-2">Your Details</legend>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="q-name">Full Name *</Label>
                      <Input 
                        id="q-name" 
                        required 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Kwame Asante" 
                        className="bg-off-white" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="q-phone">Phone / WhatsApp *</Label>
                      <Input 
                        id="q-phone" 
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
                    <Label htmlFor="q-email">Email Address *</Label>
                    <Input 
                      id="q-email" 
                      type="email" 
                      required 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="kwame@example.com" 
                      className="bg-off-white" 
                    />
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
                        value={formData.eventType}
                        onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
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
                      <Input 
                        id="q-date" 
                        type="date" 
                        required 
                        value={formData.eventDate}
                        onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                        className="bg-off-white" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="q-location">Venue / Location *</Label>
                      <Input 
                        id="q-location" 
                        required
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g. Kempinski Hotel, Accra" 
                        className="bg-off-white" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="q-guests">Expected Attendance</Label>
                      <Input 
                        id="q-guests" 
                        type="number" 
                        value={formData.expectedAttendance}
                        onChange={(e) => setFormData({ ...formData, expectedAttendance: e.target.value })}
                        placeholder="500" 
                        className="bg-off-white" 
                      />
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
                      value={formData.requirements}
                      onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                      placeholder="Describe the event layout, any specific equipment requirements, or questions you have."
                      className="min-h-[120px] bg-off-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="q-budget">Approximate Budget (GHS - Optional)</Label>
                    <Input 
                      id="q-budget" 
                      type="number" 
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      placeholder="e.g. 8000" 
                      className="bg-off-white" 
                    />
                  </div>
                </fieldset>

                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={isSubmitting}
                  className="w-full uppercase font-bold tracking-wide flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting Quote Request...
                    </>
                  ) : (
                    "Submit Quote Request"
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
