"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const images = [
  "/images/live_recording.jpg",
  "/images/gospel_coverage.jpg",
  "/images/wedding.jpg",
  "/images/outdoor.jpg",
  "/images/led_screen.jpg",
  "/images/live_stream.jpg",
];

export function HeroSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full bg-studio-navy z-0">
      {images.map((src, index) => (
        <img
          key={src}
          src={src}
          alt={`Hero slideshow image ${index + 1}`}
          className={cn(
            "absolute inset-0 object-cover w-full h-full transition-opacity duration-1000 ease-in-out",
            index === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
          )}
        />
      ))}
      <div className="absolute inset-0 bg-deep-navy/60 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-r from-deep-navy via-deep-navy/80 to-transparent" />

      {/* Slide Indicators */}
      <div className="absolute bottom-12 right-12 flex gap-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              index === currentIndex ? "bg-stage-gold w-6" : "bg-white/30 hover:bg-white/50"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
