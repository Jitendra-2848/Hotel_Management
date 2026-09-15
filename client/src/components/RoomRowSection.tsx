import React, { useRef, useState } from "react";
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
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.4;
    if (Math.abs(walk) > 5) {
      setHasMoved(true);
    }
    scrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
    setTimeout(() => setHasMoved(false), 50);
  };

  // Touch handlers
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchScrollLeft, setTouchScrollLeft] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollRef.current) return;
    setTouchStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
    setTouchScrollLeft(scrollRef.current.scrollLeft);
    setHasMoved(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!scrollRef.current) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - touchStartX) * 1.2;
    if (Math.abs(walk) > 5) {
      setHasMoved(true);
    }
    scrollRef.current.scrollLeft = touchScrollLeft - walk;
  };

  return (
    <section className="space-y-3 sm:space-y-4 py-2">
      {/* Header with Title -> and Chevrons */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            to={viewAllLink}
            className="inline-flex items-center gap-1.5 font-syne font-bold text-lg sm:text-2xl text-stone-900 hover:text-stone-700 transition group"
          >
            <span>{title}</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          {subtitle && (
            <p className="text-xs text-stone-500 font-normal mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Chevron buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleScroll("left")}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-stone-300 bg-white hover:bg-stone-100 flex items-center justify-center text-stone-700 transition cursor-pointer active:scale-90 shadow-2xs"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll("right")}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-stone-300 bg-white hover:bg-stone-100 flex items-center justify-center text-stone-700 transition cursor-pointer active:scale-90 shadow-2xs"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Cards Row */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUpOrLeave}
        className={`flex gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-none ${
          isDragging
            ? "cursor-grabbing select-none scroll-auto"
            : "cursor-grab scroll-smooth snap-x snap-mandatory"
        }`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {rooms.map((room) => (
          <div key={room.id} className="snap-start shrink-0">
            <RoomCard room={room} hasMoved={hasMoved} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default RoomRowSection;
