import React, { useState } from "react";
import { Calendar, User, DollarSign, CheckCircle2, Clock, Check } from "lucide-react";
import { BookingRecord } from "../types";

interface BookingsTabProps {
  bookings: BookingRecord[];
  searchQuery?: string;
}

export const BookingsTab: React.FC<BookingsTabProps> = ({
  bookings,
  searchQuery = "",
}) => {
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const displayBookings: BookingRecord[] = bookings || [];

  const filtered = displayBookings.filter((b) => {
    if (filterStatus !== "all" && b.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchGuest = b.guestName.toLowerCase().includes(q);
      const matchEmail = b.guestEmail.toLowerCase().includes(q);
      const matchSuite = b.room?.name.toLowerCase().includes(q);
      if (!matchGuest && !matchEmail && !matchSuite) return false;
    }
    return true;
  });

  return (
    <div className="bg-white rounded-3xl border border-[#EBEBEB] p-6 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F2F2F2]">
        <div>
          <h2 className="text-base font-bold font-syne text-[#222222]">
            Guest Reservations & Payout Ledger
          </h2>
          <p className="text-xs text-[#717171]">
            Confirmed bookings, guest details, and financial payout reconciliations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-[#E5E5E5] bg-white text-xs font-semibold text-[#4A4A4A] focus:outline-none cursor-pointer"
          >
            <option value="all">All Bookings</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#F2F2F2] text-[11px] font-bold text-[#717171] uppercase tracking-wider">
              <th className="pb-3 pl-2">Booking ID</th>
              <th className="pb-3">Guest Details</th>
              <th className="pb-3">Sanctuary</th>
              <th className="pb-3">Stay Dates</th>
              <th className="pb-3">Total Amount</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 pr-2 text-right">Payout</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F7F7F8]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-xs text-[#717171]">
                  No reservation records found.
                </td>
              </tr>
            ) : (
              filtered.map((booking) => (
                <tr key={booking.id} className="hover:bg-[#FAFAFA] transition">
                <td className="py-3.5 pl-2 font-mono font-bold text-[#222222]">
                  {booking.id}
                </td>

                <td className="py-3.5">
                  <div className="font-bold text-[#222222]">{booking.guestName}</div>
                  <div className="text-[11px] text-[#717171]">{booking.guestEmail}</div>
                </td>

                <td className="py-3.5">
                  <div className="flex items-center gap-2">
                    {booking.room?.featuredImage && (
                      <img
                        src={booking.room.featuredImage}
                        alt=""
                        className="w-8 h-8 rounded-lg object-cover shrink-0 border border-[#EBEBEB]"
                      />
                    )}
                    <span className="font-semibold text-[#222222] truncate max-w-[160px]">
                      {booking.room?.name || "Alpine Chalet"}
                    </span>
                  </div>
                </td>

                <td className="py-3.5 text-[#4A4A4A]">
                  <div className="flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#717171]" />
                    <span>
                      {booking.checkIn} &rarr; {booking.checkOut}
                    </span>
                  </div>
                </td>

                <td className="py-3.5 font-bold text-[#222222]">
                  ${booking.totalPrice?.toLocaleString()}
                </td>

                <td className="py-3.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EAF8ED] text-[#1E7E34] text-[10px] font-bold uppercase tracking-wider">
                    <Check className="w-3 h-3" />
                    <span>{booking.status}</span>
                  </span>
                </td>

                <td className="py-3.5 pr-2 text-right">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      booking.payoutStatus === "Paid"
                        ? "bg-[#F0FDF4] text-[#16A34A]"
                        : booking.payoutStatus === "Processing"
                        ? "bg-[#EFF6FF] text-[#2563EB]"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {booking.payoutStatus}
                  </span>
                </td>
              </tr>
            ))
          )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingsTab;
