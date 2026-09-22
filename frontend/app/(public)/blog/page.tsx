import Link from "next/link";
import { cn } from "@/lib/utils";
import { blog_posts } from "@/lib/mock-data";
import { ArrowRight, Calendar, User } from "lucide-react";

export const metadata = {
  title: "Blog | Ravenous Studio Production",
  description: "News, insights, and behind-the-scenes from Ravenous Studio Production.",
};

export default function BlogIndexPage() {
  return (
    <>
      <section className="bg-deep-navy text-white pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-heading font-bold text-4xl md:text-6xl uppercase tracking-tight mb-4">
              Our <span className="text-primary">Journal</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300">
              Industry insights, production tips, and behind-the-scenes looks at our latest events.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blog_posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col h-full bg-off-white border border-border rounded-sm overflow-hidden hover:shadow-md transition-shadow">
                
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <img 
                    src={post.cover_media || "/placeholder.webp"} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-navy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                    <span className="flex items-center"><Calendar className="mr-1 h-3 w-3" /> {new Date(post.published_at).toLocaleDateString()}</span>
                    <span className="flex items-center"><User className="mr-1 h-3 w-3" /> {post.author}</span>
                  </div>
                  
                  <h2 className="font-heading font-bold text-2xl uppercase text-secondary mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  
                  <p className="text-muted-foreground line-clamp-3 mb-6 flex-1">
                    {post.excerpt}
                  </p>
                  
                  <div className="mt-auto flex items-center text-sm font-bold uppercase tracking-wider text-primary group-hover:text-primary/80 transition-colors">
                    Read Article <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

              </Link>
            ))}
          </div>

          {blog_posts.length === 0 && (
            <div className="text-center py-20">
              <h2 className="font-heading font-bold text-2xl uppercase text-secondary mb-2">No posts yet</h2>
              <p className="text-muted-foreground">Check back soon for new articles and updates.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
