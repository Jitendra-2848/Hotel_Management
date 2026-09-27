import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, MapPin, Calendar as CalendarIcon, Users, Clock, CalendarDays, Plus, Minus, Check, X } from "lucide-react";
import Calendar, { CalendarActiveField } from "./Calendar";
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

  // Active Calendar field selection ('checkIn' or 'checkOut')
  const [calendarActiveField, setCalendarActiveField] = useState<CalendarActiveField>("checkIn");

  // Airbnb Granular Guest Breakdown
  const initialGuests = Number(searchParams.get("guests")) || 2;
  const [adults, setAdults] = useState<number>(Math.max(1, Math.min(initialGuests, 6)));
  const [children, setChildren] = useState<number>(Math.max(0, initialGuests - 2));
  const [infants, setInfants] = useState<number>(0);

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isGuestPickerOpen, setIsGuestPickerOpen] = useState(false);
  const [isDestinationOpen, setIsDestinationOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [destinationSearch, setDestinationSearch] = useState("");

  const calendarRef = useRef<HTMLDivElement>(null);
  const guestPickerRef = useRef<HTMLDivElement>(null);
  const destinationRef = useRef<HTMLDivElement>(null);

  const totalGuests = useMemo(() => adults + children, [adults, children]);

  const filteredDestinations = useMemo(() => {
    if (!destinationSearch.trim()) return DESTINATIONS;
    const q = destinationSearch.toLowerCase();
    return DESTINATIONS.filter(
      (d) => d.label.toLowerCase().includes(q) || d.country.toLowerCase().includes(q)
    );
  }, [destinationSearch]);

  const selectedDestination = useMemo(() => {
    return DESTINATIONS.find((d) => d.id === place) || DESTINATIONS[0];
  }, [place]);

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

  // Click outside listener for Calendar, Guest picker & Destination popover
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (destinationRef.current && !destinationRef.current.contains(e.target as Node)) {
        setIsDestinationOpen(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setIsCalendarOpen(false);
      }
      if (guestPickerRef.current && !guestPickerRef.current.contains(e.target as Node)) {
        setIsGuestPickerOpen(false);
      }
    };
    if (isCalendarOpen || isGuestPickerOpen || isDestinationOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCalendarOpen, isGuestPickerOpen, isDestinationOpen]);

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
      {/* 1. COMPACT MOBILE SEARCH PILL (< md: only takes 50px instead of 300px!) */}
      <div className="md:hidden">
        <div
          onClick={() => setIsMobileSearchOpen(true)}
          className="flex items-center justify-between p-2 pl-3 rounded-full bg-white border border-[#E2B4BD]/50 shadow-md cursor-pointer active:scale-98 transition"
        >
          <div className="flex items-center gap-2.5 min-w-0 flex-1 text-left">
            <div className="w-8 h-8 rounded-full bg-[#4A4A4A] text-white flex items-center justify-center shrink-0">
              <Search className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-[#4A4A4A] truncate">
                {selectedDestination.id === "all" ? "Any destination" : selectedDestination.label.split(",")[0]}
              </div>
              <div className="text-[10px] text-[#4A4A4A]/70 truncate">
                {checkIn ? `${checkIn.slice(5)} – ${checkOut ? checkOut.slice(5) : "out"}` : "Any dates"} • {totalGuests} {totalGuests === 1 ? "guest" : "guests"}
              </div>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-[#4A4A4A] px-3 py-1 rounded-full bg-[#F7D6D0]/40 border border-[#E2B4BD]/40 ml-2 shrink-0">
            Search
          </span>
        </div>

        {/* Full-screen Mobile Search Modal Drawer */}
        {isMobileSearchOpen && (
          <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200">
            <div className="flex-1" onClick={() => setIsMobileSearchOpen(false)} />
            <div className="bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto p-5 space-y-4 shadow-2xl border-t border-stone-200 animate-in slide-in-from-bottom duration-250">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-[#4A4A4A]" />
                  <h3 className="font-syne font-bold text-base text-[#4A4A4A]">Search Accommodations</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileSearchOpen(false)}
                  className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-[#4A4A4A] hover:bg-stone-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Where Destination */}
              <div className="space-y-1.5 text-left">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#4A4A4A] block">
                  Where to?
                </label>
                <MuiSelect
                  value={place}
                  onChange={(val) => setPlace(val)}
                  options={DESTINATIONS.map((d) => ({ value: d.id, label: d.label }))}
                  className="w-full"
                  size="small"
                />
              </div>

              {/* Check-in & Check-out Dates */}
              <div className="space-y-1.5 text-left">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#4A4A4A] block">
                  Dates
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl border border-stone-200 bg-stone-50/50">
                    <span className="text-[10px] font-bold uppercase text-stone-500 block mb-1">Check-in</span>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full text-xs font-semibold bg-transparent focus:outline-none"
                    />
                  </div>
                  <div className="p-2.5 rounded-xl border border-stone-200 bg-stone-50/50">
                    <span className="text-[10px] font-bold uppercase text-stone-500 block mb-1">Check-out</span>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full text-xs font-semibold bg-transparent focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Guests Selector */}
              <div className="p-3 rounded-xl border border-stone-200 bg-stone-50/50 flex items-center justify-between text-left">
                <div>
                  <span className="text-xs font-bold text-[#4A4A4A] block">Who's Coming?</span>
                  <span className="text-[11px] text-stone-500">{totalGuests} {totalGuests === 1 ? "guest" : "guests"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={adults <= 1}
                    onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
                    className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center text-stone-600 disabled:opacity-30"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold w-4 text-center">{adults}</span>
                  <button
                    type="button"
                    disabled={adults >= 10}
                    onClick={() => setAdults((prev) => prev + 1)}
                    className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center text-stone-600"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Search CTA */}
              <button
                type="button"
                onClick={(e) => {
                  setIsMobileSearchOpen(false);
                  handleSearchSubmit(e);
                }}
                className="w-full py-3 rounded-full bg-[#4A4A4A] hover:bg-[#2D2D2D] text-white text-xs font-semibold shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Search className="w-4 h-4" />
                <span>Search Stays</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. DESKTOP INLINE FORM (Hidden on mobile, flex on md+) */}
      <form
        onSubmit={handleSearchSubmit}
        className={`hidden md:flex bg-white rounded-full border border-[#E2B4BD]/50 shadow-lg p-2 sm:p-2.5 flex-row items-center divide-x divide-[#E2B4BD]/20 ${className}`}
      >
        {/* 1. Where / Destination (Searchable Popover Dropdown) */}
        <div
          ref={destinationRef}
          className="relative flex-1 px-3.5 py-1.5 text-left group min-w-0"
        >
          <button
            type="button"
            onClick={() => {
              setIsDestinationOpen(!isDestinationOpen);
              setIsCalendarOpen(false);
              setIsGuestPickerOpen(false);
            }}
            className="w-full text-left focus:outline-none cursor-pointer"
          >
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#4A4A4A] mb-0.5 flex items-center gap-1 cursor-pointer">
              <MapPin className="w-3 h-3 text-[#4A4A4A]" />
              <span>Where</span>
            </label>
            <div className="text-xs font-semibold text-[#4A4A4A] truncate">
              {selectedDestination.label}
            </div>
          </button>

          {/* Interactive Searchable Destination Dropdown */}
          {isDestinationOpen && (
            <div className="absolute top-full left-0 mt-3 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-[#E2B4BD]/50 p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Search Filter Input */}
              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 text-[#4A4A4A]/60 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Filter destinations (e.g. Zermatt, Aspen)..."
                  value={destinationSearch}
                  onChange={(e) => setDestinationSearch(e.target.value)}
                  className="w-full pl-8 pr-7 py-1.5 bg-[#FFF5F5] border border-[#E2B4BD]/50 rounded-xl text-xs text-[#4A4A4A] placeholder:text-[#4A4A4A]/40 focus:outline-none focus:border-[#4A4A4A]"
                />
                {destinationSearch && (
                  <button
                    type="button"
                    onClick={() => setDestinationSearch("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#4A4A4A]/60 hover:text-[#4A4A4A] cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Destination Items List */}
              <div className="max-h-60 overflow-y-auto space-y-0.5 scrollbar-thin">
                {filteredDestinations.length > 0 ? (
                  filteredDestinations.map((d) => {
                    const isSelected = d.id === place;
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => {
                          setPlace(d.id);
                          setIsDestinationOpen(false);
                          setDestinationSearch("");
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs text-left transition cursor-pointer ${
                          isSelected
                            ? "bg-[#4A4A4A] text-white font-semibold"
                            : "hover:bg-[#FFF5F5] text-[#4A4A4A]"
                        }`}
                      >
                        <div className="truncate flex-1 pr-2">
                          <div className="truncate font-medium">{d.label}</div>
                          <div className={`text-[10px] ${isSelected ? "text-white/70" : "text-[#4A4A4A]/50"}`}>
                            {d.country}
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })
                ) : (
                  <div className="py-4 text-center text-xs text-[#4A4A4A]/60">
                    No destinations match "{destinationSearch}"
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 2. Interactive Calendar Date Triggers (Check-in & Check-out) */}
        <div className="flex-1 flex items-stretch divide-x divide-[#E2B4BD]/30">
          {/* Check-in Trigger */}
          <button
            type="button"
            onClick={() => {
              setCalendarActiveField("checkIn");
              setIsCalendarOpen(true);
              setIsGuestPickerOpen(false);
            }}
            className={`flex-1 px-3.5 py-2 sm:py-1.5 text-left transition-all rounded-xl md:rounded-none cursor-pointer focus:outline-none ${isCalendarOpen && calendarActiveField === "checkIn"
                ? "bg-[#F7D6D0]/50 shadow-inner ring-1 ring-[#4A4A4A]/30"
                : "hover:bg-[#F7D6D0]/30"
              }`}
          >
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#4A4A4A] mb-0.5 flex items-center gap-1 pointer-events-none">
                <CalendarIcon className="w-3 h-3 text-[#4A4A4A]" />
                <span>Check-in</span>
              </label>
              {isCalendarOpen && calendarActiveField === "checkIn" && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#4A4A4A] hidden sm:block" />
              )}
            </div>
            <div className="text-xs font-semibold text-[#4A4A4A] truncate">
              {checkIn || "Add date"}
            </div>
          </button>

          {/* Check-out Trigger */}
          <button
            type="button"
            onClick={() => {
              setCalendarActiveField("checkOut");
              setIsCalendarOpen(true);
              setIsGuestPickerOpen(false);
            }}
            className={`flex-1 px-3.5 py-2 sm:py-1.5 text-left transition-all rounded-xl md:rounded-none cursor-pointer focus:outline-none ${isCalendarOpen && calendarActiveField === "checkOut"
                ? "bg-[#F7D6D0]/50 shadow-inner ring-1 ring-[#4A4A4A]/30"
                : "hover:bg-[#F7D6D0]/30"
              }`}
          >
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#4A4A4A] mb-0.5 flex items-center gap-1 pointer-events-none">
                <CalendarDays className="w-3 h-3 text-[#4A4A4A]" />
                <span>Check-out</span>
              </label>
              {isCalendarOpen && calendarActiveField === "checkOut" && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#4A4A4A] hidden sm:block" />
              )}
            </div>
            <div className="text-xs font-semibold text-[#4A4A4A] truncate">
              {checkOut || "Add date"}
            </div>
          </button>
        </div>

        {/* 3. Who / Guests (Airbnb-Style Stepper Popover Trigger) */}
        <div
          ref={guestPickerRef}
          className="relative px-3.5 py-1.5 text-left flex items-center justify-between gap-3 min-w-0 md:min-w-[190px]"
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
            <div className="absolute top-full right-0 mt-3 w-72 max-w-[calc(100vw-2.5rem)] bg-white rounded-2xl shadow-2xl border border-[#E2B4BD]/50 p-4 z-50 space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-200">
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
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 bg-black/40 backdrop-blur-xs md:bg-transparent md:backdrop-blur-none md:absolute md:inset-auto md:top-full md:left-1/2 md:-translate-x-1/2 md:mt-3 animate-in fade-in duration-200">
          <div
            ref={calendarRef}
            className="w-full max-w-sm shadow-2xl rounded-2xl overflow-hidden"
          >
            <Calendar
              value={{
                startDate: checkIn,
                endDate: checkOut,
              }}
              activeField={calendarActiveField}
              onActiveFieldChange={(field) => setCalendarActiveField(field)}
              onChange={(range) => {
                if (range.startDate !== undefined) setCheckIn(range.startDate || "");
                if (range.endDate !== undefined) setCheckOut(range.endDate || "");
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

