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
import { 
  Trash2, 
  MessageSquare, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  Mail, 
  X, 
  ExternalLink,
  Send,
  AlertCircle
} from "lucide-react";
import { 
  deleteBooking, 
  updateBookingStatus, 
  deleteQuoteRequest, 
  updateQuoteRequestStatus 
} from "@/lib/actions";
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

type NotifyModalData = {
  isOpen: boolean;
  title: string;
  clientName: string | null;
  clientPhone: string | null;
  clientEmail: string | null;
  status: string;
  whatsappUrl: string | null;
  whatsappMessage: string;
  emailStatus: string;
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
  const [notifyModal, setNotifyModal] = useState<NotifyModalData | null>(null);

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
    try {
      const res = await updateBookingStatus(id, newStatus);
      setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));

      if (res.whatsappUrl || res.emailStatus !== "skipped") {
        setNotifyModal({
          isOpen: true,
          title: `Booking Status: ${newStatus.toUpperCase()}`,
          clientName: res.clientName || null,
          clientPhone: res.clientPhone || null,
          clientEmail: res.clientEmail || null,
          status: newStatus,
          whatsappUrl: res.whatsappUrl,
          whatsappMessage: res.whatsappMessage,
          emailStatus: res.emailStatus,
        });
      }
    } catch (err: any) {
      console.error(err);
      alert("Failed to update booking status.");
    }
  };

  const handleQuoteStatusChange = async (id: string, newStatus: any) => {
    try {
      const res = await updateQuoteRequestStatus(id, newStatus);
      setQuotes(quotes.map(q => q.id === id ? { ...q, status: newStatus } : q));

      if (res.whatsappUrl || res.emailStatus !== "skipped") {
        setNotifyModal({
          isOpen: true,
          title: `Quote Status: ${newStatus.toUpperCase()}`,
          clientName: res.clientName || null,
          clientPhone: res.clientPhone || null,
          clientEmail: res.clientEmail || null,
          status: newStatus,
          whatsappUrl: res.whatsappUrl,
          whatsappMessage: res.whatsappMessage,
          emailStatus: res.emailStatus,
        });
      }
    } catch (err: any) {
      console.error(err);
      alert("Failed to update quote request status.");
    }
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
    <div className="space-y-6 relative">
      {/* Client Notification Dispatch Modal */}
      {notifyModal && notifyModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-lg w-full overflow-hidden">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg leading-tight">
                    Status Updated Successfully
                  </h3>
                  <p className="text-xs text-gray-300">
                    Client Notification Routing (Email & WhatsApp)
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setNotifyModal(null)}
                className="text-gray-400 hover:text-white p-1 rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Email Status Indicator */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex items-start gap-3">
                <div className="p-2 rounded-md bg-blue-100 text-blue-700 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="text-xs space-y-0.5 flex-1">
                  <span className="font-bold text-gray-800 block uppercase tracking-wider text-[11px]">
                    Email Notification
                  </span>
                  {notifyModal.emailStatus === "sent" ? (
                    <p className="text-green-700 font-medium">
                      ✓ Branded confirmation email sent to <span className="font-mono">{notifyModal.clientEmail}</span>
                    </p>
                  ) : notifyModal.emailStatus === "logged" ? (
                    <p className="text-slate-600">
                      ✓ Email generated and logged to database for <span className="font-mono">{notifyModal.clientEmail}</span> (Resend API key in testing/simulated mode).
                    </p>
                  ) : (
                    <p className="text-amber-700 font-medium">
                      No client email was provided for this record.
                    </p>
                  )}
                </div>
              </div>

              {/* WhatsApp Message Preview & 1-Click Action */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-green-600" />
                    WhatsApp Client Update
                  </span>
                  {notifyModal.clientPhone && (
                    <span className="text-xs font-mono font-medium text-gray-500">
                      To: {notifyModal.clientPhone}
                    </span>
                  )}
                </div>

                <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-lg p-3.5 text-xs text-gray-800 font-sans whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
                  {notifyModal.whatsappMessage}
                </div>

                <p className="text-[11px] text-gray-500">
                  Tap below to open WhatsApp Web or your mobile app with this exact message pre-composed.
                </p>
              </div>

              {/* Modal Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                {notifyModal.whatsappUrl ? (
                  <a
                    href={notifyModal.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs uppercase tracking-wide px-4 py-3 rounded-lg shadow-sm transition-colors text-center"
                  >
                    <Send className="w-4 h-4" />
                    Send via WhatsApp
                  </a>
                ) : (
                  <div className="w-full text-xs text-center text-amber-600 font-medium py-2">
                    No client phone number available for WhatsApp
                  </div>
                )}

                <Button
                  variant="outline"
                  onClick={() => setNotifyModal(null)}
                  className="w-full sm:w-auto text-xs font-semibold px-4 py-3"
                >
                  Done / Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                        <span className="font-semibold text-gray-900">GH₵${Number(booking.total).toLocaleString()}</span>
                      ) : (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Contact for Pricing</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value as Booking["status"])}
                        className={`text-xs font-semibold rounded-full px-2.5 py-1 border outline-none cursor-pointer ${statusColors[booking.status]}`}
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
                <TableHead>Status</TableHead>
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
                      <select
                        value={quote.status}
                        onChange={(e) => handleQuoteStatusChange(quote.id, e.target.value)}
                        className="text-xs font-semibold rounded-full px-2.5 py-1 border bg-slate-50 text-slate-800 border-slate-200 outline-none cursor-pointer"
                      >
                        <option value="new">New</option>
                        <option value="quoted">Quoted</option>
                        <option value="closed">Closed</option>
                      </select>
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
