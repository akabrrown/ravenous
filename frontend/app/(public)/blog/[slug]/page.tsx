import { notFound } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getBlogPostBySlug } from "@/lib/actions";
import { ArrowRight, Calendar, User, Share2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} | Ravenous Studio Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <article>
        {/* Article Header */}
        <section className="bg-deep-navy text-white pt-32 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <Link href="/blog" className="inline-flex items-center text-sm font-bold tracking-wider uppercase text-gray-400 hover:text-white mb-8 transition-colors">
              <ArrowRight className="mr-2 h-4 w-4 rotate-180" /> Back to Journal
            </Link>
            
            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight mb-8 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm font-bold uppercase tracking-wider text-gray-400 border-t border-white/10 pt-6">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-primary" />
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Unpublished'}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Image */}
        <section className="bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl -mt-8 relative z-10">
            <div className="aspect-[21/9] w-full bg-muted shadow-2xl rounded-sm overflow-hidden border border-border">
              <img 
                src={post.coverMedia?.deliveryUrl || "/placeholder.webp"} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Article Body */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <div 
              className="prose prose-slate prose-lg dark:prose-invert max-w-none prose-headings:font-heading prose-headings:uppercase prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: post.content }} // Using dangerouslySetInnerHTML to render the mock HTML string
            />

            <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <p className="font-heading font-bold uppercase text-secondary">Share this article</p>
                <div className="flex gap-2">
                  <Link href="#" className={cn(buttonVariants({ variant: "outline", size: "icon" }), "rounded-full")}>
                    <Share2 className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              
              <Link href="/blog" className={buttonVariants({ variant: "default" })}>
                Read More Articles
              </Link>
            </div>
          </div>
        </section>
      </article>
      
      {/* Newsletter CTA */}
      <section className="py-20 bg-off-white border-t border-border/50 text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="font-heading font-bold text-3xl uppercase text-secondary mb-4">Stay Updated</h2>
          <p className="text-lg text-muted-foreground mb-8">Subscribe to our newsletter for the latest event production insights and company news.</p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-1 h-12 px-4 rounded-sm border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
            <button type="submit" className={cn(buttonVariants({ size: "lg" }), "h-12")}>
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

// Ensure Button is available in scope since we used it inline
function Button({ className, variant, size, ...props }: any) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
}
