import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useLocation, Link } from "react-router-dom";
import Header from "../components/Header";
import RoomCard from "../components/RoomCard";
import SearchBar from "../components/SearchBar";
import MuiSelect from "../components/MuiSelect";
import { CURATED_ROOMS } from "../data/roomsData";
import { roomsApi } from "../lib/api";
import {
  Users,
  SlidersHorizontal,
  Mountain,
  Sparkles,
  Check,
  Calendar,
  MapPin,
  Heart,
  X,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { RoomCategory, ClassificationMeta } from "../lib/api";

export const CLASSIFICATIONS_DATA: Record<RoomCategory, ClassificationMeta> = {
  chalet: {
    id: "chalet",
    label: "Alpine Chalets",
    tagline: "Heavy timber frame, double-height A-frame glass, local river granite hearths",
    elevation: "1,900m – 2,100m",
    architecture: "Exposed Douglas Fir, Yakisugi Wood, Hand-cut River Stone",
    signatureFeature: "Private Heated Cedar Hot Tub & Wood-Burning Granite Fireplace",
    idealFor: "Skiers, winter families, alpine hearth lovers",
  },
  villa: {
    id: "villa",
    label: "Forest & Stream Villas",
    tagline: "Expansive multi-bedroom standalone estates with secluded riverside decks",
    elevation: "1,650m – 1,800m",
    architecture: "Low-slung Modern Timber, Floor-to-Ceiling Valley Glass",
    signatureFeature: "Riverside Deck, Outdoor Chef Kitchen & Infinity Plunge Spa",
    idealFor: "Large groups, multi-gen families, extended retreats",
  },
  penthouse: {
    id: "penthouse",
    label: "Summit Penthouses",
    tagline: "Panoramic 270°–360° summit views perched high above the cloudline",
    elevation: "2,700m – 2,950m",
    architecture: "Brutalist Concrete, Bleached White Oak, Cantilevered Steel",
    signatureFeature: "Finnish Dry Cedar Sauna & Celestron Stargazing Telescope",
    idealFor: "Couples, honeymooners, panoramic summit seekers",
  },
  loft: {
    id: "loft",
    label: "Artisan Lofts",
    tagline: "Blackened industrial steel, vaulted douglas fir ceilings & mezzanine bedroom lofts",
    elevation: "2,050m – 2,200m",
    architecture: "Structural Blackened Steel, Cathedral Beams, Oak Millwork",
    signatureFeature: "Curated Vinyl Record Lounge, Ergonomic Workstation & Terrazzo Bath",
    idealFor: "Design connoisseurs, solo creatives, urban escapes",
  },
  dome: {
    id: "dome",
    label: "Celestial Eco-Domes",
    tagline: "Geodesic architectural glass canopy with zero-carbon footprint",
    elevation: "2,350m – 2,500m",
    architecture: "Geodesic Glass Hemisphere, Heated Basalt Slate, Minimal Impact",
    signatureFeature: "360° Dark-Sky Glass Canopy & Outdoor Wood-Fired Cedar Barrel Tub",
    idealFor: "Romantic stargazers, astrophotographers, eco-luxury seekers",
  },
};

const CATEGORIES: { id: string; label: string }[] = [
  { id: "all", label: "All Suites" },
  { id: "chalet", label: "Alpine Chalets" },
  { id: "penthouse", label: "Summit Penthouses" },
  { id: "villa", label: "Forest Villas" },
  { id: "loft", label: "Artisan Lofts" },
  { id: "dome", label: "Celestial Domes" },
];

export const Rooms: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  // Read URL query parameters
  const paramPlace = searchParams.get("place") || "";
  const paramCheckIn = searchParams.get("checkIn") || "";
  const paramCheckOut = searchParams.get("checkOut") || "";
  const paramGuests = searchParams.get("guests") || "all";
  const paramCategory = searchParams.get("category") || "all";
  const paramSort = searchParams.get("sort") || "curated";

  // Directional slide state
  const [slideDirection, setSlideDirection] = useState<"right" | "left" | null>(null);
  const [animKey, setAnimKey] = useState<number>(0);

  // Wishlist set
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const isWishlistFilterActive = location.hash === "#wishlist";

  // Advanced Airbnb Filter Modal State
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterMaxPrice, setFilterMaxPrice] = useState<number>(1000);
  const [filterMinBedrooms, setFilterMinBedrooms] = useState<number>(0);
  const [filterAmenities, setFilterAmenities] = useState<string[]>([]);

  // Calculate stay nights from search dates
  const stayNights = useMemo(() => {
    if (!paramCheckIn || !paramCheckOut) return 2;
    const d1 = new Date(paramCheckIn);
    const d2 = new Date(paramCheckOut);
    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }, [paramCheckIn, paramCheckOut]);

  // Database Rooms State
  const [rooms, setRooms] = useState<any[]>(CURATED_ROOMS);

  useEffect(() => {
    roomsApi.getAll().then((data) => {
      if (data && data.length > 0) {
        setRooms(
          data.map((r) => ({
            ...r,
            locationTitle: `${r.category.charAt(0).toUpperCase() + r.category.slice(1)} • ${r.elevation || "Alpine Reserve"}`,
            image: r.featuredImage || (r.gallery && r.gallery[0]) || "",
            nightsText: `for ${stayNights} nights`,
          }))
        );
      }
    });
  }, [stayNights]);

  useEffect(() => {
    const updateWishlist = () => {
      try {
        const saved = localStorage.getItem("chs_wishlist");
        if (saved) setWishlistIds(JSON.parse(saved));
      } catch {
        // ignore
      }
    };
    updateWishlist();
    window.addEventListener("wishlist-updated", updateWishlist);
    return () => window.removeEventListener("wishlist-updated", updateWishlist);
  }, []);

  // Handle category change with directional animation
  const handleSelectCategory = (newCat: string) => {
    const prevIdx = CATEGORIES.findIndex((c) => c.id === paramCategory);
    const newIdx = CATEGORIES.findIndex((c) => c.id === newCat);
    if (newIdx !== -1 && prevIdx !== -1 && newIdx !== prevIdx) {
      const dir = newIdx > prevIdx ? "right" : "left";
      setSlideDirection(dir);
      setAnimKey((prev) => prev + 1);
    }

    const nextParams = new URLSearchParams(searchParams);
    if (newCat === "all") {
      nextParams.delete("category");
    } else {
      nextParams.set("category", newCat);
    }
    setSearchParams(nextParams, { replace: true });
  };

  const handleGuestFilterChange = (guestVal: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (guestVal === "all") {
      nextParams.delete("guests");
    } else {
      nextParams.set("guests", guestVal);
    }
    setSearchParams(nextParams, { replace: true });
  };

  const handleSortChange = (sortVal: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (sortVal === "curated") {
      nextParams.delete("sort");
    } else {
      nextParams.set("sort", sortVal);
    }
    setSearchParams(nextParams, { replace: true });
  };

  const handleClearFilters = () => {
    setSearchParams({}, { replace: true });
    setFilterMaxPrice(1000);
    setFilterMinBedrooms(0);
    setFilterAmenities([]);
    if (window.location.hash) {
      window.location.hash = "";
    }
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterMaxPrice < 1000) count++;
    if (filterMinBedrooms > 0) count++;
    if (filterAmenities.length > 0) count += filterAmenities.length;
    return count;
  }, [filterMaxPrice, filterMinBedrooms, filterAmenities]);

  // Filtered & Sorted Rooms
  const filteredRooms = useMemo(() => {
    let list = [...rooms];

    // Wishlist hash filter
    if (isWishlistFilterActive) {
      list = list.filter((r) => wishlistIds.includes(r.id));
    }

    // Place filter
    if (paramPlace) {
      const q = paramPlace.toLowerCase();
      list = list.filter(
        (r) =>
          r.locationTitle.toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (paramCategory !== "all") {
      list = list.filter((r) => r.category === paramCategory);
    }

    // Guest capacity filter
    if (paramGuests === "couples" || paramGuests === "2") {
      list = list.filter((r) => r.guests <= 2);
    } else if (paramGuests === "family" || paramGuests === "4") {
      list = list.filter((r) => r.guests >= 3 && r.guests <= 4);
    } else if (paramGuests === "group" || paramGuests === "6" || paramGuests === "8") {
      list = list.filter((r) => r.guests >= 5);
    } else if (!isNaN(Number(paramGuests)) && Number(paramGuests) > 0) {
      list = list.filter((r) => r.guests >= Number(paramGuests));
    }

    // Modal filters (price, bedrooms, amenities)
    if (filterMaxPrice < 1000) {
      list = list.filter((r) => r.price <= filterMaxPrice);
    }
    if (filterMinBedrooms > 0) {
      list = list.filter((r) => r.bedrooms >= filterMinBedrooms);
    }
    if (filterAmenities.length > 0) {
      list = list.filter((r) => {
        const roomAms = (r.amenities || []).flatMap((a: any) => a.items).join(" ").toLowerCase();
        return filterAmenities.every((fa) => roomAms.includes(fa.toLowerCase()));
      });
    }

    // Sorting
    if (paramSort === "price_asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (paramSort === "price_desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (paramSort === "rating_desc") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (paramSort === "size_desc") {
      list.sort((a, b) => {
        const sA = parseInt(a.size.replace(/[^0-9]/g, ""), 10) || 0;
        const sB = parseInt(b.size.replace(/[^0-9]/g, ""), 10) || 0;
        return sB - sA;
      });
    }

    return list;
  }, [
    isWishlistFilterActive,
    wishlistIds,
    paramPlace,
    paramCategory,
    paramGuests,
    paramSort,
    filterMaxPrice,
    filterMinBedrooms,
    filterAmenities,
  ]);

  const activeMeta =
    paramCategory !== "all" ? CLASSIFICATIONS_DATA[paramCategory as RoomCategory] : null;

  const hasActiveFilters =
    Boolean(paramPlace) ||
    Boolean(paramCheckIn) ||
    Boolean(paramCheckOut) ||
    paramGuests !== "all" ||
    paramCategory !== "all" ||
    isWishlistFilterActive ||
    activeFilterCount > 0;

  return (
    <div className="min-h-screen bg-[#FFF5F5] text-[#4A4A4A] font-sans selection:bg-[#4A4A4A] selection:text-white flex flex-col justify-between pb-28 md:pb-12">
      <Header />

      <main className="w-full px-3 sm:px-6 lg:px-10 py-5 sm:py-7 max-w-[1440px] mx-auto flex-1">
        {/* Top Floating Search Bar */}
        <div className="mb-6 sm:mb-8">
          <SearchBar />
        </div>

        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E2B4BD]/40 text-[#4A4A4A] text-[11px] font-bold uppercase tracking-wider mb-2 shadow-2xs">
            <Mountain className="w-3.5 h-3.5 text-[#4A4A4A]" />
            <span className="text-brand-charcoal">Crafters'Haven Reserve • {rooms.length} Accommodations</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#4A4A4A]">
            {isWishlistFilterActive ? "Your Wishlist & Saved Sanctuaries" : "Chalets & Mountain Sanctuaries"}
          </h1>

          <p className="text-[#4A4A4A]/75 text-xs sm:text-sm mt-1.5 leading-relaxed">
            {isWishlistFilterActive
              ? "All your handpicked alpine sanctuaries stored locally on your device."
              : "Browse our curated high-altitude chalets, villas, penthouses, and stargazing domes."}
          </p>

          {/* Active Search Summary Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
              {paramPlace && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#E2B4BD]/40 text-[#4A4A4A] text-xs font-medium shadow-2xs">
                  <MapPin className="w-3 h-3 text-[#4A4A4A]" />
                  <span className="text-brand-charcoal">Region: {paramPlace}</span>
                </span>
              )}
              {paramCheckIn && paramCheckOut && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#E2B4BD]/40 text-[#4A4A4A] text-xs font-medium shadow-2xs">
                  <Calendar className="w-3 h-3 text-[#4A4A4A]" />
                  <span className="text-brand-charcoal">
                    {stayNights} {stayNights === 1 ? "night" : "nights"} ({paramCheckIn} → {paramCheckOut})
                  </span>
                </span>
              )}
              {paramGuests !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#E2B4BD]/40 text-[#4A4A4A] text-xs font-medium shadow-2xs">
                  <Users className="w-3 h-3 text-[#4A4A4A]" />
                  <span className="text-brand-charcoal">Guests: {paramGuests}</span>
                </span>
              )}
              {isWishlistFilterActive && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F7D6D0] border border-[#E2B4BD] text-[#4A4A4A] text-xs font-semibold shadow-2xs">
                  <Heart className="w-3 h-3 fill-[#E2B4BD] text-[#4A4A4A]" />
                  <span className="text-brand-charcoal">Wishlist Filter Active</span>
                </span>
              )}

              <button
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white hover:bg-[#F7D6D0]/30 text-[#4A4A4A] text-xs font-medium border border-[#E2B4BD]/40 transition cursor-pointer shadow-2xs"
              >
                <X className="w-3 h-3" />
                <span className="">Reset Filters</span>
              </button>
            </div>
          )}

          {/* Directional Classification Navigation Tabs */}
          <div className="relative flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-5">
            {CATEGORIES.map((tab) => {
              const isActive = paramCategory === tab.id;
              const count =
                tab.id === "all"
                  ? rooms.length
                  : rooms.filter((r) => r.category === tab.id).length;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectCategory(tab.id)}
                  className={`relative px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer active:scale-95 flex items-center gap-1.5 ${isActive
                    ? `bg-[#4A4A4A] text-brand-white shadow-xs scale-105 ${slideDirection === "right"
                      ? "animate-tab-right"
                      : slideDirection === "left"
                        ? "animate-tab-left"
                        : ""
                    }`
                    : "bg-white text-[#4A4A4A] hover:bg-[#F7D6D0]/30 border border-[#E2B4BD]/40 shadow-2xs"
                    }`}
                >
                  <span className="">{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? "bg-white/20 text-brand-white" : "bg-[#F7D6D0]/40 text-[#4A4A4A]"
                      }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Directional Flow Indicator Helper */}
          {slideDirection && (
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#4A4A4A]/60 mt-2 transition-opacity">
              {slideDirection === "right" ? (
                <>
                  <span className="text-brand-charcoal">Flowing to next category</span>
                  <ArrowRight className="w-3 h-3 text-[#4A4A4A] animate-pulse" />
                </>
              ) : (
                <>
                  <ArrowLeft className="w-3 h-3 text-[#4A4A4A] animate-pulse" />
                  <span className="text-brand-charcoal">Flowing to previous category</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Dynamic Editorial Classification Spotlight Banner (Directional Flow) */}
        {activeMeta && (
          <div
            key={`banner-${animKey}`}
            className={`mb-6 p-4 sm:p-5 rounded-2xl bg-white border border-[#E2B4BD]/40 shadow-xs ${slideDirection === "right"
              ? "animate-flow-right"
              : slideDirection === "left"
                ? "animate-flow-left"
                : "animate-in fade-in duration-300"
              }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#E2B4BD]/20 pb-3 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#4A4A4A] text-white font-bold text-[10px] uppercase tracking-wider">
                    {activeMeta.label}
                  </span>
                  <span className="text-xs font-medium text-[#4A4A4A]/70">Elevation: {activeMeta.elevation}</span>
                </div>
                <h2 className="text-sm sm:text-base font-bold text-[#4A4A4A] tracking-tight mt-1">
                  {activeMeta.tagline}
                </h2>
              </div>
              <div className="text-left md:text-right text-xs">
                <span className="text-[10px] text-[#4A4A4A]/60 uppercase font-semibold tracking-wider block">
                  Ideal Experience
                </span>
                <span className="font-semibold text-[#4A4A4A]">{activeMeta.idealFor}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#4A4A4A]/80">
              <div className="flex items-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#4A4A4A] shrink-0 mt-0.5" />
                <span className="text-brand-charcoal">
                  <strong className="text-[#4A4A4A] font-semibold">Architecture:</strong> {activeMeta.architecture}
                </span>
              </div>
              <div className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#4A4A4A] shrink-0 mt-0.5" />
                <span className="text-brand-charcoal">
                  <strong className="text-[#4A4A4A] font-semibold">Inclusion:</strong> {activeMeta.signatureFeature}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Filter & Sort Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-5 pb-3 border-b border-[#E2B4BD]/30">
          {/* Guest Capacity Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
            <span className="text-[#4A4A4A]/70 font-medium text-[11px] mr-1 flex items-center gap-1 shrink-0">
              <Users className="w-3.5 h-3.5 text-[#4A4A4A]" />
              <span className="text-brand-charcoal">Guests:</span>
            </span>
            {[
              { id: "all", label: "All Sizes" },
              { id: "couples", label: "Couples (1-2)" },
              { id: "family", label: "Families (3-4)" },
              { id: "group", label: "Groups (5+)" },
            ].map((pill) => (
              <button
                key={pill.id}
                onClick={() => handleGuestFilterChange(pill.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer active:scale-95 whitespace-nowrap ${paramGuests === pill.id
                  ? "bg-[#4A4A4A] text-white shadow-xs"
                  : "bg-white text-[#4A4A4A] border border-[#E2B4BD]/40 hover:bg-[#F7D6D0]/30 shadow-2xs"
                  }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown, Airbnb Filter Button & Count */}
          <div className="flex items-center justify-between sm:justify-end gap-2.5 text-xs">
            {/* Airbnb Filter Trigger Button */}
            <button
              type="button"
              onClick={() => setIsFilterModalOpen(true)}
              className={`px-3.5 py-2 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer active:scale-95 shadow-2xs ${activeFilterCount > 0
                ? "bg-[#4A4A4A] text-white border-[#4A4A4A]"
                : "bg-white text-[#4A4A4A] border-[#E2B4BD]/40 hover:bg-[#F7D6D0]/30"
                }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="text-brand-charcoal">Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-white text-[#4A4A4A] text-[10px] font-bold flex items-center justify-center ml-0.5">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div className="flex items-center gap-1.5 min-w-[150px]">
              <MuiSelect
                value={paramSort}
                onChange={(val: any) => handleSortChange(val)}
                options={[
                  { value: "curated", label: "Curated Order" },
                  { value: "price_asc", label: "Price: Low to High" },
                  { value: "price_desc", label: "Price: High to Low" },
                  { value: "rating_desc", label: "Highest Rated" },
                  { value: "size_desc", label: "Largest Living Space" },
                ]}
                className="w-full"
              />
            </div>

            <span className="text-[#4A4A4A]/70 text-xs shrink-0 hidden sm:inline">
              {filteredRooms.length} {filteredRooms.length === 1 ? "stay" : "stays"}
            </span>
          </div>
        </div>

        {/* Room Card Grid with Strict Bounded Overflow & Directional Transition */}
        {filteredRooms.length > 0 ? (
          <div
            key={`grid-${animKey}`}
            className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4.5 w-full max-w-full min-w-0 ${slideDirection === "right"
              ? "animate-flow-right"
              : slideDirection === "left"
                ? "animate-flow-left"
                : ""
              }`}
          >
            {filteredRooms.map((room) => {
              const totalPrice = room.price * stayNights;
              const nightsText =
                stayNights === 1 ? "for 1 night" : `for ${stayNights} nights`;

              return (
                <div key={room.id} className="min-w-0 w-full overflow-hidden">
                  <RoomCard
                    room={{
                      ...room,
                      totalPrice,
                      nightsText,
                    }}
                    className="w-full min-w-0 max-w-full"
                    imgHeightClass="h-36 sm:h-40 lg:h-44"
                    showAvailabilityBadge={Boolean(paramCheckIn && paramCheckOut)}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-white rounded-2xl border border-[#E2B4BD]/40">
            <Mountain className="w-10 h-10 text-[#4A4A4A] mx-auto mb-3 stroke-[1.5]" />
            <h3 className="font-bold text-lg text-[#4A4A4A] tracking-tight">
              No matching sanctuaries found
            </h3>
            <p className="text-[#4A4A4A]/70 text-xs mt-1 max-w-sm mx-auto">
              We couldn't find any sanctuaries matching your chosen criteria. Try adjusting dates, region, or guest size.
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-4 px-4 py-2 bg-[#4A4A4A] hover:bg-[#2D2D2D] text-white rounded-full text-xs font-semibold transition cursor-pointer shadow-xs"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Direct Concierge Contact Strip */}
        <div className="mt-12 p-6 rounded-2xl bg-white text-[#4A4A4A] border border-[#E2B4BD]/40 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div>
            <h4 className="font-bold text-[#4A4A4A] text-sm">Looking for bespoke chalet arrangements?</h4>
            <p className="text-[#4A4A4A]/70 text-xs mt-0.5">
              Contact our front desk concierge directly for personalized itineraries and helicopter transfers.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/about"
              className="px-4 py-2 rounded-full bg-[#4A4A4A] hover:bg-[#2D2D2D] text-white font-semibold text-xs transition cursor-pointer active:scale-95 shadow-xs"
            >
              Concierge Desk & Inquiries
            </Link>
          </div>
        </div>
        {/* Airbnb Advanced Filter Modal */}
        {isFilterModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-[70] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-7 space-y-6 shadow-2xl border border-[#E2B4BD]/40">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#E2B4BD]/30 pb-3.5">
                <h3 className="font-syne text-lg font-bold text-[#4A4A4A]">Filters</h3>
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="w-8 h-8 rounded-full border border-[#E2B4BD]/40 flex items-center justify-center text-[#4A4A4A] hover:bg-[#F7D6D0]/30 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Price Range Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#4A4A4A]">Max Price per Night</span>
                  <span className="font-bold text-[#4A4A4A] text-sm">${filterMaxPrice}</span>
                </div>
                <input
                  type="range"
                  min={250}
                  max={1000}
                  step={25}
                  value={filterMaxPrice}
                  onChange={(e) => setFilterMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#4A4A4A] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#4A4A4A]/60 font-medium">
                  <span className="text-brand-charcoal">$250/n</span>
                  <span className="text-brand-charcoal">$600/n</span>
                  <span className="text-brand-charcoal">$1,000+/n</span>
                </div>
              </div>

              {/* Bedrooms Stepper */}
              <div className="space-y-2 pt-2 border-t border-[#E2B4BD]/20">
                <span className="block font-bold text-xs text-[#4A4A4A]">Bedrooms</span>
                <div className="flex items-center gap-2">
                  {[
                    { id: 0, label: "Any" },
                    { id: 1, label: "1" },
                    { id: 2, label: "2" },
                    { id: 3, label: "3" },
                    { id: 4, label: "4+" },
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      type="button"
                      onClick={() => setFilterMinBedrooms(btn.id)}
                      className={`flex-1 py-1.5 rounded-full border text-xs font-semibold transition cursor-pointer active:scale-95 ${filterMinBedrooms === btn.id
                        ? "bg-[#4A4A4A] text-white border-[#4A4A4A]"
                        : "bg-white text-[#4A4A4A] border-[#E2B4BD]/40 hover:bg-[#F7D6D0]/30"
                        }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Standout Amenities Checkboxes */}
              <div className="space-y-2 pt-2 border-t border-[#E2B4BD]/20">
                <span className="block font-bold text-xs text-[#4A4A4A]">Standout Amenities</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "hot tub", label: "Private Hot Tub" },
                    { id: "sauna", label: "Finnish Sauna" },
                    { id: "fireplace", label: "Stone Fireplace" },
                    { id: "glass", label: "Panoramic Glass" },
                    { id: "deck", label: "Alpine Deck" },
                    { id: "wifi", label: "Fast Wi-Fi" },
                  ].map((amenity) => {
                    const isChecked = filterAmenities.includes(amenity.id);
                    return (
                      <button
                        key={amenity.id}
                        type="button"
                        onClick={() => {
                          setFilterAmenities((prev) =>
                            isChecked ? prev.filter((i) => i !== amenity.id) : [...prev, amenity.id]
                          );
                        }}
                        className={`px-3 py-2 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition cursor-pointer active:scale-95 ${isChecked
                          ? "border-[#4A4A4A] bg-[#F7D6D0]/30 text-[#4A4A4A] font-semibold"
                          : "border-[#E2B4BD]/30 bg-white text-[#4A4A4A]/80 hover:bg-[#FFF5F5]"
                          }`}
                      >
                        <span className="text-brand-charcoal">{amenity.label}</span>
                        {isChecked && <Check className="w-3.5 h-3.5 text-[#4A4A4A]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-[#E2B4BD]/30">
                <button
                  type="button"
                  onClick={() => {
                    setFilterMaxPrice(1000);
                    setFilterMinBedrooms(0);
                    setFilterAmenities([]);
                  }}
                  className="text-xs font-semibold text-[#4A4A4A] underline cursor-pointer hover:text-brand-charcoal"
                >
                  Clear all
                </button>
                <button
                  type="button"
                  onClick={() => setIsFilterModalOpen(false)}
                  className="px-5 py-2 rounded-full bg-[#4A4A4A] hover:bg-[#2D2D2D] text-white text-xs font-semibold shadow-md transition cursor-pointer active:scale-95"
                >
                  Show {filteredRooms.length} {filteredRooms.length === 1 ? "stay" : "stays"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Rooms;