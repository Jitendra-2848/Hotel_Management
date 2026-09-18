import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, MapPin, Calendar as CalendarIcon, Users, Clock, CalendarDays, Plus, Minus, X } from "lucide-react";
import Calendar from "./Calendar";
import MuiSelect from "./MuiSelect";

interface SearchBarProps {
  className?: string;
  onSearch?: (params: { place: string; checkIn: string; checkOut: string; guests: number }) => void;
}

export interface DestinationItem {
  id: string;
  label: string;
  country: string;
}

export const DESTINATIONS: DestinationItem[] = [
  { id: "all", label: "All Destinations (Global Mountains)", country: "Global" },
  { id: "Zermatt, Switzerland", label: "🇨🇭 Zermatt, Switzerland (Matterhorn)", country: "Switzerland" },
  { id: "Grindelwald, Switzerland", label: "🇨🇭 Grindelwald & Lauterbrunnen, Switzerland", country: "Switzerland" },
  { id: "St. Moritz, Switzerland", label: "🇨🇭 St. Moritz, Switzerland (Engadin)", country: "Switzerland" },
  { id: "Chamonix, France", label: "🇫🇷 Chamonix Mont-Blanc, France", country: "France" },
  { id: "Cortina, Italy", label: "🇮🇹 Cortina d'Ampezzo, Italy (Dolomites)", country: "Italy" },
  { id: "Tyrol, Austria", label: "🇦🇹 Kitzbühel & Tyrol, Austria", country: "Austria" },
  { id: "Lofoten, Norway", label: "🇳🇴 Lofoten Islands, Norway", country: "Norway" },
  { id: "Tromso, Norway", label: "🇳🇴 Tromsø & Senja, Norway", country: "Norway" },
  { id: "Manali, India", label: "🇮🇳 Manali & Solang Valley, India", country: "India" },
  { id: "Gulmarg, India", label: "🇮🇳 Gulmarg Alpine Valley, India", country: "India" },
  { id: "Aspen, USA", label: "🇺🇸 Aspen & Snowmass, USA (Colorado)", country: "United States" },
  { id: "Banff, Canada", label: "🇨🇦 Banff & Lake Louise, Canada", country: "Canada" },
];

