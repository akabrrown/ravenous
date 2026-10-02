import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import "./globals.css";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ravenous Studio Production",
  description: "Event production and media company offering LED screen rental, live streaming, live recording, and event coverage.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Ravenous Studio Production",
    description: "Premier event production, live streaming, and media coverage across Accra and beyond.",
    images: [{ url: "/logo.png", width: 1456, height: 816, alt: "Ravenous Studio Production" }],
    siteName: "Ravenous Studio Production",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ravenous Studio Production",
    description: "Premier event production, live streaming, and media coverage across Accra and beyond.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${oswald.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
