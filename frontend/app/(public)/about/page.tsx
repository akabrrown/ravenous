import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Video, Camera, MonitorPlay } from "lucide-react";

export const metadata = {
  title: "About Us | Ravenous Studio Production",
  description: "Learn about our story, mission, and the professional equipment we use for live event production.",
};

export default function AboutPage() {
  return (
    <>
      {/* PAGE HEADER */}
      <section className="bg-deep-navy text-white pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-heading font-bold text-4xl md:text-6xl uppercase tracking-tight mb-4">
              About <span className="text-primary">Ravenous</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300">
              We are a premier event production and media company dedicated to flawless execution.
            </p>
          </div>
        </div>
      </section>

      {/* STORY & MISSION */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="font-heading font-bold text-3xl uppercase text-secondary mb-6">Our Story</h2>
              <div className="prose prose-lg text-muted-foreground">
                <p>
                  [Client to provide: Studio story / how Ravenous started (a paragraph or two)] 
                </p>
                <p>
                  We started with a simple goal: to elevate the standard of event production in Ghana. 
                  Today, we power some of the most significant weddings, funerals, and gospel concerts in Accra.
                </p>
              </div>

              <div className="mt-12 space-y-8">
                <div>
                  <h3 className="font-heading font-bold text-2xl uppercase text-secondary mb-3 flex items-center gap-2">
                    <MonitorPlay className="h-6 w-6 text-primary" /> Our Mission
                  </h3>
                  <p className="text-muted-foreground">
                    [Client to provide: Mission statement] To deliver seamless, high-quality production services that amplify the impact of every event, ensuring audiences both in-person and online experience the moment fully.
                  </p>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-2xl uppercase text-secondary mb-3 flex items-center gap-2">
                    <Video className="h-6 w-6 text-primary" /> Our Vision
                  </h3>
                  <p className="text-muted-foreground">
                    [Client to provide: Vision statement] To be the most trusted live production partner in West Africa, recognized for our technical excellence and reliability.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] bg-muted rounded-sm overflow-hidden shadow-xl border border-border relative">
                <img src="/images/live_stream.jpg" alt="The Ravenous Team" className="object-cover w-full h-full" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-primary text-white p-6 shadow-lg hidden md:block">
                <h4 className="font-heading font-bold text-2xl uppercase">Flawless<br/>Execution</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 bg-off-white border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-center text-secondary mb-16 uppercase">Why Choose Us</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Technical Expertise", desc: "Our team consists of seasoned engineers and operators who understand the intricacies of live production." },
              { title: "High-End Equipment", desc: "We own our gear, from 4K cinema cameras to modular LED panels, ensuring quality control and reliability." },
              { title: "Peace of Mind", desc: "When you book Ravenous, you can focus on your guests. We handle the technical complexities seamlessly." },
            ].map((item, i) => (
              <Card key={i} className="bg-white border-border/50 hover:border-primary/30 transition-colors shadow-sm">
                <CardContent className="pt-8">
                  <CheckCircle2 className="h-10 w-10 text-stage-gold mb-6" />
                  <h3 className="font-heading font-bold text-xl text-secondary uppercase mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* EQUIPMENT LIST */}
      <section className="py-20 bg-deep-navy text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-heading font-bold text-3xl md:text-4xl uppercase mb-4">Our Gear</h2>
            <p className="text-gray-300">
              We believe in using the right tool for the job. Our inventory is constantly updated to meet industry standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { category: "Cameras & Optics", icon: <Camera className="h-6 w-6" />, items: ["Sony FX6 / A7S III", "Canon C300 Mk III", "DJI Ronin Gimbals", "DJI Mavic 3 Drones"] },
              { category: "Vision & Switching", icon: <MonitorPlay className="h-6 w-6" />, items: ["Blackmagic ATEM Constellation", "Novastar LED Processors", "LiveU Solo Encoders", "Hollyland Wireless Video"] },
              { category: "Audio Production", icon: <CheckCircle2 className="h-6 w-6" />, items: ["Zoom F8n Pro Field Recorders", "Sennheiser Wireless Systems", "Yamaha Digital Consoles", "Rode Broadcast Mics"] },
              { category: "LED & Displays", icon: <Video className="h-6 w-6" />, items: ["P3.91mm Outdoor LED Panels", "P2.5mm Indoor LED Panels", "Custom Trussing Systems", "Confidence Monitors"] },
            ].map((gear, i) => (
              <div key={i} className="bg-studio-navy p-6 rounded-sm border border-white/10 hover:border-white/20 transition-colors">
                <div className="text-stage-gold mb-4">{gear.icon}</div>
                <h3 className="font-heading font-bold text-lg uppercase mb-4">{gear.category}</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  {gear.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/70"></span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
