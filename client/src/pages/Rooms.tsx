import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
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
  Check,
  Calendar,
  MapPin,
  Heart,
  X,
  Star,
  Globe,
  DollarSign,
  RotateCcw,
  ChevronDown,
} from "lucide-react";

export const CATEGORIES = [
  { id: "all", label: "All Rooms & Suites" },
  { id: "chalet", label: "Deluxe Suite" },
  { id: "penthouse", label: "Penthouse Suite" },
  { id: "villa", label: "Family Villa" },
  { id: "loft", label: "Studio Loft" },
  { id: "dome", label: "Glamping Dome" },
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
  { value: "bestseller", label: "Guest Favourites" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating_desc", label: "Highest Rated" },
  { value: "size_desc", label: "Largest Living Space" },
];

export const STANDOUT_AMENITIES = [
  { id: "hot tub", label: "Private Hot Tub" },
  { id: "sauna", label: "Finnish Sauna" },
  { id: "fireplace", label: "Stone Fireplace" },
  { id: "glass", label: "Panoramic Glass" },
  { id: "deck", label: "Alpine Deck" },
  { id: "wifi", label: "Fast Wi-Fi" },
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

  // Mobile Filter Overlay / Modal State
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterMinPrice, setFilterMinPrice] = useState<number>(0);
  const [filterMaxPrice, setFilterMaxPrice] = useState<number>(1200);
  const [filterMinBedrooms, setFilterMinBedrooms] = useState<number>(0);
  const [filterAmenities, setFilterAmenities] = useState<string[]>([]);
  const [isRoomTypeExpanded, setIsRoomTypeExpanded] = useState<boolean>(false);
  const [isAmenitiesExpanded, setIsAmenitiesExpanded] = useState<boolean>(false);

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
      "Hotel Rooms, Suites & Residences | Haven Hospitality",
      "Explore curated hotel rooms, deluxe suites, family villas, and penthouses. Book seamlessly with instant confirmation."
    );
    setIsLoading(true);

    roomsApi
      .getAll()
      .then((data) => {
        if (data && data.length > 0) {
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

  // Prevent background scrolling when mobile filter overlay is open
  useEffect(() => {
    if (isFilterModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isFilterModalOpen]);

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

    // Price Range filter
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

  // Reusable Filter Sections (shared between Desktop Sidebar and Mobile Overlay Modal)
  const renderFilterSections = () => (
    <div className="space-y-4">
      {/* 1. Property & Room Type (Dropdown by default to save height, with toggle to list view) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#4A4A4A]">
            Property & Room Type
          </label>
          <button
            type="button"
            onClick={() => setIsRoomTypeExpanded(!isRoomTypeExpanded)}
            className="text-[11px] font-semibold text-stone-500 hover:text-[#4A4A4A] flex items-center gap-1 cursor-pointer transition"
          >
            <span>{isRoomTypeExpanded ? "Dropdown" : "List view"}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${isRoomTypeExpanded ? "rotate-180" : ""
                }`}
            />
          </button>
        </div>

        {!isRoomTypeExpanded ? (
          <div className="w-full">
            <MuiSelect
              value={paramCategory}
              onChange={(val) => handleSelectCategory(val)}
              options={CATEGORIES.map((cat) => {
                const count =
                  cat.id === "all"
                    ? rooms.length
                    : rooms.filter((r) => r.category === cat.id).length;
                return {
                  value: cat.id,
                  label: `${cat.label} (${count})`,
                };
              })}
              size="small"
              className="w-full"
            />
          </div>
        ) : (
          <div className="space-y-1.5 animate-in fade-in duration-150">
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
                  className={`w-full px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition cursor-pointer active:scale-98 ${isSelected
                      ? "bg-[#4A4A4A] text-white shadow-xs font-semibold"
                      : "bg-white hover:bg-stone-50 text-[#4A4A4A] border border-stone-200/80"
                    }`}
                >
                  <span className="truncate">{cat.label}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold tabular-nums ${isSelected ? "bg-white/20 text-white" : "bg-stone-100 text-stone-600"
                      }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Price Range Slider */}
      <div className="space-y-2 pt-3 border-t border-stone-200/80">
        <div className="flex justify-between items-center text-xs">
          <label className="font-bold uppercase tracking-wider text-[#4A4A4A] text-[11px]">
            Max Price / Night
          </label>
          <span className="font-bold text-sm font-syne text-[#4A4A4A]">
            ${filterMaxPrice}
          </span>
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
        <div className="flex justify-between text-[10px] text-stone-500 font-medium">
          <span>$150/n</span>
          <span>$800/n</span>
          <span>$1,500+/n</span>
        </div>
      </div>

      {/* 3. Bedrooms */}
      <div className="space-y-2 pt-3 border-t border-stone-200/80">
        <label className="block font-bold uppercase tracking-wider text-[#4A4A4A] text-[11px]">
          Bedrooms
        </label>
        <div className="flex items-center gap-1.5">
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
              className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer active:scale-95 ${filterMinBedrooms === btn.id
                  ? "bg-[#4A4A4A] text-white border-[#4A4A4A]"
                  : "bg-white text-[#4A4A4A] border-stone-200/80 hover:bg-stone-50"
                }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Guest Capacity */}
      <div className="space-y-2 pt-3 border-t border-stone-200/80">
        <label className="block font-bold uppercase tracking-wider text-[#4A4A4A] text-[11px]">
          Guest Capacity
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: "all", label: "Any Guests" },
            { id: "couples", label: "Couples (1-2)" },
            { id: "family", label: "Family (3-4)" },
            { id: "group", label: "Group (5+)" },
          ].map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => handleGuestFilterChange(pill.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-center transition cursor-pointer active:scale-95 ${paramGuests === pill.id
                  ? "bg-[#4A4A4A] text-white font-semibold"
                  : "bg-white text-[#4A4A4A] border border-stone-200/80 hover:bg-stone-50"
                }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Guest Favourites / Best Seller Toggle */}
      <div className="pt-3 border-t border-stone-200/80">
        <button
          type="button"
          onClick={handleBestSellerToggle}
          className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition cursor-pointer active:scale-98 ${paramBestSeller
              ? "bg-amber-50/70 border-amber-300 shadow-2xs"
              : "bg-white border-stone-200/80 hover:bg-stone-50"
            }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${paramBestSeller ? "bg-amber-400 text-stone-900" : "bg-stone-100 text-[#4A4A4A]"
                }`}
            >
              <Star className={`w-3.5 h-3.5 ${paramBestSeller ? "fill-stone-900" : ""}`} />
            </div>
            <div>
              <div className="text-xs font-bold text-[#4A4A4A]">Guest Favourites</div>
              <div className="text-[10px] text-stone-500">Rated 4.95+ by guests</div>
            </div>
          </div>
          <div
            className={`w-4 h-4 rounded border flex items-center justify-center ${paramBestSeller ? "bg-[#4A4A4A] border-[#4A4A4A] text-white" : "border-stone-300"
              }`}
          >
            {paramBestSeller && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
        </button>
      </div>

      {/* 6. Destination / Country */}
      <div className="space-y-2 pt-3 border-t border-stone-200/80">
        <label className="block font-bold uppercase tracking-wider text-[#4A4A4A] text-[11px]">
          Destination
        </label>
        <div className="w-full">
          <MuiSelect
            value={paramCountry}
            onChange={(val) => handleCountryChange(val)}
            options={COUNTRIES.map((c) => ({
              value: c.id,
              label: c.label,
            }))}
            size="small"
            className="w-full"
          />
        </div>
      </div>

      {/* 7. Standout Amenities (Collapsible Accordion) */}
      <div className="space-y-2 pt-3 border-t border-stone-200/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <label className="block font-bold uppercase tracking-wider text-[#4A4A4A] text-[11px]">
              Standout Amenities
            </label>
            {filterAmenities.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#4A4A4A] text-white text-[10px] font-bold flex items-center justify-center">
                {filterAmenities.length}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsAmenitiesExpanded(!isAmenitiesExpanded)}
            className="text-[11px] font-semibold text-stone-500 hover:text-[#4A4A4A] flex items-center gap-1 cursor-pointer transition"
          >
            <span>{isAmenitiesExpanded ? "Hide" : "Show"}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${isAmenitiesExpanded ? "rotate-180" : ""
                }`}
            />
          </button>
        </div>

        {isAmenitiesExpanded ? (
          <div className="grid grid-cols-2 gap-1.5 animate-in fade-in duration-150">
            {STANDOUT_AMENITIES.map((amenity) => {
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
                  className={`px-2.5 py-1.5 rounded-lg border text-left text-xs font-medium flex items-center justify-between transition cursor-pointer active:scale-95 ${isChecked
                      ? "border-[#4A4A4A] bg-[#4A4A4A] text-white font-semibold"
                      : "border-stone-200/80 bg-white text-stone-700 hover:bg-stone-50"
                    }`}
                >
                  <span className="truncate text-[11px]">{amenity.label}</span>
                  {isChecked && <Check className="w-3 h-3 shrink-0 ml-1 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsAmenitiesExpanded(true)}
            className="w-full text-left py-1 text-[11px] text-stone-400 hover:text-stone-600 transition flex items-center justify-between"
          >
            <span>
              {filterAmenities.length > 0
                ? `${filterAmenities.length} selected (${filterAmenities.join(", ")})`
                : "Hot Tub, Sauna, Fireplace..."}
            </span>
            <span className="text-[10px] text-stone-500 underline font-medium">Click to pick</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFF5F5] text-[#4A4A4A] font-sans selection:bg-[#4A4A4A] selection:text-white flex flex-col justify-between pb-28 md:pb-12">
      <Header />

      <main className="w-full px-3.5 sm:px-6 lg:px-10 py-5 sm:py-7 max-w-[1440px] mx-auto flex-1">
        {/* Top Floating Search Bar */}
        <div className="mb-6 sm:mb-8">
          <SearchBar />
        </div>

        {/* Page Hero Header */}
        <div className="max-w-3xl mx-auto text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#4A4A4A] font-syne">
            {isWishlistFilterActive ? "Saved Wishlist & Rooms" : "Rooms, Suites & Accommodations"}
          </h1>
          <p className="text-[#4A4A4A]/75 text-xs sm:text-sm mt-1.5 leading-relaxed">
            {isWishlistFilterActive
              ? "All your handpicked hotel rooms and suites saved to your device."
              : "Discover and reserve luxury suites, boutique hotel rooms, and scenic residences with verified amenities."}
          </p>

          {/* Active Filter Chips Bar */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3.5 animate-in fade-in duration-200">
              {paramCategory !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-stone-200 text-[#4A4A4A] text-xs font-semibold shadow-2xs">
                  <span>Type: {CATEGORIES.find((c) => c.id === paramCategory)?.label}</span>
                  <button
                    onClick={() => handleSelectCategory("all")}
                    className="hover:opacity-75 cursor-pointer ml-0.5"
                    aria-label="Remove category filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {paramCountry !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-stone-200 text-[#4A4A4A] text-xs font-semibold shadow-2xs">
                  <Globe className="w-3 h-3 text-[#4A4A4A]" />
                  <span>{COUNTRIES.find((c) => c.id === paramCountry)?.label}</span>
                  <button
                    onClick={() => handleCountryChange("all")}
                    className="hover:opacity-75 cursor-pointer ml-0.5"
                    aria-label="Remove destination filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {paramBestSeller && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-300 text-stone-800 text-xs font-semibold shadow-2xs">
                  <Star className="w-3 h-3 fill-stone-800 text-stone-800" />
                  <span>Guest Favourites Only</span>
                  <button
                    onClick={handleBestSellerToggle}
                    className="hover:opacity-75 cursor-pointer ml-0.5"
                    aria-label="Remove guest favourites filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {(filterMinPrice > 0 || filterMaxPrice < 1200) && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-stone-200 text-[#4A4A4A] text-xs font-semibold shadow-2xs">
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
                    aria-label="Reset price filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {paramPlace && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-stone-200 text-[#4A4A4A] text-xs font-medium shadow-2xs">
                  <MapPin className="w-3 h-3 text-[#4A4A4A]" />
                  <span>Destination: {paramPlace}</span>
                </span>
              )}

              {paramCheckIn && paramCheckOut && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-stone-200 text-[#4A4A4A] text-xs font-medium shadow-2xs">
                  <Calendar className="w-3 h-3 text-[#4A4A4A]" />
                  <span>
                    {stayNights} {stayNights === 1 ? "night" : "nights"} ({paramCheckIn} → {paramCheckOut})
                  </span>
                </span>
              )}

              {paramGuests !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-stone-200 text-[#4A4A4A] text-xs font-medium shadow-2xs">
                  <Users className="w-3 h-3 text-[#4A4A4A]" />
                  <span>Guests: {paramGuests}</span>
                </span>
              )}

              {isWishlistFilterActive && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold shadow-2xs">
                  <Heart className="w-3 h-3 fill-rose-600 text-rose-600" />
                  <span>Wishlist Active</span>
                </span>
              )}

              <button
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white hover:bg-stone-100 text-[#4A4A4A] text-xs font-medium border border-stone-200 transition cursor-pointer shadow-2xs"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Filter Action Header (< lg screen only) */}
        <div className="lg:hidden flex items-center justify-between gap-3 mb-5 pb-3 border-b border-stone-200/80">
          <button
            type="button"
            onClick={() => setIsFilterModalOpen(true)}
            className={`px-4 py-2 rounded-full border text-xs font-semibold flex items-center gap-2 transition cursor-pointer active:scale-95 shadow-xs ${activeFilterCount > 0
                ? "bg-[#4A4A4A] text-white border-[#4A4A4A]"
                : "bg-white text-[#4A4A4A] border-stone-200/80 hover:bg-stone-50"
              }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-white text-[#4A4A4A] text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-2">
            <div className="min-w-[140px]">
              <MuiSelect
                value={paramSort}
                onChange={(val: any) => handleSortChange(val)}
                options={SORT_OPTIONS}
                size="small"
              />
            </div>
            <span className="text-xs text-stone-500 font-medium tabular-nums shrink-0">
              {filteredRooms.length} {filteredRooms.length === 1 ? "room" : "rooms"}
            </span>
          </div>
        </div>

        {/* Desktop Split Layout: Sticky Left Sidebar Filter + Right Room Cards Grid */}
        <div className="lg:grid lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr] gap-8 items-start">
          {/* DESKTOP SIDEBAR FILTER (Hidden on Mobile) */}
          <aside className="hidden lg:block sticky top-24 self-start bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200/80">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#4A4A4A]" />
                <h2 className="font-syne font-bold text-sm text-[#4A4A4A]">Filters</h2>
                {activeFilterCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#4A4A4A] text-white text-[10px] font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-[11px] font-semibold text-stone-500 hover:text-[#4A4A4A] underline cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Desktop Filter Sections */}
            {renderFilterSections()}
          </aside>

          {/* MAIN ROOMS AREA (Right Column on Desktop, Full Width on Mobile) */}
          <div className="min-w-0 w-full space-y-5">
            {/* Desktop Top Bar: Results Count + Sort Dropdown */}
            <div className="hidden lg:flex items-center justify-between pb-3 border-b border-stone-200/80">
              <div className="flex items-center gap-2">
                <span className="font-syne font-bold text-base text-[#4A4A4A]">
                  Available Stays
                </span>
                <span className="text-xs text-stone-500 font-medium tabular-nums">
                  ({filteredRooms.length} {filteredRooms.length === 1 ? "option" : "options"})
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-stone-500 font-medium">Sort by:</span>
                <div className="min-w-[170px]">
                  <MuiSelect
                    value={paramSort}
                    onChange={(val: any) => handleSortChange(val)}
                    options={SORT_OPTIONS}
                    size="small"
                  />
                </div>
              </div>
            </div>

            {/* Room Card Grid: Skeleton while Loading, Stable Sequence when Ready */}
            {isLoading ? (
              <div className="grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4 w-full">
                {Array.from({ length: 12 }).map((_, index) => (
                  <RoomCardSkeleton key={index} />
                ))}
              </div>
            ) : filteredRooms.length > 0 ? (
              <div className="grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4 w-full">
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
                        imgHeightClass="h-44 min-[420px]:h-36 sm:h-40 lg:h-44"
                        showAvailabilityBadge={Boolean(paramCheckIn && paramCheckOut)}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-stone-200/80 p-8 space-y-3">
                <Mountain className="w-10 h-10 text-stone-300 mx-auto" />
                <h3 className="font-bold text-lg font-syne text-[#4A4A4A]">No Stays Matching Filters</h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                  We couldn't find hotel rooms matching all selected parameters. Try widening your price range,
                  clearing specific amenities, or selecting all room types.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="mt-4 px-5 py-2.5 bg-[#4A4A4A] hover:bg-[#2D2D2D] text-white rounded-full text-xs font-semibold transition cursor-pointer shadow-xs active:scale-95"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* MOBILE OVERLAY FILTER MODAL / DRAWER (Opened on Mobile via "Filters" button) */}
        {isFilterModalOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
            {/* Backdrop click to dismiss */}
            <div
              className="flex-1 w-full"
              onClick={() => setIsFilterModalOpen(false)}
            />

            {/* Bottom Sheet Modal Container */}
            <div className="bg-white rounded-t-3xl max-h-[85vh] w-full flex flex-col shadow-2xl border-t border-stone-200 animate-in slide-in-from-bottom duration-250">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#4A4A4A]" />
                  <h3 className="font-syne text-base font-bold text-[#4A4A4A]">Room Filters</h3>
                  {activeFilterCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#4A4A4A] text-white text-[10px] font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-[#4A4A4A] hover:bg-stone-50 transition cursor-pointer"
                  aria-label="Close filters"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Filter Content */}
              <div className="flex-1 overflow-y-auto p-5">
                {renderFilterSections()}
              </div>

              {/* Fixed Bottom Action Bar */}
              <div className="p-4 border-t border-stone-200 bg-white flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-xs font-semibold text-stone-500 hover:text-[#4A4A4A] underline cursor-pointer px-2"
                >
                  Clear all
                </button>
                <button
                  type="button"
                  onClick={() => setIsFilterModalOpen(false)}
                  className="flex-1 py-3 rounded-full bg-[#4A4A4A] hover:bg-[#2D2D2D] text-white text-xs font-semibold shadow-md transition cursor-pointer active:scale-95 text-center"
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