"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, MessageSquare, Loader2, AlertCircle } from "lucide-react";
import { submitContactMessage } from "@/lib/actions";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await submitContactMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject || "General Inquiry",
        message: formData.message,
      });

      if (res.success) {
        setWhatsappUrl(res.whatsappUrl);
        setSubmitted(true);
      } else {
        setErrorMessage("Could not send your message. Please try again.");
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
      <Card className="border-border/50 shadow-lg rounded-sm overflow-hidden">
        <div className="h-2 bg-green-500 w-full" />
        <CardContent className="p-8 text-center">
          <CheckCircle2 className="h-14 w-14 text-green-600 mx-auto mb-4" />
          <h2 className="font-heading font-bold text-2xl uppercase text-secondary mb-2">
            Message Sent Successfully
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Thank you for reaching out! Our team has received your message and will respond promptly.
          </p>

          {whatsappUrl && (
            <div className="mb-6 p-5 bg-green-50 border border-green-200 rounded-sm text-center">
              <h3 className="font-heading font-bold text-lg uppercase text-green-950 mb-1">
                Want a faster response?
              </h3>
              <p className="text-xs text-green-800 mb-4 max-w-sm mx-auto">
                Our admin was notified. You can also chat directly on WhatsApp with your inquiry pre-filled.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold uppercase tracking-wider text-xs px-5 py-2.5 rounded-sm shadow transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Chat with Admin on WhatsApp
              </a>
            </div>
          )}

          <Button 
            variant="outline" 
            onClick={() => {
              setSubmitted(false);
              setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
            }}
            className="uppercase text-xs font-semibold"
          >
            Send Another Message
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 shadow-lg rounded-sm overflow-hidden">
      <div className="h-2 bg-primary w-full" />
      <CardContent className="p-8">
        <h2 className="font-heading font-bold text-2xl uppercase text-secondary mb-6">
          Send us a message
        </h2>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-sm flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="c-name">Full Name *</Label>
            <Input 
              id="c-name" 
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe" 
              className="bg-off-white" 
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="c-email">Email Address *</Label>
              <Input 
                id="c-email" 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com" 
                className="bg-off-white" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-phone">Phone / WhatsApp</Label>
              <Input 
                id="c-phone" 
                type="tel" 
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+233 XX XXX XXXX" 
                className="bg-off-white" 
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="c-subject">Subject *</Label>
            <Input 
              id="c-subject" 
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="e.g. LED Screen Inquiry" 
              className="bg-off-white" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="c-message">Message *</Label>
            <Textarea 
              id="c-message" 
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="How can we help you?" 
              className="min-h-[120px] bg-off-white" 
            />
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
                Sending Message...
              </>
            ) : (
              "Send Message"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
