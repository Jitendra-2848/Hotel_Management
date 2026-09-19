import React from "react";
import { Link } from "react-router-dom";
import { Search, Bell, Plus, ChevronDown } from "lucide-react";

interface AdminHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  pendingCount: number;
  onToggleNotification: () => void;
  onOpenAddRoomModal: () => void;
  hostName: string;
  hostEmail: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  searchQuery,
  onSearchChange,
  pendingCount,
  onToggleNotification,
  onOpenAddRoomModal,
  hostName,
  hostEmail,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#EBEBEB] px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
      {/* Left: Brand Identity */}
      <div className="flex items-center gap-3 shrink-0">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[#FF385C] text-white flex items-center justify-center font-black text-base shadow-xs group-hover:opacity-90 transition">
            CH
          </div>
          <div className="hidden sm:block">
            <span className="font-syne font-extrabold text-base tracking-tight text-[#222222] block leading-none">
              Marketplace
            </span>
            <span className="text-[10px] text-[#717171] font-medium tracking-wide">
              Host Sanctuary Portal
            </span>
          </div>
        </Link>
      </div>

      {/* Center: Global Marketplace Search Bar */}
      <div className="flex-1 max-w-xl mx-auto min-w-0">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-[#717171] absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by bookings, users, providers, suites..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F7F7F8] hover:bg-[#EFEFEF] focus:bg-white border border-[#E5E5E5] focus:border-[#222222] rounded-xl text-xs text-[#222222] placeholder:text-[#717171] focus:outline-none transition"
          />
        </div>
      </div>

      {/* Right: Notification & Admin User Profile */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onToggleNotification}
          className="relative p-2 rounded-xl border border-[#E5E5E5] hover:bg-[#F7F7F8] text-[#717171] hover:text-[#222222] transition cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          {pendingCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF385C] text-white text-[9px] font-bold flex items-center justify-center">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={onOpenAddRoomModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#222222] hover:bg-black text-white text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Suite</span>
        </button>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#EBEBEB]">
          <div className="w-8 h-8 rounded-full bg-[#222222] text-white flex items-center justify-center font-bold text-xs shrink-0">
            {hostName ? hostName.charAt(0).toUpperCase() : "H"}
          </div>
          <div className="hidden md:block text-left">
            <span className="block text-xs font-bold text-[#222222] truncate max-w-[130px]">
              {hostName}
            </span>
            <span className="block text-[10px] text-[#717171] leading-none truncate max-w-[130px]">
              {hostEmail}
            </span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-[#717171]" />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
