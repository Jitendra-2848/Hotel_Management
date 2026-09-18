import React, { useState, useEffect, memo } from "react";
import { Link } from "react-router-dom";
import { Heart, Star, ChevronLeft, ChevronRight } from "lucide-react";

export interface CompactRoomItem {
  id: string;
  name: string;
  locationTitle: string; // e.g. "Chalet in Crested Ridge"
  category: "chalet" | "villa" | "penthouse" | "loft" | "dome";
  price: number;
  image: string;
  gallery?: string[];
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

export const RoomCardComponent: React.FC<RoomCardProps> = ({
  room,
  hasMoved = false,
  className = "w-44 sm:w-52 md:w-60 shrink-0",
  imgHeightClass = "h-36 sm:h-44",
  showAvailabilityBadge = false,
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  // Collect image carousel options (fallback to cover image)
  const images = React.useMemo(() => {
    if (room.gallery && room.gallery.length > 0) {
      return room.gallery;
    }
    return [room.image];
  }, [room.gallery, room.image]);

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

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const isUnavailable = room.isAvailable === false;

  return (
    <div className={`group select-none min-w-0 max-w-full overflow-hidden ${className} ${isUnavailable ? "opacity-75" : ""}`}>
      <Link
        to={`/rooms/${room.id}`}
        onClick={(e) => {
          if (hasMoved) e.preventDefault();
        }}
        className="block w-full max-w-full overflow-hidden active:scale-[0.99] transition-transform"
      >
        {/* Rounded Image Container (Strictly bounded) */}
        <div className={`relative ${imgHeightClass} w-full max-w-full overflow-hidden rounded-2xl bg-[#FFF5F5] border border-[#E2B4BD]/30 shadow-xs group-hover:shadow-md transition-all duration-300`}>
          <img
            src={images[currentImgIndex]}
            alt={`${room.name} - view ${currentImgIndex + 1}`}
            className="w-full h-full max-w-full object-cover block group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
            draggable={false}
          />

          {/* Carousel Arrows (Show on hover if multiple images) */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevImage}
                aria-label="Previous photo"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/90 hover:bg-white text-[#4A4A4A] shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 cursor-pointer active:scale-90"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextImage}
                aria-label="Next photo"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/90 hover:bg-white text-[#4A4A4A] shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 cursor-pointer active:scale-90"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Carousel Dot Indicators */}
              <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center gap-1 z-10 pointer-events-none">
                {images.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImgIndex
                      ? "w-3 bg-white shadow-xs"
                      : "w-1.5 bg-white/60"
                      }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Top Left "Guest favourite" Pill (#F7D6D0 Accent) */}
          {room.isGuestFavourite && (
            <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#F7D6D0] text-[#4A4A4A] text-[10px] sm:text-[11px] font-bold shadow-xs tracking-tight border border-white/60">
                Guest favourite
              </span>
            </div>
          )}

          {showAvailabilityBadge && (
            <div className="absolute bottom-2.5 left-2.5 z-10 pointer-events-none">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold backdrop-blur-md shadow-xs ${isUnavailable
                  ? "bg-rose-900/90 text-brand-white"
                  : "bg-[#4A4A4A] text-brand-white"
                  }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${isUnavailable ? "bg-rose-400" : "bg-[#E2B4BD] animate-pulse"
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
            className="absolute top-2.5 right-2.5 p-1 text-brand-white hover:scale-115 active:scale-90 transition-transform cursor-pointer drop-shadow-md z-20"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${isWishlisted
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
          <h3 className="font-semibold text-[#4A4A4A] text-[13px] sm:text-[14px] leading-tight truncate group-hover:text-brand-charcoal transition-colors">
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

export const RoomCard = memo(RoomCardComponent);
export default RoomCard;
