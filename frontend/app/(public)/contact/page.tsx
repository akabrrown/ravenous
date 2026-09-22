import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const metadata = {
  title: "Contact Us | Ravenous Studio Production",
  description: "Get in touch with Ravenous Studio Production for your live event production needs in Ghana.",
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-deep-navy text-white pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-heading font-bold text-4xl md:text-6xl uppercase tracking-tight mb-4">
              Get in <span className="text-primary">Touch</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300">
              We are ready to handle the technical complexity of your next event. Contact our team today.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Info */}
            <div>
              <h2 className="font-heading font-bold text-3xl uppercase text-secondary mb-8">Contact Information</h2>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-sm">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-secondary uppercase mb-1">Our Studio</h3>
                    <p className="text-muted-foreground">Accra, Ghana<br/>[Client to provide full address]</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-sm">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-secondary uppercase mb-1">Phone & WhatsApp</h3>
                    <p className="text-muted-foreground">[Client Phone Number]</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-sm">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-secondary uppercase mb-1">Email</h3>
                    <p className="text-muted-foreground">hello@ravenousstudio.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-sm">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-secondary uppercase mb-1">Operating Hours</h3>
                    <p className="text-muted-foreground">Mon-Sat, 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="border-border/50 shadow-lg rounded-sm overflow-hidden">
              <div className="h-2 bg-primary w-full"></div>
              <CardContent className="p-8">
                <h2 className="font-heading font-bold text-2xl uppercase text-secondary mb-6">Send us a message</h2>
                <form className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Doe" className="bg-off-white" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="john@example.com" className="bg-off-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="+233 XX XXX XXXX" className="bg-off-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="General Inquiry" className="bg-off-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="How can we help you?" className="min-h-[120px] bg-off-white" />
                  </div>
                  <Button type="button" size="lg" className="w-full uppercase font-bold tracking-wide">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>
    </>
  );
}
