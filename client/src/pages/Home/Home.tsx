import React, { useRef } from "react";
import { Link } from "react-router-dom";
import {
  Home as HomeIcon,
  ArrowUpRight,
  Star,
  Users,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Phone,
  Mail,
} from "lucide-react";
import { CiFacebook, CiInstagram } from "react-icons/ci";
import { FaWhatsapp } from "react-icons/fa";
import Header from "../../components/Header";

const FacebookIcon = CiFacebook as unknown as React.ElementType;
const InstagramIcon = CiInstagram as unknown as React.ElementType;
const WhatsappIcon = FaWhatsapp as unknown as React.ElementType;

interface RoomCardData {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  guests: number;
  size: string;
  bed: string;
}

const ROOMS_LIST: RoomCardData[] = [
  {
    id: "aframe",
    name: "Architectural A-Frame Chalet",
    category: "Chalet",
    price: 490,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
    guests: 4,
    size: "1,250 sq ft",
    bed: "1 King + Loft",
  },
  {
    id: "forest-villa",
    name: "Panoramic Forest Villa",
    category: "Villa",
    price: 640,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
    guests: 6,
    size: "1,850 sq ft",
    bed: "2 Kings",
  },
  {
    id: "alpine-suite",
    name: "Royal Alpine Penthouse",
    category: "Penthouse",
    price: 880,
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
    guests: 4,
    size: "2,400 sq ft",
    bed: "2 Master Suites",
  },
  {
    id: "heritage-loft",
    name: "Heritage Timber Loft",
    category: "Loft",
    price: 360,
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
    guests: 2,
    size: "880 sq ft",
    bed: "1 King",
  },
  {
    id: "mountain-chalet",
    name: "Crested Ridge Chalet",
    category: "Chalet",
    price: 520,
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80",
    guests: 4,
    size: "1,400 sq ft",
    bed: "1 King + 1 Queen",
  },
];

