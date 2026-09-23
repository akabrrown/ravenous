import Link from "next/link";
import { Globe, MessageCircle, Mail, Video } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="font-heading font-bold text-2xl tracking-tight text-white">
                RAVENOUS
              </span>
              <span className="font-heading font-bold text-xl tracking-tight text-primary ml-2">
                STUDIO
              </span>
            </Link>
            <p className="text-gray-300 text-sm mt-2 max-w-xs">
              Premier event production, live streaming, and media coverage across Accra and beyond.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <Link href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Globe className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-300 hover:text-primary transition-colors">
                <MessageCircle className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Video className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-heading font-bold text-lg mb-4 text-white">Services</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/services/led-screen-rental" className="hover:text-primary transition-colors">LED Screen Rental</Link></li>
              <li><Link href="/services/live-streaming" className="hover:text-primary transition-colors">Live Streaming</Link></li>
              <li><Link href="/services/live-recording" className="hover:text-primary transition-colors">Live Recording</Link></li>
              <li><Link href="/services/wedding-coverage" className="hover:text-primary transition-colors">Wedding Coverage</Link></li>
              <li><Link href="/services/funeral-coverage" className="hover:text-primary transition-colors">Funeral Coverage</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-bold text-lg mb-4 text-white">Company</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/portfolio" className="hover:text-primary transition-colors">Portfolio</Link></li>
              <li><Link href="/packages" className="hover:text-primary transition-colors">Packages</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/review" className="hover:text-primary transition-colors">Leave a Review</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-bold text-lg mb-4 text-white">Contact</h3>
            <address className="not-italic space-y-2 text-sm text-gray-300">
              <p>Accra, Ghana</p>
              <p>Phone: +233 (0) XX XXX XXXX</p>
              <p>Email: hello@ravenousstudio.com</p>
              <p>Hours: Mon-Sat, 9AM-6PM</p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-600/30 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} Ravenous Studio Production. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
