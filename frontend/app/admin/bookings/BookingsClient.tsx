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
import { Trash2, MessageSquare, Calendar, FileText, CheckCircle2 } from "lucide-react";
import { deleteBooking, updateBookingStatus, deleteQuoteRequest } from "@/lib/actions";
import { createWhatsAppDeepLink } from "@/lib/whatsapp-utils";

type Booking = {
  id: string;
  guestName: string | null;
  guestEmail: string | null;
  guestPhone?: string | null;
  eventType: string;
  eventDate: string;
  location: string;
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
  total: string;
  requirements?: string | null;
};

type QuoteRequest = {
  id: string;
  guestName: string | null;
  guestEmail: string | null;
  guestPhone?: string | null;
  eventType: string;
  eventDate: string;
  location: string;
  expectedAttendance?: number | null;
  requirements?: string | null;
  status: string;
  createdAt: Date;
};

export default function BookingsClient({ 
  initialBookings,
  initialQuotes = [],
}: { 
  initialBookings: Booking[];
  initialQuotes?: QuoteRequest[];
}) {
  const [activeTab, setActiveTab] = useState<"bookings" | "quotes">("bookings");
  const [bookings, setBookings] = useState(initialBookings);
  const [quotes, setQuotes] = useState(initialQuotes);

  const handleDeleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking record?")) return;
    await deleteBooking(id);
    setBookings(bookings.filter(b => b.id !== id));
  };

  const handleDeleteQuote = async (id: string) => {
    if (!confirm("Are you sure you want to delete this quote request?")) return;
    await deleteQuoteRequest(id);
    setQuotes(quotes.filter(q => q.id !== id));
  };

  const handleStatusChange = async (id: string, newStatus: Booking["status"]) => {
    await updateBookingStatus(id, newStatus);
    setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };

  const openWhatsAppChat = (phone: string | null | undefined, name: string | null | undefined, type: "booking" | "quote") => {
    if (!phone) {
      alert("No phone number available for this client.");
      return;
    }
    const clientName = name ? ` ${name}` : "";
    const greeting = `Hello${clientName}! This is Ravenous Studio Production regarding your ${type === "booking" ? "booking request" : "quote request"}. We'd love to discuss your event details!`;
    const link = createWhatsAppDeepLink(phone, greeting);
    if (link) {
      window.open(link, "_blank", "noopener,noreferrer");
    } else {
      alert("Could not generate WhatsApp link for: " + phone);
    }
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    confirmed: "bg-blue-100 text-blue-800 border-blue-200",
    in_progress: "bg-purple-100 text-purple-800 border-purple-200",
    completed: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <div className="space-y-6">
      {/* Navigation tabs between Bookings and Quotes */}
      <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
        <button
          onClick={() => setActiveTab("bookings")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            activeTab === "bookings"
              ? "bg-secondary text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          <Calendar size={16} />
          Bookings ({bookings.length})
        </button>

        <button
          onClick={() => setActiveTab("quotes")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            activeTab === "quotes"
              ? "bg-secondary text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          <FileText size={16} />
          Quote Requests ({quotes.length})
        </button>
      </div>

      {activeTab === "bookings" ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead>Client & Contact</TableHead>
                <TableHead>Event Details</TableHead>
                <TableHead>Pricing</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                    No bookings found. Incoming bookings will appear here.
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="font-medium text-gray-900">{booking.guestName || "Guest User"}</div>
                      <div className="text-xs text-gray-500">{booking.guestEmail || "No email"}</div>
                      {booking.guestPhone && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-mono text-gray-600">{booking.guestPhone}</span>
                          <button
                            type="button"
                            onClick={() => openWhatsAppChat(booking.guestPhone, booking.guestName, "booking")}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-700 bg-green-50 hover:bg-green-100 px-2 py-0.5 rounded border border-green-200"
                            title="Chat with client on WhatsApp"
                          >
                            <MessageSquare className="w-3 h-3" /> WhatsApp
                          </button>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-gray-900">{booking.eventType}</div>
                      <div className="text-xs text-gray-500">
                        {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(booking.eventDate))} • {booking.location}
                      </div>
                      {booking.requirements && (
                        <p className="text-xs text-gray-500 mt-1 max-w-xs truncate" title={booking.requirements}>
                          {booking.requirements}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      {Number(booking.total) > 0 ? (
                        <span className="font-semibold text-gray-900">GH₵{Number(booking.total).toLocaleString()}</span>
                      ) : (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Contact for Pricing</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value as Booking["status"])}
                        className={`text-xs font-semibold rounded-full px-2.5 py-1 border outline-none ${statusColors[booking.status]}`}
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
                        onClick={() => handleDeleteBooking(booking.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        title="Delete booking"
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
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead>Client & Contact</TableHead>
                <TableHead>Event & Date</TableHead>
                <TableHead>Location & Attendance</TableHead>
                <TableHead>Requirements</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                    No quote requests found. Incoming requests will appear here.
                  </TableCell>
                </TableRow>
              ) : (
                quotes.map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell>
                      <div className="font-medium text-gray-900">{quote.guestName || "Guest User"}</div>
                      <div className="text-xs text-gray-500">{quote.guestEmail || "No email"}</div>
                      {quote.guestPhone && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-mono text-gray-600">{quote.guestPhone}</span>
                          <button
                            type="button"
                            onClick={() => openWhatsAppChat(quote.guestPhone, quote.guestName, "quote")}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-700 bg-green-50 hover:bg-green-100 px-2 py-0.5 rounded border border-green-200"
                            title="Chat with client on WhatsApp"
                          >
                            <MessageSquare className="w-3 h-3" /> WhatsApp
                          </button>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-gray-900">{quote.eventType}</div>
                      <div className="text-xs text-gray-500">
                        {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(quote.eventDate))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-800">{quote.location}</div>
                      <div className="text-xs text-gray-500">
                        {quote.expectedAttendance ? `${quote.expectedAttendance} guests` : "Attendance not specified"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-xs text-gray-600 max-w-xs line-clamp-2" title={quote.requirements || ""}>
                        {quote.requirements || "None specified"}
                      </p>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteQuote(quote.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        title="Delete quote request"
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
      )}
    </div>
  );
}
