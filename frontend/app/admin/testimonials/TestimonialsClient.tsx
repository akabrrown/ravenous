"use client";

import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Star } from "lucide-react";
import { deleteTestimonial, updateTestimonialStatus } from "@/lib/actions";

type Testimonial = {
  id: string;
  customerName: string;
  quoteText: string;
  rating: number | null;
  status: "pending" | "published" | "rejected";
  createdAt: Date;
  customerPhoto: { deliveryUrl: string } | null;
};

export default function TestimonialsClient({ initialTestimonials }: { initialTestimonials: Testimonial[] }) {
  const [testimonials, setTestimonials] = useState(initialTestimonials);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    
    await deleteTestimonial(id);
    setTestimonials(testimonials.filter(t => t.id !== id));
  };

  const handleStatusChange = async (id: string, newStatus: Testimonial["status"]) => {
    await updateTestimonialStatus(id, newStatus);
    setTestimonials(testimonials.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    published: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50/50">
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead className="w-1/2">Quote</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {testimonials.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                No testimonials found.
              </TableCell>
            </TableRow>
          ) : (
            testimonials.map((testimonial) => (
              <TableRow key={testimonial.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {testimonial.customerPhoto ? (
                      <img 
                        src={testimonial.customerPhoto.deliveryUrl} 
                        alt={testimonial.customerName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-400">
                        {testimonial.customerName.charAt(0)}
                      </div>
                    )}
                    <div className="font-medium text-gray-900">{testimonial.customerName}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-gray-600 line-clamp-2 italic">
                    "{testimonial.quoteText}"
                  </p>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        fill={i < (testimonial.rating || 5) ? "currentColor" : "none"} 
                        className={i < (testimonial.rating || 5) ? "" : "text-gray-300"}
                      />
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <select
                    value={testimonial.status}
                    onChange={(e) => handleStatusChange(testimonial.id, e.target.value as Testimonial["status"])}
                    className={`text-xs font-semibold rounded-full px-2.5 py-0.5 border outline-none ${statusColors[testimonial.status]}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="published">Published</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(testimonial.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
