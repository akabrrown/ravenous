"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShow(false); // hide on scroll down past 100px
      } else if (currentScrollY < lastScrollY) {
        setShow(true); // show on scroll up
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", controlNavbar, { passive: true });
    return () => window.removeEventListener("scroll", controlNavbar);
  }, []);

  const links = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Packages", href: "/packages" },
    { name: "About", href: "/about" },
  ];

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-transform duration-300",
      show ? "translate-y-0" : "-translate-y-full"
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-heading font-bold text-2xl tracking-tight text-secondary">
                RAVENOUS
              </span>
              <span className="font-heading font-bold text-xl tracking-tight text-primary hidden sm:inline-block">
                STUDIO
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-bold uppercase tracking-wider text-secondary transition-colors hover:text-primary"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/quote" className={buttonVariants({ variant: "outline" })}>Request a Quote</Link>
            <Link href="/book" className={buttonVariants({ variant: "default" })}>Book a Service</Link>
          </div>

          {/* Premium Mobile Navigation */}
          <div className="flex items-center md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden text-secondary" />}>
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                showCloseButton={false}
                className="w-full sm:w-full max-w-none sm:max-w-none h-[100dvh] bg-deep-navy text-white border-0 p-0 flex flex-col"
              >
                {/* Custom Sheet Header */}
                <div className="flex h-16 items-center justify-between px-4 border-b border-white/10">
                  <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                    <span className="font-heading font-bold text-2xl tracking-tight text-white">
                      RAVENOUS
                    </span>
                    <span className="font-heading font-bold text-xl tracking-tight text-primary">
                      STUDIO
                    </span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="text-white hover:bg-white/10">
                    <X className="h-6 w-6" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </div>
                
                {/* Hidden title for screen readers to satisfy accessibility */}
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

                {/* Massive Typography Navigation */}
                <div className="flex-1 overflow-y-auto no-scrollbar py-12 px-6">
                  <nav className="flex flex-col gap-6">
                    {links.map((link, i) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="group flex items-center justify-between border-b border-white/10 pb-4"
                      >
                        <span className="font-heading font-bold text-4xl sm:text-5xl uppercase tracking-tighter text-white group-hover:text-stage-gold transition-colors">
                          {link.name}
                        </span>
                        <span className="text-stage-gold opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                          <ArrowRight className="h-8 w-8" />
                        </span>
                      </Link>
                    ))}
                  </nav>

                  <div className="mt-12 flex flex-col gap-4">
                    <Link 
                      href="/quote" 
                      onClick={() => setOpen(false)}
                      className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full h-14 bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white uppercase font-bold tracking-wide")}
                    >
                      Request a Quote
                    </Link>
                    <Link 
                      href="/book" 
                      onClick={() => setOpen(false)}
                      className={cn(buttonVariants({ variant: "default", size: "lg" }), "w-full h-14 bg-primary text-white hover:bg-primary/90 uppercase font-bold tracking-wide")}
                    >
                      Book a Service
                    </Link>
                  </div>
                </div>

                {/* Sub-footer contact info */}
                <div className="bg-charcoal p-6 border-t border-white/5">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Get in Touch</p>
                  <p className="text-sm text-gray-300">hello@ravenousstudio.com</p>
                  <p className="text-sm text-gray-300 mt-1">+233 XX XXX XXXX</p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
