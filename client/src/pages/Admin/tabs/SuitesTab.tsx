import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, ExternalLink, Bed, Users, Filter, CheckCircle2, AlertTriangle } from "lucide-react";
import { Room } from "../../../lib/api";

interface SuitesTabProps {
  rooms: Room[];
  onToggleStatus: (id: string, currentStatus?: string) => Promise<void>;
  onOpenAddRoomModal: () => void;
  searchQuery?: string;
}

export const SuitesTab: React.FC<SuitesTabProps> = ({
  rooms,
  onToggleStatus,
  onOpenAddRoomModal,
  searchQuery = "",
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const filteredRooms = rooms.filter((r) => {
    if (selectedCategory !== "all" && r.category !== selectedCategory) return false;
    if (selectedStatus !== "all" && r.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = r.name.toLowerCase().includes(q);
      const matchTagline = r.tagline?.toLowerCase().includes(q);
      const matchCat = r.category.toLowerCase().includes(q);
      if (!matchName && !matchTagline && !matchCat) return false;
    }
    return true;
  });

  return (
    <div className="bg-white rounded-3xl border border-[#EBEBEB] p-6 shadow-xs space-y-6">
      {/* Top Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F2F2F2]">
        <div>
          <h2 className="text-base font-bold font-syne text-[#222222]">
            Hosted Sanctuaries Inventory ({filteredRooms.length})
          </h2>
          <p className="text-xs text-[#717171]">
            Manage status, availability, and live marketplace presentation for your luxury suites
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-[#E5E5E5] bg-white text-xs font-semibold text-[#4A4A4A] focus:outline-none cursor-pointer"
          >
            <option value="all">All Architecture</option>
            <option value="chalet">Alpine Chalets</option>
            <option value="villa">Mountain Villas</option>
            <option value="penthouse">Summit Penthouses</option>
            <option value="loft">Ski Lofts</option>
            <option value="dome">Stargazing Domes</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-[#E5E5E5] bg-white text-xs font-semibold text-[#4A4A4A] focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="maintenance">Maintenance</option>
          </select>

          <button
            type="button"
            onClick={onOpenAddRoomModal}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FF385C] hover:bg-[#E00B41] text-white text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Suite</span>
          </button>
        </div>
      </div>

      {/* Suites Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#F2F2F2] text-[11px] font-bold text-[#717171] uppercase tracking-wider">
              <th className="pb-3 pl-2">Suite / Architecture</th>
              <th className="pb-3">Nightly Rate</th>
              <th className="pb-3">Capacity & Layout</th>
              <th className="pb-3">Rating</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 pr-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F7F7F8] text-xs">
            {filteredRooms.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-xs text-[#717171]">
                  No sanctuaries match the selected filter criteria.
                </td>
              </tr>
            ) : (
              filteredRooms.map((room) => {
                const isMaintenance = room.status === "maintenance";
                return (
                  <tr key={room.id} className="hover:bg-[#FAFAFA] transition">
                    {/* Suite Name & Image */}
                    <td className="py-3.5 pl-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={room.featuredImage}
                          alt={room.name}
                          className="w-14 h-12 rounded-xl object-cover border border-[#EBEBEB] shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-[#222222] block leading-snug truncate max-w-xs">
                            {room.name}
                          </span>
                          <span className="text-[11px] text-[#717171] line-clamp-1">
                            {room.tagline || `${room.bedrooms} Bed • ${room.size}`}
                          </span>
                          <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded-md bg-[#F2F2F2] text-[#4A4A4A] text-[9px] uppercase font-bold tracking-wider">
                            {room.category}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Nightly Rate */}
                    <td className="py-3.5 font-bold text-[#222222]">
                      ${room.price}
                      <span className="text-[10px] text-[#717171] font-normal"> / night</span>
                    </td>

                    {/* Capacity & Specs */}
                    <td className="py-3.5 text-[#4A4A4A]">
                      <div className="flex items-center gap-1 text-[11px]">
                        <Users className="w-3.5 h-3.5 text-[#717171]" />
                        <span>Up to {room.guests} guests</span>
                      </div>
                      <div className="text-[10px] text-[#717171] mt-0.5">
                        {room.bedrooms} bed • {room.bathrooms} bath
                      </div>
                    </td>

                    {/* Rating */}
                    <td className="py-3.5">
                      <div className="flex items-center gap-1 font-bold text-[#222222]">
                        <span className="text-amber-500">★</span>
                        <span>{room.rating || 5.0}</span>
                      </div>
                      <span className="text-[10px] text-[#717171]">
                        ({room.reviewsCount || 1} reviews)
                      </span>
                    </td>

                    {/* Status Pill with Toggle */}
                    <td className="py-3.5">
                      <button
                        type="button"
                        onClick={() => onToggleStatus(room.id, room.status)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition cursor-pointer ${
                          isMaintenance
                            ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                            : "bg-[#EAF8ED] text-[#1E7E34] hover:bg-[#DDF3E2]"
                        }`}
                        title="Click to toggle status"
                      >
                        {isMaintenance ? (
                          <>
                            <AlertTriangle className="w-3 h-3" />
                            <span>Maintenance</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Active</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions: View Live Listing */}
                    <td className="py-3.5 pr-2 text-right">
                      <Link
                        to={`/rooms/${room.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-[#E5E5E5] hover:bg-[#F7F7F8] text-[#222222] font-semibold text-xs transition"
                      >
                        <span>View Live</span>
                        <ExternalLink className="w-3 h-3 text-[#717171]" />
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuitesTab;