export const Home: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-900 font-sans selection:bg-stone-900 selection:text-white flex flex-col justify-between pb-20 md:pb-0">
      {/* Top Navbar */}
      <Header />

      {/* Main Hero Container */}
      <main className="w-full px-4 sm:px-8 lg:px-12 py-3 sm:py-6 flex-1 flex flex-col justify-center">
        <div className="max-w-7xl mx-auto w-full space-y-12 sm:space-y-16">
          {/* Eyebrow, Socials & Headline */}
          <div className="pt-2 sm:pt-4">
            <div className="flex items-start gap-3 sm:gap-6">
              {/* Left Social Icons */}
              <div className="flex flex-col items-center gap-1.5 sm:gap-2 pt-1 sm:pt-2 shrink-0">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-stone-300 bg-white hover:bg-stone-900 hover:text-white hover:border-stone-900 text-stone-700 flex items-center justify-center transition text-xs shadow-xs"
                >
                  <FacebookIcon />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-stone-300 bg-white hover:bg-stone-900 hover:text-white hover:border-stone-900 text-stone-700 flex items-center justify-center transition text-xs shadow-xs"
                >
                  <InstagramIcon />
                </a>
                <a
                  href="https://whatsapp.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-stone-300 bg-white hover:bg-stone-900 hover:text-white hover:border-stone-900 text-stone-700 flex items-center justify-center transition text-xs shadow-xs"
                >
                  <WhatsappIcon />
                </a>
              </div>

              {/* Title */}
              <div className="flex-1 min-w-0">
                <span className="text-stone-400 text-xs sm:text-sm font-medium tracking-wide block mb-1">
                  Dreams come true here
                </span>
                <h1 className="font-syne font-normal text-3xl sm:text-5xl md:text-7xl lg:text-[92px] xl:text-[108px] text-stone-900 tracking-tight leading-[0.95] select-none break-words">
                  Crafters'Haven Suites
                </h1>
              </div>
            </div>
          </div>

          {/* Hero Chalet Visual Card */}
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-stone-200 bg-stone-900 aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/9] min-h-[440px] sm:min-h-[520px]">
            <img
              src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2200&q=85"
              alt="Crafters'Haven Suites Lodge"
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

            {/* Pill Chip on Top Left */}
            <div className="absolute top-3.5 sm:top-6 left-3.5 sm:left-6 z-20 max-w-[calc(100%-2rem)]">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/95 backdrop-blur-md shadow-sm border border-white/60 text-[9px] sm:text-xs font-semibold text-stone-800 tracking-wider uppercase truncate">
                <HomeIcon className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-stone-700 shrink-0" />
                <span className="truncate">A comfortable getaway for the whole family</span>
              </div>
            </div>

            {/* Dual Floating Stat Cards on Bottom Right */}
            <div className="absolute bottom-3 sm:bottom-6 right-3 sm:right-6 left-3 sm:left-auto z-20 flex flex-row items-end justify-between sm:justify-end gap-2.5 sm:gap-3">
              {/* Card 1 */}
              <div className="flex-1 sm:flex-initial bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-lg border border-white/80 w-auto sm:w-52 text-left">
                <span className="font-syne text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight block">
                  +300
                </span>
                <p className="text-[10px] sm:text-xs text-stone-500 font-medium leading-tight mt-0.5 mb-2.5">
                  clients have left positive reviews about us.
                </p>
                <div className="flex items-center">
                  <div className="flex -space-x-1.5 overflow-hidden">
                    <img
                      className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                      alt="Guest 1"
                    />
                    <img
                      className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                      alt="Guest 2"
                    />
                    <img
                      className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                      alt="Guest 3"
                    />
                  </div>
                  <div className="ml-1.5 flex items-center gap-0.5 text-amber-500">
                    <Star className="w-2.5 h-2.5 fill-amber-500" />
                    <span className="text-[9px] font-bold text-stone-800">4.98</span>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="flex-1 sm:flex-initial bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-lg border border-white/80 w-auto sm:w-52 text-left">
                <div className="overflow-hidden rounded-xl mb-1.5 h-14 sm:h-20 w-full relative">
                  <img
                    src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=500&q=80"
                    alt="Lodge architectural angle"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-syne text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight block">
                  274
                </span>
                <p className="text-[10px] sm:text-xs text-stone-500 font-medium leading-tight mt-0.5">
                  rooms built since 2021 with designer renovations.
                </p>
              </div>
            </div>
          </div>

          {/* Compact Horizontally Scrollable Room Cards Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
                  Accommodations
                </span>
                <h2 className="font-syne text-xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                  Explore Our Rooms & Suites
                </h2>
              </div>

              {/* Slider Controls & Link */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleScrollLeft}
                  className="w-8 h-8 rounded-full border border-stone-200 bg-white hover:bg-stone-100 flex items-center justify-center text-stone-700 transition cursor-pointer"
                  aria-label="Previous room"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleScrollRight}
                  className="w-8 h-8 rounded-full border border-stone-200 bg-white hover:bg-stone-100 flex items-center justify-center text-stone-700 transition cursor-pointer"
                  aria-label="Next room"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <Link
                  to="/rooms"
                  className="hidden sm:inline-flex items-center gap-1 ml-2 text-xs font-semibold text-stone-900 hover:text-amber-700 transition"
                >
                  <span>View All</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Horizontally Scrollable Cards Container */}
            <div
              ref={scrollRef}
              className="flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth pb-3 snap-x snap-mandatory no-scrollbar"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {ROOMS_LIST.map((room) => (
                <div
                  key={room.id}
                  className="w-52 sm:w-60 md:w-64 shrink-0 snap-start bg-white rounded-2xl border border-stone-200 p-2.5 sm:p-3 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
                >
                  <div>
                    {/* Small Compact Image */}
                    <div className="relative h-28 sm:h-32 w-full overflow-hidden rounded-xl bg-stone-100 mb-2.5">
                      <img
                        src={room.image}
                        alt={room.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-stone-900/80 backdrop-blur-xs text-[8px] sm:text-[9px] font-semibold uppercase text-white tracking-wider">
                        {room.category}
                      </div>
                      <div className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-full bg-white/95 text-stone-900 font-bold text-[10px] sm:text-[11px] shadow-xs">
                        ${room.price} <span className="text-[8px] font-normal text-stone-500">/ night</span>
                      </div>
                    </div>

                    {/* Room Details */}
                    <h3 className="font-syne font-bold text-xs sm:text-sm text-stone-900 leading-snug truncate">
                      {room.name}
                    </h3>

                    <div className="mt-1 flex items-center gap-1.5 text-[10px] text-stone-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-2.5 h-2.5 text-stone-400" />
                        <span>{room.guests} Guests</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Maximize2 className="w-2.5 h-2.5 text-stone-400" />
                        <span>{room.size}</span>
                      </span>
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="pt-2 mt-2 border-t border-stone-100 flex items-center justify-between text-[10px]">
                    <span className="text-stone-500 truncate max-w-[100px]">{room.bed}</span>
                    <Link
                      to="/rooms"
                      className="inline-flex items-center gap-0.5 font-semibold text-stone-900 hover:text-amber-700 transition"
                    >
                      <span>Details</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Clean Contact & Details Strip */}
          <section id="contact" className="bg-stone-900 text-stone-300 rounded-3xl p-6 sm:p-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white mb-0.5">Location</h4>
                  <p className="text-stone-400 leading-relaxed">
                    Crafters'Haven Suites & Lodge, Alpine Pass Ridge, CO
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white mb-0.5">Direct Line</h4>
                  <p className="text-stone-400 leading-relaxed">+1 (800) 555-0199</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white mb-0.5">Concierge Desk</h4>
                  <p className="text-stone-400 leading-relaxed">concierge@craftershaven.com</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Home;