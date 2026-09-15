import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Star } from "lucide-react";

export interface CompactRoomItem {
  id: string;
  name: string;
  locationTitle: string; // e.g. "Chalet in Crested Ridge"
  category: "chalet" | "villa" | "penthouse" | "loft" | "dome";
  price: number;
  image: string;
  rating: number;
  reviewsCount?: number;
  isGuestFavourite?: boolean;
  nightsText?: string; // e.g. "for 2 nights"
  isAvailable?: boolean;
  totalPrice?: number;
}

interface RoomCardProps {
  room: CompactRoomItem;
  hasMoved?: boolean;
  className?: string;
  imgHeightClass?: string;
  showAvailabilityBadge?: boolean;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  room,
  hasMoved = false,
  className = "w-44 sm:w-52 md:w-60 shrink-0",
  imgHeightClass = "h-36 sm:h-44",
  showAvailabilityBadge = false,
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("chs_wishlist");
      if (saved) {
        const list: string[] = JSON.parse(saved);
        setIsWishlisted(list.includes(room.id));
      }
    } catch {
      // ignore
    }
  }, [room.id]);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const saved = localStorage.getItem("chs_wishlist");
      let list: string[] = saved ? JSON.parse(saved) : [];
      if (list.includes(room.id)) {
        list = list.filter((id) => id !== room.id);
        setIsWishlisted(false);
      } else {
        list.push(room.id);
        setIsWishlisted(true);
      }
      localStorage.setItem("chs_wishlist", JSON.stringify(list));
      window.dispatchEvent(new Event("wishlist-updated"));
    } catch {
      setIsWishlisted(!isWishlisted);
    }
  };

  const isUnavailable = room.isAvailable === false;

  return (
    <div className={`group select-none min-w-0 max-w-full overflow-hidden ${className} ${isUnavailable ? "opacity-75" : ""}`}>
      <Link
        to={`/rooms/${room.id}`}
        onClick={(e) => {
          if (hasMoved) e.preventDefault();
        }}
        className="block w-full max-w-full overflow-hidden"
      >
        {/* Rounded Image Container (Strictly bounded) */}
        <div className={`relative ${imgHeightClass} w-full max-w-full overflow-hidden rounded-2xl bg-[#FFF5F5] border border-[#E2B4BD]/30 shadow-xs group-hover:shadow-md transition-shadow duration-300`}>
          <img
            src={room.image}
            alt={room.name}
            className="w-full h-full max-w-full object-cover block group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
            draggable={false}
          />

          {/* Top Left "Guest favourite" Pill (#F7D6D0 Accent) */}
          {room.isGuestFavourite && (
            <div className="absolute top-2.5 left-2.5 z-10">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#F7D6D0] text-[#4A4A4A] text-[10px] sm:text-[11px] font-bold shadow-xs tracking-tight border border-white/60">
                Guest favourite
              </span>
            </div>
          )}

          {showAvailabilityBadge && (
            <div className="absolute bottom-2.5 left-2.5 z-10">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold backdrop-blur-md shadow-xs ${
                  isUnavailable
                    ? "bg-rose-900/90 text-white"
                    : "bg-[#4A4A4A] text-white"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isUnavailable ? "bg-rose-400" : "bg-[#E2B4BD] animate-pulse"
                  }`}
                />
                {isUnavailable ? "Reserved" : "Available"}
              </span>
            </div>
          )}

          {/* Top Right Wishlist Heart */}
          <button
            type="button"
            onClick={handleWishlistToggle}
            className="absolute top-2.5 right-2.5 p-1 text-white hover:scale-115 active:scale-90 transition-transform cursor-pointer drop-shadow-md z-10"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
                isWishlisted
                  ? "fill-[#E2B4BD] text-[#4A4A4A]"
                  : "stroke-white text-transparent fill-black/20 hover:fill-black/40"
              }`}
              strokeWidth={2}
            />
          </button>
        </div>

        {/* Text Info Below Image - Fully bounded & truncating */}
        <div className="mt-2 text-left min-w-0 max-w-full overflow-hidden">
          {/* Title line */}
          <h3 className="font-semibold text-[#4A4A4A] text-[13px] sm:text-[14px] leading-tight truncate group-hover:text-black transition-colors">
            {room.locationTitle || room.name}
          </h3>

          {/* Price & Rating line */}
          <p className="text-[#4A4A4A]/70 text-[11px] sm:text-[12px] font-normal leading-tight mt-1 flex items-center justify-between min-w-0">
            <span className="truncate min-w-0">
              <strong className="font-bold text-[#4A4A4A]">
                ${room.totalPrice ?? room.price}
              </strong>{" "}
              {room.nightsText || "for 2 nights"}
            </span>
            <span className="flex items-center gap-0.5 text-[#4A4A4A] font-semibold shrink-0 ml-1">
              <Star className="w-3 h-3 fill-[#4A4A4A] text-[#4A4A4A]" />
              <span>{room.rating.toFixed(room.rating % 1 === 0 ? 1 : 2)}</span>
            </span>
          </p>
        </div>
      </Link>
    </div>
  );
};

export default RoomCard;
