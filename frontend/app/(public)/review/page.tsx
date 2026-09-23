"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReviewPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [rating, setRating] = useState<number>(5);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API delay for mock submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-12 flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center border-border">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
              <Star className="w-8 h-8 fill-current" />
            </div>
            <CardTitle className="font-heading text-3xl uppercase text-secondary">Thank You!</CardTitle>
            <CardDescription className="text-lg mt-4">
              Your review has been submitted successfully. We truly appreciate your feedback and your business!
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-secondary uppercase tracking-tight mb-4">
            Leave a Review
          </h1>
          <p className="text-lg text-muted-foreground">
            How did we do? Share your experience with Ravenous Studio to help us improve and let others know what to expect.
          </p>
        </div>

        <Card className="border-border shadow-lg">
          <CardHeader>
            <CardTitle className="font-heading text-2xl uppercase">Your Feedback</CardTitle>
            <CardDescription>All fields are required unless marked optional.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot field for anti-spam */}
              <div className="hidden" aria-hidden="true">
                <Label htmlFor="website">Website</Label>
                <Input id="website" type="text" name="website" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name or Organization</Label>
                <Input id="name" required placeholder="e.g. Kwame & Ama, or Tech Hub Africa" className="bg-off-white" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="event">Event Type (Optional)</Label>
                <Input id="event" placeholder="e.g. Wedding, Concert, Corporate Stream" className="bg-off-white" />
              </div>

              <div className="space-y-4">
                <Label>Rating</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-2 rounded-full transition-colors ${
                        rating >= star ? "text-stage-gold" : "text-muted-foreground hover:text-stage-gold/50"
                      }`}
                      aria-label={`Rate ${star} stars`}
                    >
                      <Star className={`w-8 h-8 ${rating >= star ? "fill-current" : ""}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="review">Your Review</Label>
                <Textarea 
                  id="review" 
                  required 
                  placeholder="Tell us about your experience working with Ravenous Studio..." 
                  className="min-h-[150px] bg-off-white" 
                />
              </div>

              <Button type="submit" disabled={isSubmitting} size="lg" className="w-full uppercase font-bold tracking-wide">
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