export const REGIONS = DESTINATIONS;

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

  // Airbnb Granular Guest Breakdown
  const initialGuests = Number(searchParams.get("guests")) || 2;
  const [adults, setAdults] = useState<number>(Math.max(1, Math.min(initialGuests, 6)));
  const [children, setChildren] = useState<number>(Math.max(0, initialGuests - 2));
  const [infants, setInfants] = useState<number>(0);

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isGuestPickerOpen, setIsGuestPickerOpen] = useState(false);

  const calendarRef = useRef<HTMLDivElement>(null);
  const guestPickerRef = useRef<HTMLDivElement>(null);

  const totalGuests = useMemo(() => adults + children, [adults, children]);

  useEffect(() => {
    const urlPlace = searchParams.get("place");
    const urlCheckIn = searchParams.get("checkIn");
    const urlCheckOut = searchParams.get("checkOut");
    const urlGuests = searchParams.get("guests");

    if (urlPlace) setPlace(urlPlace);
    if (urlCheckIn) setCheckIn(urlCheckIn);
    if (urlCheckOut) setCheckOut(urlCheckOut);
    if (urlGuests) {
      const g = Number(urlGuests);
      if (g >= 1) setAdults(Math.min(g, 6));
    }
  }, [searchParams]);

  // Click outside listener for Calendar & Guest picker
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setIsCalendarOpen(false);
      }
      if (guestPickerRef.current && !guestPickerRef.current.contains(e.target as Node)) {
        setIsGuestPickerOpen(false);
      }
    };
    if (isCalendarOpen || isGuestPickerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCalendarOpen, isGuestPickerOpen]);

  // Calculate stay duration
  const durationNights = useMemo(() => {
    if (!checkIn || !checkOut) return 2;
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diffDays = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }, [checkIn, checkOut]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalendarOpen(false);
    setIsGuestPickerOpen(false);

    if (onSearch) {
      onSearch({ place, checkIn, checkOut, guests: totalGuests });
    } else {
      const params = new URLSearchParams();
      if (place && place !== "all") params.set("place", place);
      if (checkIn) params.set("checkIn", checkIn);
      if (checkOut) params.set("checkOut", checkOut);
      if (totalGuests) params.set("guests", String(totalGuests));

      const existingCat = searchParams.get("category");
      if (existingCat) params.set("category", existingCat);

      navigate(`/rooms?${params.toString()}`);
    }
  };

  // Guest Summary String
  const guestLabel = useMemo(() => {
    const gText = `${totalGuests} guest${totalGuests > 1 ? "s" : ""}`;
    if (infants > 0) {
      return `${gText}, ${infants} infant${infants > 1 ? "s" : ""}`;
    }
    return gText;
  }, [totalGuests, infants]);

  return (
    <div className="relative w-full max-w-4xl mx-auto z-40">
      <form
        onSubmit={handleSearchSubmit}
        className={`bg-white rounded-2xl sm:rounded-full border border-[#E2B4BD]/50 shadow-lg p-2 sm:p-2.5 flex flex-col md:flex-row items-stretch md:items-center divide-y md:divide-y-0 md:divide-x divide-[#E2B4BD]/20 ${className}`}
      >
        {/* 1. Where / Destination (MUI Select) */}
        <div className="flex-1 px-3.5 py-1.5 text-left group min-w-0">
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

        {/* 2. Interactive Calendar Date Trigger */}
        <div
          onClick={() => {
            setIsCalendarOpen(!isCalendarOpen);
            setIsGuestPickerOpen(false);
          }}
          className="flex-1 px-3.5 py-2 sm:py-1 text-left flex items-center justify-between gap-2 cursor-pointer hover:bg-[#F7D6D0]/30 rounded-xl md:rounded-none transition"
        >
          <div className="flex-1 min-w-0">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#4A4A4A] mb-0.5 flex items-center gap-1 pointer-events-none">
              <CalendarIcon className="w-3 h-3 text-[#4A4A4A]" />
              <span>Check-in</span>
            </label>
            <div className="text-xs font-semibold text-[#4A4A4A] truncate">
              {checkIn || "Add date"}
            </div>
          </div>

          <div className="flex-1 border-l border-[#E2B4BD]/20 pl-2 min-w-0">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#4A4A4A] mb-0.5 flex items-center gap-1 pointer-events-none">
              <CalendarDays className="w-3 h-3 text-[#4A4A4A]" />
              <span>Check-out</span>
            </label>
            <div className="text-xs font-semibold text-[#4A4A4A] truncate">
              {checkOut || "Add date"}
            </div>
          </div>
        </div>

        {/* 3. Who / Guests (Airbnb-Style Stepper Popover Trigger) */}
        <div
          ref={guestPickerRef}
          className="relative px-3.5 py-1.5 text-left flex items-center justify-between gap-3 min-w-[190px]"
        >
          <div
            onClick={() => {
              setIsGuestPickerOpen(!isGuestPickerOpen);
              setIsCalendarOpen(false);
            }}
            className="flex-1 cursor-pointer hover:opacity-80 transition"
          >
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#4A4A4A] mb-0.5 flex items-center gap-1 cursor-pointer">
              <Users className="w-3 h-3 text-[#4A4A4A]" />
              <span>Who</span>
            </label>
            <div className="text-xs font-semibold text-[#4A4A4A] truncate">
              {guestLabel}
            </div>
          </div>

          {/* Live Duration Indicator Pill */}
          <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF5F5] border border-[#E2B4BD]/40 text-[#4A4A4A] text-[10px] font-semibold whitespace-nowrap">
            <Clock className="w-3 h-3 text-[#4A4A4A]" />
            <span>{durationNights} night{durationNights > 1 ? "s" : ""}</span>
          </div>

          {/* Airbnb Guest Breakdown Popover */}
          {isGuestPickerOpen && (
            <div className="absolute top-full right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-[#E2B4BD]/50 p-4 z-50 space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Adults */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#4A4A4A]">Adults</div>
                  <div className="text-[10px] text-[#4A4A4A]/60">Age 13 or above</div>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    disabled={adults <= 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      setAdults((a) => Math.max(1, a - 1));
                    }}
                    className="w-7 h-7 rounded-full border border-[#E2B4BD]/60 flex items-center justify-center text-[#4A4A4A] disabled:opacity-30 hover:bg-[#F7D6D0]/30 transition cursor-pointer active:scale-95 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold text-[#4A4A4A] w-4 text-center">{adults}</span>
                  <button
                    type="button"
                    disabled={adults >= 10}
                    onClick={(e) => {
                      e.stopPropagation();
                      setAdults((a) => Math.min(10, a + 1));
                    }}
                    className="w-7 h-7 rounded-full border border-[#E2B4BD]/60 flex items-center justify-center text-[#4A4A4A] disabled:opacity-30 hover:bg-[#F7D6D0]/30 transition cursor-pointer active:scale-95 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between pt-2 border-t border-[#E2B4BD]/20">
                <div>
                  <div className="text-xs font-bold text-[#4A4A4A]">Children</div>
                  <div className="text-[10px] text-[#4A4A4A]/60">Ages 2–12</div>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    disabled={children <= 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      setChildren((c) => Math.max(0, c - 1));
                    }}
                    className="w-7 h-7 rounded-full border border-[#E2B4BD]/60 flex items-center justify-center text-[#4A4A4A] disabled:opacity-30 hover:bg-[#F7D6D0]/30 transition cursor-pointer active:scale-95 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold text-[#4A4A4A] w-4 text-center">{children}</span>
                  <button
                    type="button"
                    disabled={children >= 6}
                    onClick={(e) => {
                      e.stopPropagation();
                      setChildren((c) => Math.min(6, c + 1));
                    }}
                    className="w-7 h-7 rounded-full border border-[#E2B4BD]/60 flex items-center justify-center text-[#4A4A4A] disabled:opacity-30 hover:bg-[#F7D6D0]/30 transition cursor-pointer active:scale-95 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Infants */}
              <div className="flex items-center justify-between pt-2 border-t border-[#E2B4BD]/20">
                <div>
                  <div className="text-xs font-bold text-[#4A4A4A]">Infants</div>
                  <div className="text-[10px] text-[#4A4A4A]/60">Under 2</div>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    disabled={infants <= 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      setInfants((i) => Math.max(0, i - 1));
                    }}
                    className="w-7 h-7 rounded-full border border-[#E2B4BD]/60 flex items-center justify-center text-[#4A4A4A] disabled:opacity-30 hover:bg-[#F7D6D0]/30 transition cursor-pointer active:scale-95 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold text-[#4A4A4A] w-4 text-center">{infants}</span>
                  <button
                    type="button"
                    disabled={infants >= 4}
                    onClick={(e) => {
                      e.stopPropagation();
                      setInfants((i) => Math.min(4, i + 1));
                    }}
                    className="w-7 h-7 rounded-full border border-[#E2B4BD]/60 flex items-center justify-center text-[#4A4A4A] disabled:opacity-30 hover:bg-[#F7D6D0]/30 transition cursor-pointer active:scale-95 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E2B4BD]/20 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsGuestPickerOpen(false)}
                  className="px-3 py-1 rounded-full bg-[#4A4A4A] text-brand-white text-[11px] font-semibold hover:bg-[#333333] cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 4. Search Trigger Button */}
        <div className="p-1 sm:p-1.5 flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 sm:py-3 rounded-full bg-[#4A4A4A] hover:bg-[#2D2D2D] text-brand-white font-semibold text-xs transition-all duration-200 cursor-pointer active:scale-95 flex items-center justify-center gap-1.5 shadow-md shadow-[#4A4A4A]/20"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
        </div>
      </form>

      {/* Floating Calendar Popover / Mobile Modal */}
      {isCalendarOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 bg-black/40 backdrop-blur-xs md:bg-transparent md:backdrop-blur-none md:absolute md:inset-auto md:top-full md:left-0 md:right-0 md:mt-3 animate-in fade-in duration-200">
          <div
            ref={calendarRef}
            className="w-full max-w-sm shadow-2xl rounded-2xl overflow-hidden"
          >
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

