import React, { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams, useLocation, Link } from "react-router-dom";
import Header from "../components/Header";
import RoomCard, { RoomCardSkeleton } from "../components/RoomCard";
import SearchBar from "../components/SearchBar";
import MuiSelect from "../components/MuiSelect";
import { CURATED_ROOMS } from "../data/roomsData";
import { roomsApi } from "../lib/api";
import { updateSEO } from "../util/seo";
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
  Star,
  Globe,
  ChevronDown,
  DollarSign,
  Bed,
} from "lucide-react";

export const CATEGORIES = [
  { id: "all", label: "All Suites" },
  { id: "chalet", label: "Alpine Chalets" },
  { id: "penthouse", label: "Summit Penthouses" },
  { id: "villa", label: "Forest Villas" },
  { id: "loft", label: "Artisan Lofts" },
  { id: "dome", label: "Celestial Domes" },
];

export const COUNTRIES = [
  { id: "all", label: "All Destinations" },
  { id: "switzerland", label: "🇨🇭 Switzerland", keywords: ["switzerland", "zermatt", "grindelwald", "moritz", "matterhorn", "alpine"] },
  { id: "france", label: "🇫🇷 France", keywords: ["france", "chamonix", "mont-blanc"] },
  { id: "italy", label: "🇮🇹 Italy", keywords: ["italy", "cortina", "dolomites"] },
  { id: "austria", label: "🇦🇹 Austria", keywords: ["austria", "tyrol", "kitzbühel"] },
  { id: "norway", label: "🇳🇴 Norway", keywords: ["norway", "lofoten", "tromso", "dome", "aurora"] },
  { id: "india", label: "🇮🇳 India", keywords: ["india", "manali", "gulmarg", "solang"] },
  { id: "usa", label: "🇺🇸 United States", keywords: ["usa", "united states", "aspen", "colorado", "crested ridge"] },
  { id: "canada", label: "🇨🇦 Canada", keywords: ["canada", "banff", "lake louise"] },
];

