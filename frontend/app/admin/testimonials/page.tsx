import { getAdminTestimonials } from "@/lib/actions";
import TestimonialsClient from "./TestimonialsClient";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const testimonials = await getAdminTestimonials();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-heading">Testimonials</h1>
          <p className="text-gray-500 mt-2">Manage customer reviews and feedback shown on the public site.</p>
        </div>
      </div>

      <TestimonialsClient initialTestimonials={testimonials} />
    </div>
  );
}
