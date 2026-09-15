import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, MapPin, Calendar as CalendarIcon, Users, Clock, CalendarDays } from "lucide-react";
import Calendar from "./Calendar";
import MuiSelect from "./MuiSelect";

interface SearchBarProps {
  className?: string;
  onSearch?: (params: { place: string; checkIn: string; checkOut: string; guests: number }) => void;
}

export const REGIONS = [
  { id: "all", label: "All Regions & Valleys" },
  { id: "Crested Ridge", label: "Crested Ridge (Alpine Pines)" },
  { id: "Glacier Peak", label: "Glacier Peak (Summit Ridge)" },
  { id: "Silver Creek", label: "Silver Creek (Riverside Meadows)" },
  { id: "Starlight Basin", label: "Starlight Basin (Dark-Sky Valley)" },
  { id: "High Village", label: "High Village (Artisan Alley)" },
];

export const SearchBar: React.FC<SearchBarProps> = ({ className = "", onSearch }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultCheckIn = tomorrow.toISOString().split("T")[0];

  const threeDaysLater = new Date();
  threeDaysLater.setDate(threeDaysLater.getDate() + 4);
  const defaultCheckOut = threeDaysLater.toISOString().split("T")[0];

  const [place, setPlace] = useState<string>(searchParams.get("place") || "all");
  const [checkIn, setCheckIn] = useState<string>(searchParams.get("checkIn") || defaultCheckIn);
  const [checkOut, setCheckOut] = useState<string>(searchParams.get("checkOut") || defaultCheckOut);
  const [guests, setGuests] = useState<number>(Number(searchParams.get("guests")) || 2);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const urlPlace = searchParams.get("place");
    const urlCheckIn = searchParams.get("checkIn");
    const urlCheckOut = searchParams.get("checkOut");
    const urlGuests = searchParams.get("guests");

    if (urlPlace) setPlace(urlPlace);
    if (urlCheckIn) setCheckIn(urlCheckIn);
    if (urlCheckOut) setCheckOut(urlCheckOut);
    if (urlGuests) setGuests(Number(urlGuests));
  }, [searchParams]);

  // Click outside to close calendar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setIsCalendarOpen(false);
      }
    };
    if (isCalendarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCalendarOpen]);

  // Calculate stay duration
  const calculateDuration = () => {
    if (!checkIn || !checkOut) return 2;
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diffDays = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const durationNights = calculateDuration();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalendarOpen(false);

    if (onSearch) {
      onSearch({ place, checkIn, checkOut, guests });
    } else {
      const params = new URLSearchParams();
      if (place && place !== "all") params.set("place", place);
      if (checkIn) params.set("checkIn", checkIn);
      if (checkOut) params.set("checkOut", checkOut);
      if (guests) params.set("guests", String(guests));

      const existingCat = searchParams.get("category");
      if (existingCat) params.set("category", existingCat);

      navigate(`/rooms?${params.toString()}`);
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <form
        onSubmit={handleSearchSubmit}
        className={`bg-white rounded-2xl sm:rounded-full border border-[#E2B4BD]/50 shadow-lg p-2 sm:p-2.5 flex flex-col md:flex-row items-stretch md:items-center divide-y md:divide-y-0 md:divide-x divide-[#E2B4BD]/20 ${className}`}
      >
        {/* 1. Where / Destination (MUI Select) */}
        <div className="flex-1 px-3.5 py-1.5 text-left group">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#4A4A4A] mb-0.5 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#4A4A4A]" />
            <span>Where</span>
          </label>
          <MuiSelect
            value={place}
            onChange={(val) => setPlace(val)}
            options={REGIONS.map((r) => ({ value: r.id, label: r.label }))}
            className="w-full"
          />
        </div>

        {/* 2. Interactive Calendar Date Trigger (Check-in & Check-out) */}
        <div
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          className="flex-1 px-3.5 py-2 sm:py-1 text-left flex items-center justify-between gap-2 cursor-pointer hover:bg-[#F7D6D0]/30 rounded-xl md:rounded-none transition"
        >
          <div className="flex-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#4A4A4A] mb-0.5 flex items-center gap-1 pointer-events-none">
              <CalendarIcon className="w-3 h-3 text-[#4A4A4A]" />
              <span>Check-in</span>
            </label>
            <div className="text-xs font-semibold text-[#4A4A4A] truncate">
              {checkIn || "Add date"}
            </div>
          </div>

          <div className="flex-1 border-l border-[#E2B4BD]/20 pl-2">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#4A4A4A] mb-0.5 flex items-center gap-1 pointer-events-none">
              <CalendarDays className="w-3 h-3 text-[#4A4A4A]" />
              <span>Check-out</span>
            </label>
            <div className="text-xs font-semibold text-[#4A4A4A] truncate">
              {checkOut || "Add date"}
            </div>
          </div>
        </div>

        {/* 3. Who / Guests (MUI Select) & Duration Pill */}
        <div className="px-3.5 py-1.5 text-left flex items-center justify-between gap-3 min-w-[170px]">
          <div className="flex-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#4A4A4A] mb-0.5 flex items-center gap-1">
              <Users className="w-3 h-3 text-[#4A4A4A]" />
              <span>Guests</span>
            </label>
            <MuiSelect
              value={guests}
              onChange={(val) => setGuests(Number(val))}
              options={[
                { value: 1, label: "1 Guest" },
                { value: 2, label: "2 Guests" },
                { value: 4, label: "4 Guests" },
                { value: 6, label: "6 Guests" },
                { value: 8, label: "8+ Guests" },
              ]}
              className="w-full"
            />
          </div>

          {/* Live Duration Indicator Pill */}
          <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF5F5] border border-[#E2B4BD]/40 text-[#4A4A4A] text-[10px] font-semibold whitespace-nowrap">
            <Clock className="w-3 h-3 text-[#4A4A4A]" />
            <span>{durationNights} night{durationNights > 1 ? "s" : ""}</span>
          </div>
        </div>

        {/* 4. Search Trigger Button */}
        <div className="p-1 sm:p-1.5 flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 sm:py-3 rounded-full bg-[#4A4A4A] hover:bg-[#2D2D2D] text-white font-semibold text-xs transition-all duration-200 cursor-pointer active:scale-95 flex items-center justify-center gap-1.5 shadow-md shadow-[#4A4A4A]/20"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
        </div>
      </form>

      {/* Floating Calendar Popover */}
      {isCalendarOpen && (
        <div
          ref={calendarRef}
          className="absolute top-full left-0 right-0 mt-3 z-50 flex justify-center animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="w-full max-w-sm shadow-2xl rounded-2xl overflow-hidden">
            <Calendar
              value={{
                startDate: checkIn,
                endDate: checkOut,
              }}
              onChange={(range) => {
                if (range.startDate) setCheckIn(range.startDate);
                if (range.endDate) setCheckOut(range.endDate);
              }}
              onClose={() => setIsCalendarOpen(false)}
              showApplyButton={true}
              label="Select Stay Dates"
            />
          </div>
        </div>
      )}
  </div>
);
};

export default SearchBar;
