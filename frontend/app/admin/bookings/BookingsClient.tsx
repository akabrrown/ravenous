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
import { Trash2 } from "lucide-react";
import { deleteBooking, updateBookingStatus } from "@/lib/actions";

type Booking = {
  id: string;
  guestName: string | null;
  guestEmail: string | null;
  eventType: string;
  eventDate: string;
  location: string;
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
  total: string;
};

export default function BookingsClient({ initialBookings }: { initialBookings: Booking[] }) {
  const [bookings, setBookings] = useState(initialBookings);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    
    await deleteBooking(id);
    setBookings(bookings.filter(b => b.id !== id));
  };

  const handleStatusChange = async (id: string, newStatus: Booking["status"]) => {
    await updateBookingStatus(id, newStatus);
    setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    confirmed: "bg-blue-100 text-blue-800 border-blue-200",
    in_progress: "bg-purple-100 text-purple-800 border-purple-200",
    completed: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50/50">
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Event Details</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                No bookings found.
              </TableCell>
            </TableRow>
          ) : (
            bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>
                  <div className="font-medium text-gray-900">{booking.guestName || "Guest User"}</div>
                  <div className="text-sm text-gray-500">{booking.guestEmail || "No email"}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-gray-900">{booking.eventType}</div>
                  <div className="text-sm text-gray-500">
                    {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(booking.eventDate))} • {booking.location}
                  </div>
                </TableCell>
                <TableCell className="font-medium text-gray-900">
                  ${Number(booking.total).toFixed(2)}
                </TableCell>
                <TableCell>
                  <select
                    value={booking.status}
                    onChange={(e) => handleStatusChange(booking.id, e.target.value as Booking["status"])}
                    className={`text-xs font-semibold rounded-full px-2.5 py-0.5 border outline-none ${statusColors[booking.status]}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(booking.id)}
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
