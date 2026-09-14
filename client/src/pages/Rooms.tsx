import React, { useState } from "react";
import Header from "../components/Header";
import {
  Users,
  Maximize2,
  ArrowUpRight,
  Check,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

interface RoomItem {
  id: string;
  name: string;
  category: "chalet" | "villa" | "penthouse";
  price: number;
  image: string;
  size: string;
  guests: number;
  bed: string;
  tagline: string;
  amenities: string[];
}

const ROOMS_DATA: RoomItem[] = [
  {
    id: "aframe",
    name: "Architectural A-Frame Chalet",
    category: "chalet",
    price: 490,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
    size: "1,250 sq ft",
    guests: 4,
    bed: "1 King + Loft",
    tagline: "Double-height glass facade & private cedar deck",
    amenities: ["Private Deck", "Wood Fireplace", "Glass Facade"],
  },
  {
    id: "forest-villa",
    name: "Panoramic Forest Villa",
    category: "villa",
    price: 640,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
    size: "1,850 sq ft",
    guests: 6,
    bed: "2 Kings",
    tagline: "Private cedar sauna & outdoor hot tub",
    amenities: ["Cedar Sauna", "Sunken Tub", "Full Kitchen"],
  },
  {
    id: "alpine-suite",
    name: "Royal Alpine Penthouse",
    category: "penthouse",
    price: 880,
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
    size: "2,400 sq ft",
    guests: 4,
    bed: "2 Master Suites",
    tagline: "Panoramic mountain skyline views & butler service",
    amenities: ["Butler Service", "Helipad Access", "Stone Fireplace"],
  },
  {
    id: "heritage-loft",
    name: "Heritage Timber Loft",
    category: "chalet",
    price: 360,
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
    size: "880 sq ft",
    guests: 2,
    bed: "1 King",
    tagline: "Romantic couples retreat with reclaimed pine",
    amenities: ["Deep Tub", "Wood Stove", "Forest Balcony"],
  },
  {
    id: "mountain-chalet",
    name: "Crested Ridge Chalet",
    category: "chalet",
    price: 520,
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80",
    size: "1,400 sq ft",
    guests: 4,
    bed: "1 King + 1 Queen",
    tagline: "Stargazing roof terrace & heated slate floors",
    amenities: ["Stargazing Deck", "Slate Floors", "Firepit"],
  },
  {
    id: "grand-villa",
    name: "Solitude Grand Villa",
    category: "villa",
    price: 750,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
    size: "2,100 sq ft",
    guests: 8,
    bed: "3 Kings + Lofts",
    tagline: "Exclusive family estate with private woodland spa",
    amenities: ["Dual Hot Tubs", "Private Chef Dining", "Ski-In Access"],
  },
];

export const Rooms: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredRooms =
    selectedCategory === "all"
      ? ROOMS_DATA
      : ROOMS_DATA.filter((r) => r.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-900 font-sans selection:bg-stone-900 selection:text-white flex flex-col justify-between pb-20 md:pb-0">
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <main className="w-full px-4 sm:px-8 lg:px-12 py-6 sm:py-10 max-w-7xl mx-auto flex-1">
        {/* Page Hero Header */}
        <div className="max-w-2xl mx-auto text-center mb-8 sm:mb-12">
          <span className="text-xs font-semibold tracking-wider text-stone-500 uppercase block mb-1">
            Crafters'Haven Accommodations
          </span>
          <h1 className="font-syne text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900">
            Suites & Mountain Chalets
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-2 leading-relaxed">
            Curated timber chalets and panoramic villas in the high alpine pine reserve.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {[
              { id: "all", label: "All Suites" },
              { id: "chalet", label: "Chalets" },
              { id: "villa", label: "Villas" },
              { id: "penthouse", label: "Penthouses" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer ${
                  selectedCategory === tab.id
                    ? "bg-stone-900 text-white shadow-xs"
                    : "bg-white text-stone-600 hover:bg-stone-100 hover:text-stone-900 border border-stone-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Compact, Clean Room Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-2xl overflow-hidden border border-stone-200 p-3 sm:p-3.5 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
            >
              <div>
                {/* Compact Image */}
                <div className="relative h-36 sm:h-40 w-full overflow-hidden rounded-xl bg-stone-100 mb-3">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-stone-900/80 text-[9px] font-semibold uppercase text-white tracking-wider">
                    {room.category}
                  </div>
                  <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-white/95 text-stone-900 font-bold text-xs shadow-xs">
                    ${room.price} <span className="text-[9px] font-normal text-stone-500">/ night</span>
                  </div>
                </div>

                {/* Card Details */}
                <h3 className="font-syne font-bold text-sm sm:text-base text-stone-900 leading-snug">
                  {room.name}
                </h3>
                <p className="text-xs text-stone-500 font-normal mt-0.5 line-clamp-1">
                  {room.tagline}
                </p>

                {/* Specs */}
                <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-2 pb-2 border-b border-stone-100">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-stone-400" />
                    <span>{room.guests} Guests</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Maximize2 className="w-3 h-3 text-stone-400" />
                    <span>{room.size}</span>
                  </span>
                  <span>•</span>
                  <span className="truncate">{room.bed}</span>
                </div>

                {/* Amenities */}
                <div className="pt-2 flex flex-wrap gap-1">
                  {room.amenities.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-stone-50 border border-stone-200 text-stone-600"
                    >
                      <Check className="w-2.5 h-2.5 text-stone-500" />
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Booking inquiry row */}
              <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between">
                <a
                  href="tel:+18005550199"
                  className="text-[11px] text-stone-500 hover:text-stone-900"
                >
                  Call Concierge
                </a>
                <a
                  href={`mailto:concierge@craftershaven.com?subject=Booking Inquiry for ${room.name}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-stone-900 hover:text-amber-700 transition"
                >
                  <span>Inquire Suite</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Real Direct Concierge Contact Strip */}
        <div className="mt-12 p-6 rounded-2xl bg-stone-900 text-stone-300 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-semibold text-white text-sm">Need assistance with your reservation?</h4>
            <p className="text-stone-400 text-xs mt-0.5">Contact our front desk concierge directly for tailored chalet arrangements.</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="tel:+18005550199"
              className="px-4 py-2 rounded-full bg-white text-stone-900 font-semibold text-xs hover:bg-stone-100 transition"
            >
              Call +1 (800) 555-0199
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Rooms;