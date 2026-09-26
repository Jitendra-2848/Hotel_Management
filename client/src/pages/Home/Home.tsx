import React from "react";
import { Link } from "react-router-dom";
import {
  Home as HomeIcon,
  Star,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { CiFacebook, CiInstagram } from "react-icons/ci";
import { FaWhatsapp } from "react-icons/fa";
import Header from "../../components/Header";
import RoomRowSection from "../../components/RoomRowSection";
import SearchBar from "../../components/SearchBar";
import { CURATED_ROOMS } from "../../data/roomsData";
import { roomsApi } from "../../lib/api";
import { updateSEO } from "../../util/seo";

const FacebookIcon = CiFacebook as unknown as React.ElementType;
const InstagramIcon = CiInstagram as unknown as React.ElementType;
const WhatsappIcon = FaWhatsapp as unknown as React.ElementType;

export const Home: React.FC = () => {
  const [rooms, setRooms] = React.useState<any[]>(CURATED_ROOMS);

  React.useEffect(() => {
    window.scrollTo(0, 0);
    updateSEO(
      "Crafters'Haven | Luxury Mountain Sanctuaries, Chalets & Suites",
      "Escape to Crafters'Haven. Experience luxury mountain chalets, serene sanctuaries, premium suites, and unforgettable hospitality. Book your perfect stay today."
    );
    roomsApi.getAll().then((data) => {
      if (data && data.length > 0) {
        setRooms(
          data.map((r) => ({
            ...r,
            locationTitle: `${r.category.charAt(0).toUpperCase() + r.category.slice(1)} • ${r.elevation || "Alpine Reserve"}`,
            image: r.featuredImage || (r.gallery && r.gallery[0]) || "",
            nightsText: "for 2 nights",
            isGuestFavourite: r.rating >= 4.95,
          }))
        );
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF5F5] text-[#4A4A4A] font-sans selection:bg-[#4A4A4A] selection:text-brand-white flex flex-col justify-between pb-24 md:pb-12">
      {/* Top Navbar */}
      <Header />

      {/* Main Hero Container */}
      <main className="w-full px-3.5 sm:px-8 lg:px-12 py-3 sm:py-6 flex-1 flex flex-col justify-center">
        <div className="max-w-7xl mx-auto w-full space-y-12 sm:space-y-16">
          {/* Eyebrow, Socials & Headline */}
          <div className="pt-2 sm:pt-4">
            <div className="flex items-start gap-3 sm:gap-6">
              {/* Left Social Icons */}
              <div className="flex flex-col items-center gap-1.5 sm:gap-2 pt-1 sm:pt-2 shrink-0">
                <Link
                  to="/about"
                  title="Crafters'Haven Community"
                  aria-label="Facebook"
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-[#E2B4BD]/50 bg-white hover:bg-[#4A4A4A] hover:text-brand-white hover:border-[#4A4A4A] text-[#4A4A4A] flex items-center justify-center transition text-xs shadow-xs"
                >
                  <FacebookIcon />
                </Link>
                <Link
                  to="/about"
                  title="Crafters'Haven Visual Journal"
                  aria-label="Instagram"
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-[#E2B4BD]/50 bg-white hover:bg-[#4A4A4A] hover:text-brand-white hover:border-[#4A4A4A] text-[#4A4A4A] flex items-center justify-center transition text-xs shadow-xs"
                >
                  <InstagramIcon />
                </Link>
                <Link
                  to="/about"
                  title="Direct Concierge Inquiries"
                  aria-label="WhatsApp"
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-[#E2B4BD]/50 bg-white hover:bg-[#4A4A4A] hover:text-brand-white hover:border-[#4A4A4A] text-[#4A4A4A] flex items-center justify-center transition text-xs shadow-xs"
                >
                  <WhatsappIcon />
                </Link>
              </div>

              {/* Title */}
              <div className="flex-1 min-w-0">
                <span className="text-[#4A4A4A]/80 text-xs sm:text-sm font-semibold tracking-wider uppercase block mb-1">
                  Verified Mountain Stays & Alpine Chalets
                </span>
                <h1 className="font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-[#4A4A4A] tracking-tight leading-[1.05] select-none">
                  Crafters'Haven
                </h1>
              </div>
            </div>
          </div>

          {/* Hero Chalet Visual Card (Strictly bounded responsive layout) */}
          <div className="relative select-none w-full max-w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-[#E2B4BD]/40 bg-[#2D2D2D] h-[320px] sm:h-[440px] md:h-[500px]">
            <img
              src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2200&q=85"
              alt="Crafters'Haven Suites Lodge"
              className="w-full h-full max-w-full object-cover object-center"
              loading="lazy"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

            {/* Pill Chip on Top Left */}
            <div className="absolute top-3 sm:top-6 left-3 sm:left-6 z-20 max-w-[calc(100%-1.5rem)]">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/95 backdrop-blur-md shadow-sm border border-[#E2B4BD]/40 text-[10px] sm:text-xs font-semibold text-[#4A4A4A] tracking-wide uppercase truncate">
                <HomeIcon className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#4A4A4A] shrink-0" />
                <span className="truncate">High Pines Reserve • Alpine Lodges</span>
              </div>
            </div>

            {/* Dual Floating Stat Cards on Bottom Right (Responsive layout) */}
            <div className="absolute bottom-3 sm:bottom-6 right-3 sm:right-6 left-3 sm:left-auto z-20 flex flex-row items-end justify-between sm:justify-end gap-2.5 sm:gap-3 max-w-[calc(100%-1.5rem)]">
              {/* Card 1 */}
              <div className="flex-1 sm:flex-initial bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-lg border border-[#E2B4BD]/40 w-auto sm:w-52 text-left">
                <span className="text-xl sm:text-2xl font-bold text-[#4A4A4A] tracking-tight block tabular-nums">
                  50+
                </span>
                <p className="text-[10px] sm:text-xs text-[#4A4A4A]/70 font-medium leading-tight mt-0.5 mb-2">
                  Curated chalets & architectural mountain cabins.
                </p>
                <div className="flex items-center gap-1.5 text-[#4A4A4A]">
                  <Star className="w-3 h-3 fill-[#4A4A4A]" />
                  <span className="text-[11px] font-bold text-[#4A4A4A] tabular-nums">4.92 Average Rating</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="hidden sm:block bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-lg border border-[#E2B4BD]/40 w-52 text-left">
                <div className="overflow-hidden rounded-xl mb-1.5 h-16 w-full relative">
                  <img
                    src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=500&q=80"
                    alt="Lodge architectural angle"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xl sm:text-2xl font-bold text-[#4A4A4A] tracking-tight block tabular-nums">
                  100%
                </span>
                <p className="text-[10px] sm:text-xs text-[#4A4A4A]/70 font-medium leading-tight mt-0.5">
                  Verified hosts & certified mountain properties.
                </p>
              </div>
            </div>
          </div>

          {/* Floating Search Filter Bar */}
          <div className="py-2">
            <SearchBar />
          </div>

          {/* Multi-Row Room Showcase */}
          <div className="space-y-8 sm:space-y-12">
            {/* Row 1: Guest Favourites */}
            <RoomRowSection
              title="Guest favourites this weekend"
              subtitle="The highest-rated chalets, penthouses, and sanctuaries in Crafters'Haven"
              viewAllLink="/rooms"
              rooms={rooms.filter((r) => r.isGuestFavourite)}
            />

            {/* Row 2: Alpine Chalets */}
            <RoomRowSection
              title="Alpine Chalets in High Pines"
              subtitle="Wood-burning stone hearths, private heated cedar tubs, and ski-in access"
              viewAllLink="/rooms"
              rooms={rooms.filter((r) => r.category === "chalet")}
            />

            {/* Row 3: Summit Penthouses & Skyline Views */}
            <RoomRowSection
              title="Summit Penthouses & Skyline Views"
              subtitle="270° to 360° panoramic glass at 2,800m elevation with private Finnish saunas"
              viewAllLink="/rooms"
              rooms={rooms.filter((r) => r.category === "penthouse")}
            />

            {/* Row 4: Forest Villas & Stream Sanctuaries */}
            <RoomRowSection
              title="Forest Villas & Stream Sanctuaries"
              subtitle="Secluded estates with riverside wrap-around decks and outdoor plunge spas"
              viewAllLink="/rooms"
              rooms={rooms.filter((r) => r.category === "villa")}
            />

            {/* Row 5: Celestial Eco-Domes & Artisan Lofts */}
            <RoomRowSection
              title="Celestial Eco-Domes & Artisan Lofts"
              subtitle="Heated geodesic glass observatory domes and industrial timber ateliers"
              viewAllLink="/rooms"
              rooms={rooms.filter((r) => r.category === "dome" || r.category === "loft")}
            />
          </div>

          {/* Clean Contact & Details Strip */}
          {/* <section id="contact" className="bg-white text-[#4A4A4A] border border-[#E2B4BD]/40 rounded-3xl p-6 sm:p-10 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#F7D6D0]/40 text-[#4A4A4A] flex items-center justify-center shrink-0 shadow-xs border border-[#E2B4BD]/30">
                  <MapPin className="w-4 h-4 text-[#4A4A4A]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#4A4A4A] mb-0.5">Location</h4>
                  <p className="text-[#4A4A4A]/70 leading-relaxed">
                    Crafters'Haven Suites & Lodge, Alpine Pass Ridge, CO
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#F7D6D0]/40 text-[#4A4A4A] flex items-center justify-center shrink-0 shadow-xs border border-[#E2B4BD]/30">
                  <Phone className="w-4 h-4 text-[#4A4A4A]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#4A4A4A] mb-0.5">Direct Line</h4>
                  <p className="text-[#4A4A4A]/70 leading-relaxed">+1 (800) 555-0199</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#F7D6D0]/40 text-[#4A4A4A] flex items-center justify-center shrink-0 shadow-xs border border-[#E2B4BD]/30">
                  <Mail className="w-4 h-4 text-[#4A4A4A]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#4A4A4A] mb-0.5">Concierge Desk</h4>
                  <p className="text-[#4A4A4A]/70 leading-relaxed">concierge@craftershaven.com</p>
                </div>
              </div>
            </div>
          </section> */}
        </div>
      </main>
    </div>
  );
};

export default Home;