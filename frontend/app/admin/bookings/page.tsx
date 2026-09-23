import { getAdminBookings } from "@/lib/actions";
import BookingsClient from "./BookingsClient";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const bookings = await getAdminBookings();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-heading">Quotes & Bookings</h1>
          <p className="text-gray-500 mt-2">Manage your incoming quotes, event bookings, and client requests.</p>
        </div>
      </div>

      <BookingsClient initialBookings={bookings} />
    </div>
  );
}
