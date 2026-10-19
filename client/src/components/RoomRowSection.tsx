import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import RoomCard, { CompactRoomItem } from "./RoomCard";

interface RoomRowSectionProps {
  title: string;
  subtitle?: string;
  viewAllLink?: string;
  rooms: CompactRoomItem[];
}

export const RoomRowSection: React.FC<RoomRowSectionProps> = ({
  title,
  subtitle,
  viewAllLink = "/rooms",
  rooms,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="space-y-3 sm:space-y-4 py-2">
      {/* Header with Title -> and Chevrons */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            to={viewAllLink}
            className="inline-flex items-center gap-1.5 font-bold tracking-tight text-lg sm:text-2xl text-[#4A4A4A] hover:text-[#2D2D2D] transition group font-syne"
          >
            <span>{title}</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          {subtitle && (
            <p className="text-xs text-[#4A4A4A]/70 font-normal mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Chevron buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleScroll("left")}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#E2B4BD]/60 bg-white hover:bg-[#F7D6D0]/30 hover:border-[#4A4A4A] flex items-center justify-center text-[#4A4A4A] transition cursor-pointer active:scale-90 shadow-2xs"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll("right")}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#E2B4BD]/60 bg-white hover:bg-[#F7D6D0]/30 hover:border-[#4A4A4A] flex items-center justify-center text-[#4A4A4A] transition cursor-pointer active:scale-90 shadow-2xs"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Cards Row (Native touchpad / touch swipe + arrow buttons) */}
      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-none -mx-3.5 px-3.5 sm:mx-0 sm:px-0 scroll-smooth snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {rooms.map((room) => (
          <div key={room.id} className="snap-start shrink-0">
            <RoomCard room={room} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default RoomRowSection;