export const SORT_OPTIONS = [
  { value: "curated", label: "Curated Order" },
  { value: "bestseller", label: "Best Sellers & Guest Favourites" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating_desc", label: "Highest Rated" },
  { value: "size_desc", label: "Largest Living Space" },
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
  const paramCountry = searchParams.get("country") || "all";
  const paramBestSeller = searchParams.get("bestseller") === "true";

  // Wishlist set
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const isWishlistFilterActive = location.hash === "#wishlist";

  // Advanced Filter Modal State
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterMinPrice, setFilterMinPrice] = useState<number>(0);
  const [filterMaxPrice, setFilterMaxPrice] = useState<number>(1200);
  const [filterMinBedrooms, setFilterMinBedrooms] = useState<number>(0);
  const [filterAmenities, setFilterAmenities] = useState<string[]>([]);
  const [isPricePopoverOpen, setIsPricePopoverOpen] = useState(false);
  const pricePopoverRef = useRef<HTMLDivElement>(null);

  // Database Rooms & Loading State
  const [rooms, setRooms] = useState<any[]>(CURATED_ROOMS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Calculate stay nights from search dates
  const stayNights = useMemo(() => {
    if (!paramCheckIn || !paramCheckOut) return 2;
    const d1 = new Date(paramCheckIn);
    const d2 = new Date(paramCheckOut);
    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }, [paramCheckIn, paramCheckOut]);

  // Fetch Rooms with guaranteed chronological/deterministic sort
  useEffect(() => {
    window.scrollTo(0, 0);
    updateSEO(
      "Luxury Chalets & Suites | Crafters'Haven",
      "Explore our collection of mountain chalets, alpine villas, penthouses, lofts, and domes at Crafters'Haven. Find and reserve your alpine sanctuary."
    );
    setIsLoading(true);

    roomsApi
      .getAll()
      .then((data) => {
        if (data && data.length > 0) {
          // Deterministic sequence: ensure chronological consistency with stable index
          const mapped = data.map((r, idx) => ({
            ...r,
            locationTitle:
              (r as any).locationTitle ||
              `${r.category.charAt(0).toUpperCase() + r.category.slice(1)} • ${r.elevation || "Alpine Reserve"}`,
            image: r.featuredImage || (r.gallery && r.gallery[0]) || "",
            nightsText: `for ${stayNights} nights`,
            isGuestFavourite: r.rating >= 4.95,
            stableIndex: idx,
          }));
          setRooms(mapped);
        }
      })
      .catch(() => {
        // Fallback to local CURATED_ROOMS with stable indexes
        setRooms(
          CURATED_ROOMS.map((r, idx) => ({
            ...r,
            stableIndex: idx,
          }))
        );
      })
      .finally(() => {
        setIsLoading(false);
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

  // Click outside price popover listener
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (pricePopoverRef.current && !pricePopoverRef.current.contains(e.target as Node)) {
        setIsPricePopoverOpen(false);
      }
    };
    if (isPricePopoverOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isPricePopoverOpen]);

  // URL Parameter Handlers
  const handleSelectCategory = (newCat: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (newCat === "all") {
      nextParams.delete("category");
    } else {
      nextParams.set("category", newCat);
    }
    setSearchParams(nextParams, { replace: true });
  };

  const handleCountryChange = (countryVal: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (countryVal === "all") {
      nextParams.delete("country");
    } else {
      nextParams.set("country", countryVal);
    }
    setSearchParams(nextParams, { replace: true });
  };

  const handleBestSellerToggle = () => {
    const nextParams = new URLSearchParams(searchParams);
    if (paramBestSeller) {
      nextParams.delete("bestseller");
    } else {
      nextParams.set("bestseller", "true");
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
    setFilterMinPrice(0);
    setFilterMaxPrice(1200);
    setFilterMinBedrooms(0);
    setFilterAmenities([]);
    if (window.location.hash) {
      window.location.hash = "";
    }
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (paramCategory !== "all") count++;
    if (paramCountry !== "all") count++;
    if (paramBestSeller) count++;
    if (paramGuests !== "all") count++;
    if (filterMinPrice > 0 || filterMaxPrice < 1200) count++;
    if (filterMinBedrooms > 0) count++;
    if (filterAmenities.length > 0) count += filterAmenities.length;
    return count;
  }, [
    paramCategory,
    paramCountry,
    paramBestSeller,
    paramGuests,
    filterMinPrice,
    filterMaxPrice,
    filterMinBedrooms,
    filterAmenities,
  ]);

  // Filtered & Sorted Rooms Logic
  const filteredRooms = useMemo(() => {
    let list = [...rooms];

    // Wishlist hash filter
    if (isWishlistFilterActive) {
      list = list.filter((r) => wishlistIds.includes(r.id));
    }

    // Place search filter
    if (paramPlace && paramPlace !== "all") {
      const q = paramPlace.toLowerCase();
      list = list.filter(
        (r) =>
          r.locationTitle?.toLowerCase().includes(q) ||
          r.name?.toLowerCase().includes(q) ||
          r.category?.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (paramCategory !== "all") {
      list = list.filter((r) => r.category === paramCategory);
    }

    // Country filter
    if (paramCountry !== "all") {
      const matchedCountry = COUNTRIES.find((c) => c.id === paramCountry);
      if (matchedCountry && matchedCountry.keywords) {
        list = list.filter((r) => {
          const text = `${r.name} ${r.locationTitle || ""} ${r.description || ""}`.toLowerCase();
          return matchedCountry.keywords.some((kw) => text.includes(kw));
        });
      }
    }

    // Best Seller filter
    if (paramBestSeller) {
      list = list.filter((r) => r.isGuestFavourite || r.rating >= 4.95);
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

    // Modal filters: Price Range
    if (filterMinPrice > 0) {
      list = list.filter((r) => r.price >= filterMinPrice);
    }
    if (filterMaxPrice < 1200) {
      list = list.filter((r) => r.price <= filterMaxPrice);
    }

    // Bedrooms
    if (filterMinBedrooms > 0) {
      list = list.filter((r) => r.bedrooms >= filterMinBedrooms);
    }

    // Standout Amenities
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
    } else if (paramSort === "bestseller") {
      list.sort((a, b) => (b.reviewsCount || 0) * b.rating - (a.reviewsCount || 0) * a.rating);
    } else if (paramSort === "size_desc") {
      list.sort((a, b) => {
        const sA = parseInt(a.size?.replace(/[^0-9]/g, "") || "0", 10);
        const sB = parseInt(b.size?.replace(/[^0-9]/g, "") || "0", 10);
        return sB - sA;
      });
    } else {
      // Curated stable sequence (never jumps or defects position)
      list.sort((a, b) => (a.stableIndex ?? 0) - (b.stableIndex ?? 0));
    }

    return list;
  }, [
    rooms,
    isWishlistFilterActive,
    wishlistIds,
    paramPlace,
    paramCategory,
    paramCountry,
    paramBestSeller,
    paramGuests,
    paramSort,
    filterMinPrice,
    filterMaxPrice,
    filterMinBedrooms,
    filterAmenities,
  ]);

  const hasActiveFilters =
    Boolean(paramPlace) ||
    Boolean(paramCheckIn) ||
    Boolean(paramCheckOut) ||
    paramGuests !== "all" ||
    paramCategory !== "all" ||
    paramCountry !== "all" ||
    paramBestSeller ||
    isWishlistFilterActive ||
    activeFilterCount > 0;

  return (
    <div className="min-h-screen bg-[#FFF5F5] text-[#4A4A4A] font-sans selection:bg-[#4A4A4A] selection:text-white flex flex-col justify-between pb-28 md:pb-12">
      <Header />

      <main className="w-full px-3.5 sm:px-6 lg:px-10 py-5 sm:py-7 max-w-[1440px] mx-auto flex-1">
        {/* Top Floating Search Bar */}
        <div className="mb-6 sm:mb-8">
          <SearchBar />
        </div>

        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center mb-6 sm:mb-8">
          

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#4A4A4A] font-syne">
            {isWishlistFilterActive ? "Your Wishlist & Saved Sanctuaries" : "Chalets & Mountain Sanctuaries"}
          </h1>

          <p className="text-[#4A4A4A]/75 text-xs sm:text-sm mt-1.5 leading-relaxed">
            {isWishlistFilterActive
              ? "All your handpicked alpine sanctuaries stored locally on your device."
              : "Browse our curated high-altitude chalets, villas, penthouses, and stargazing domes."}
          </p>

          {/* Active Search & Filter Chips Bar */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3.5 animate-in fade-in duration-200">
              {paramCategory !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#E2B4BD]/50 text-[#4A4A4A] text-xs font-semibold shadow-2xs">
                  <span>Type: {CATEGORIES.find((c) => c.id === paramCategory)?.label}</span>
                  <button
                    onClick={() => handleSelectCategory("all")}
                    className="hover:opacity-75 cursor-pointer ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {paramCountry !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#E2B4BD]/50 text-[#4A4A4A] text-xs font-semibold shadow-2xs">
                  <Globe className="w-3 h-3 text-[#4A4A4A]" />
                  <span>{COUNTRIES.find((c) => c.id === paramCountry)?.label}</span>
                  <button
                    onClick={() => handleCountryChange("all")}
                    className="hover:opacity-75 cursor-pointer ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {paramBestSeller && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F7D6D0]/60 border border-[#E2B4BD] text-[#4A4A4A] text-xs font-semibold shadow-2xs">
                  <Star className="w-3 h-3 fill-[#4A4A4A] text-[#4A4A4A]" />
                  <span>Guest Favourites Only</span>
                  <button onClick={handleBestSellerToggle} className="hover:opacity-75 cursor-pointer ml-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {(filterMinPrice > 0 || filterMaxPrice < 1200) && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#E2B4BD]/50 text-[#4A4A4A] text-xs font-semibold shadow-2xs">
                  <DollarSign className="w-3 h-3 text-[#4A4A4A]" />
                  <span>
                    ${filterMinPrice} – ${filterMaxPrice}/night
                  </span>
                  <button
                    onClick={() => {
                      setFilterMinPrice(0);
                      setFilterMaxPrice(1200);
                    }}
                    className="hover:opacity-75 cursor-pointer ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {paramPlace && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#E2B4BD]/40 text-[#4A4A4A] text-xs font-medium shadow-2xs">
                  <MapPin className="w-3 h-3 text-[#4A4A4A]" />
                  <span>Region: {paramPlace}</span>
                </span>
              )}

              {paramCheckIn && paramCheckOut && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#E2B4BD]/40 text-[#4A4A4A] text-xs font-medium shadow-2xs">
                  <Calendar className="w-3 h-3 text-[#4A4A4A]" />
                  <span>
                    {stayNights} {stayNights === 1 ? "night" : "nights"} ({paramCheckIn} → {paramCheckOut})
                  </span>
                </span>
              )}

              {paramGuests !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#E2B4BD]/40 text-[#4A4A4A] text-xs font-medium shadow-2xs">
                  <Users className="w-3 h-3 text-[#4A4A4A]" />
                  <span>Guests: {paramGuests}</span>
                </span>
              )}

              {isWishlistFilterActive && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F7D6D0] border border-[#E2B4BD] text-[#4A4A4A] text-xs font-semibold shadow-2xs">
                  <Heart className="w-3 h-3 fill-[#E2B4BD] text-[#4A4A4A]" />
                  <span>Wishlist Filter Active</span>
                </span>
              )}

              <button
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white hover:bg-[#F7D6D0]/30 text-[#4A4A4A] text-xs font-medium border border-[#E2B4BD]/40 transition cursor-pointer shadow-2xs"
              >
                <X className="w-3 h-3" />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}
        </div>

        {/* Comprehensive Filter Bar (Desktop Quick Controls & Mobile Trigger) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3.5 border-b border-[#E2B4BD]/30">
          {/* Left: Quick Desktop Dropdowns (Category, Country, Price Range & Best Seller) */}
          <div className="hidden lg:flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
            {/* Category Filter Select */}
            <div className="min-w-[145px]">
              <MuiSelect
                value={paramCategory}
                onChange={(val) => handleSelectCategory(val)}
                options={CATEGORIES.map((c) => ({
                  value: c.id,
                  label:
                    c.id === "all"
                      ? "All Suites"
                      : `${c.label} (${rooms.filter((r) => r.category === c.id).length})`,
                }))}
                size="small"
              />
            </div>

            {/* Country Filter Select */}
            <div className="min-w-[155px]">
              <MuiSelect
                value={paramCountry}
                onChange={(val) => handleCountryChange(val)}
                options={COUNTRIES.map((c) => ({
                  value: c.id,
                  label: c.label,
                }))}
                size="small"
              />
            </div>

            {/* Quick Price Range Popover Button */}
            <div ref={pricePopoverRef} className="relative">
              <button
                type="button"
                onClick={() => setIsPricePopoverOpen(!isPricePopoverOpen)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer active:scale-95 shadow-2xs ${
                  filterMinPrice > 0 || filterMaxPrice < 1200
                    ? "bg-[#4A4A4A] text-white border-[#4A4A4A]"
                    : "bg-white text-[#4A4A4A] border-[#E2B4BD]/50 hover:bg-[#F7D6D0]/30"
                }`}
              >
                <DollarSign className="w-3 h-3" />
                <span>
                  {filterMinPrice > 0 || filterMaxPrice < 1200
                    ? `$${filterMinPrice} - $${filterMaxPrice}`
                    : "Price Range"}
                </span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {/* Price Range Floating Popover */}
              {isPricePopoverOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#E2B4BD]/50 p-4 z-50 space-y-3 animate-in fade-in duration-200">
                  <div className="flex justify-between items-center text-xs font-bold text-[#4A4A4A]">
                    <span>Max Price per Night</span>
                    <span className="text-sm font-syne">${filterMaxPrice}</span>
                  </div>
                  <input
                    type="range"
                    min={150}
                    max={1500}
                    step={25}
                    value={filterMaxPrice}
                    onChange={(e) => setFilterMaxPrice(Number(e.target.value))}
                    className="w-full accent-[#4A4A4A] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#4A4A4A]/60 font-semibold">
                    <span>$150/n</span>
                    <span>$800/n</span>
                    <span>$1,500+/n</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-[#E2B4BD]/20">
                    <button
                      type="button"
                      onClick={() => {
                        setFilterMinPrice(0);
                        setFilterMaxPrice(1200);
                      }}
                      className="text-[11px] underline text-[#4A4A4A] font-semibold cursor-pointer"
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsPricePopoverOpen(false)}
                      className="px-3 py-1 rounded-full bg-[#4A4A4A] text-white text-[11px] font-semibold cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Best Seller Pill Toggle Button */}
            <button
              type="button"
              onClick={handleBestSellerToggle}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer active:scale-95 shadow-2xs ${
                paramBestSeller
                  ? "bg-[#4A4A4A] text-white border-[#4A4A4A]"
                  : "bg-white text-[#4A4A4A] border-[#E2B4BD]/50 hover:bg-[#F7D6D0]/30"
              }`}
            >
              <Star
                className={`w-3 h-3 ${paramBestSeller ? "fill-amber-300 text-amber-300" : "text-[#4A4A4A]"}`}
              />
              <span>Guest Favourites</span>
            </button>
          </div>

          {/* Mobile Capacity Pills */}
          <div className="flex lg:hidden items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
            <span className="text-[#4A4A4A]/70 font-medium text-[11px] mr-1 flex items-center gap-1 shrink-0">
              <Users className="w-3.5 h-3.5 text-[#4A4A4A]" />
              <span>Guests:</span>
            </span>
            {[
              { id: "all", label: "All" },
              { id: "couples", label: "Couples (1-2)" },
              { id: "family", label: "Family (3-4)" },
              { id: "group", label: "Group (5+)" },
            ].map((pill) => (
              <button
                key={pill.id}
                onClick={() => handleGuestFilterChange(pill.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer active:scale-95 whitespace-nowrap ${
                  paramGuests === pill.id
                    ? "bg-[#4A4A4A] text-white shadow-xs"
                    : "bg-white text-[#4A4A4A] border border-[#E2B4BD]/40 hover:bg-[#F7D6D0]/30 shadow-2xs"
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Right: Master Filter Trigger & Sorting */}
          <div className="flex items-center justify-between sm:justify-end gap-2.5 text-xs">
            {/* Filter Modal Trigger Button */}
            <button
              type="button"
              onClick={() => setIsFilterModalOpen(true)}
              className={`px-3.5 py-2 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer active:scale-95 shadow-2xs ${
                activeFilterCount > 0
                  ? "bg-[#4A4A4A] text-white border-[#4A4A4A]"
                  : "bg-white text-[#4A4A4A] border-[#E2B4BD]/50 hover:bg-[#F7D6D0]/30"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-white text-[#4A4A4A] text-[10px] font-bold flex items-center justify-center ml-0.5">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-1.5 min-w-[155px]">
              <MuiSelect
                value={paramSort}
                onChange={(val: any) => handleSortChange(val)}
                options={SORT_OPTIONS}
                className="w-full"
                size="small"
              />
            </div>

            <span className="text-[#4A4A4A]/70 text-xs shrink-0 hidden sm:inline tabular-nums">
              {filteredRooms.length} {filteredRooms.length === 1 ? "stay" : "stays"}
            </span>
          </div>
        </div>

        {/* Room Card Grid: Skeleton while Loading, Stable Sequence when Ready */}
        {isLoading ? (
          <div className="grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4.5 w-full max-w-full min-w-0">
            {Array.from({ length: 12 }).map((_, index) => (
              <RoomCardSkeleton key={index} />
            ))}
          </div>
        ) : filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4.5 w-full max-w-full min-w-0">
            {filteredRooms.map((room) => {
              const totalPrice = room.price * stayNights;
              const nightsText = stayNights === 1 ? "for 1 night" : `for ${stayNights} nights`;

              return (
                <div key={room.id} className="min-w-0 w-full overflow-hidden">
                  <RoomCard
                    room={{
                      ...room,
                      totalPrice,
                      nightsText,
                    }}
                    className="w-full min-w-0 max-w-full"
                    imgHeightClass="h-52 min-[420px]:h-36 sm:h-40 lg:h-44"
                    showAvailabilityBadge={Boolean(paramCheckIn && paramCheckOut)}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#E2B4BD]/40 p-8 space-y-3">
            <Mountain className="w-10 h-10 text-[#4A4A4A]/40 mx-auto" />
            <h3 className="font-bold text-lg font-syne text-[#4A4A4A]">No Sanctuaries Found</h3>
            <p className="text-xs text-[#4A4A4A]/70 max-w-md mx-auto leading-relaxed">
              We couldn't find stays matching all your selected filters. Try broadening your price range,
              clearing specific amenities, or choosing a different region.
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-4 px-5 py-2.5 bg-[#4A4A4A] hover:bg-[#2D2D2D] text-white rounded-full text-xs font-semibold transition cursor-pointer shadow-xs active:scale-95"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Master Comprehensive Filter Modal */}
        {isFilterModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-[70] flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-7 space-y-5 shadow-2xl border border-[#E2B4BD]/40">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#E2B4BD]/30 pb-3">
                <h3 className="font-syne text-lg font-bold text-[#4A4A4A]">Sanctuary Filters</h3>
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="w-8 h-8 rounded-full border border-[#E2B4BD]/40 flex items-center justify-center text-[#4A4A4A] hover:bg-[#F7D6D0]/30 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 1. Sanctuary Type / Category Selection */}
              <div className="space-y-2">
                <span className="block font-bold text-xs text-[#4A4A4A]">Sanctuary Classification</span>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => {
                    const isSelected = paramCategory === cat.id;
                    const count =
                      cat.id === "all"
                        ? rooms.length
                        : rooms.filter((r) => r.category === cat.id).length;

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleSelectCategory(cat.id)}
                        className={`p-2.5 rounded-xl border text-left transition cursor-pointer active:scale-95 ${
                          isSelected
                            ? "bg-[#4A4A4A] text-white border-[#4A4A4A] shadow-xs"
                            : "bg-white text-[#4A4A4A] border-[#E2B4BD]/40 hover:bg-[#FFF5F5]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold truncate">{cat.label}</span>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                              isSelected ? "bg-white/20 text-white" : "bg-[#F7D6D0]/50 text-[#4A4A4A]"
                            }`}
                          >
                            {count}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Country / Mountain Destination Selection */}
              <div className="space-y-2 pt-2 border-t border-[#E2B4BD]/20">
                <span className="block font-bold text-xs text-[#4A4A4A]">Country / Mountain Destination</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {COUNTRIES.map((country) => {
                    const isSelected = paramCountry === country.id;
                    return (
                      <button
                        key={country.id}
                        type="button"
                        onClick={() => handleCountryChange(country.id)}
                        className={`px-2.5 py-2 rounded-xl border text-xs font-semibold transition cursor-pointer text-center truncate active:scale-95 ${
                          isSelected
                            ? "bg-[#4A4A4A] text-white border-[#4A4A4A] shadow-xs"
                            : "bg-white text-[#4A4A4A] border-[#E2B4BD]/40 hover:bg-[#F7D6D0]/30"
                        }`}
                      >
                        {country.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Price Range Slider */}
              <div className="space-y-2 pt-2 border-t border-[#E2B4BD]/20">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#4A4A4A]">Max Price per Night</span>
                  <span className="font-bold text-[#4A4A4A] text-sm font-syne">${filterMaxPrice}</span>
                </div>
                <input
                  type="range"
                  min={150}
                  max={1500}
                  step={25}
                  value={filterMaxPrice}
                  onChange={(e) => setFilterMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#4A4A4A] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#4A4A4A]/60 font-semibold">
                  <span>$150/n</span>
                  <span>$800/n</span>
                  <span>$1,500+/n</span>
                </div>
              </div>

              {/* 4. Best Seller & Guest Favourites Checkbox */}
              <div className="pt-2 border-t border-[#E2B4BD]/20">
                <button
                  type="button"
                  onClick={handleBestSellerToggle}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition cursor-pointer active:scale-98 ${
                    paramBestSeller
                      ? "bg-[#F7D6D0]/40 border-[#4A4A4A] shadow-xs"
                      : "bg-white border-[#E2B4BD]/40 hover:bg-[#FFF5F5]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        paramBestSeller ? "bg-[#4A4A4A] text-white" : "bg-[#F7D6D0]/50 text-[#4A4A4A]"
                      }`}
                    >
                      <Star
                        className={`w-4 h-4 ${paramBestSeller ? "fill-amber-300 text-amber-300" : ""}`}
                      />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#4A4A4A]">Guest Favourites (Top 5%)</div>
                      <div className="text-[10px] text-[#4A4A4A]/70">
                        Highest rated stays with 4.95+ average guest reviews
                      </div>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                      paramBestSeller ? "bg-[#4A4A4A] border-[#4A4A4A] text-white" : "border-[#E2B4BD]"
                    }`}
                  >
                    {paramBestSeller && <Check className="w-3.5 h-3.5" />}
                  </div>
                </button>
              </div>

              {/* 5. Bedrooms Stepper */}
              <div className="space-y-2 pt-2 border-t border-[#E2B4BD]/20">
                <span className="block font-bold text-xs text-[#4A4A4A]">Minimum Bedrooms</span>
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
                      className={`flex-1 py-1.5 rounded-full border text-xs font-semibold transition cursor-pointer active:scale-95 ${
                        filterMinBedrooms === btn.id
                          ? "bg-[#4A4A4A] text-white border-[#4A4A4A]"
                          : "bg-white text-[#4A4A4A] border-[#E2B4BD]/40 hover:bg-[#F7D6D0]/30"
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 6. Standout Amenities Checkboxes */}
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
                        className={`px-3 py-2 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition cursor-pointer active:scale-95 ${
                          isChecked
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

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-[#E2B4BD]/30">
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-xs font-semibold text-[#4A4A4A] underline cursor-pointer hover:text-brand-charcoal"
                >
                  Clear all
                </button>
                <button
                  type="button"
                  onClick={() => setIsFilterModalOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-[#4A4A4A] hover:bg-[#2D2D2D] text-white text-xs font-semibold shadow-md transition cursor-pointer active:scale-95"
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