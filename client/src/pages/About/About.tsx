import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import {
  Mountain,
  Compass,
  TreePine,
  Sparkles,
  Award,
  ShieldCheck,
  Flame,
  Globe2,
  HeartHandshake,
  ArrowUpRight,
  CheckCircle2,
  Sun,
  Leaf,
  Users,
} from "lucide-react";

export const About: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF5F5] text-[#4A4A4A] font-sans selection:bg-[#4A4A4A] selection:text-white flex flex-col justify-between pb-28 md:pb-16">
      <Header />

      <main className="w-full px-4 sm:px-8 lg:px-12 py-8 sm:py-12 max-w-6xl mx-auto flex-1 space-y-16 sm:space-y-20">
        {/* 1. Editorial Hero Header */}
        <section className="text-center max-w-3xl mx-auto space-y-4 pt-2 sm:pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F7D6D0]/50 border border-[#E2B4BD]/50 text-[#4A4A4A] text-[11px] font-bold uppercase tracking-wider shadow-2xs">
            <Mountain className="w-3.5 h-3.5 text-[#4A4A4A]" />
            <span>Our Heritage & Philosophy</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#4A4A4A] tracking-tight font-syne leading-[1.1]">
            Architecture in Dialogue with the Wild Alpine.
          </h1>

          <p className="text-[#4A4A4A]/80 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Founded in 2018 in the Zermatt Valley, Crafters'Haven was created to bridge human craftsmanship
            with untamed high-altitude wilderness. We curate singular alpine chalets, summit penthouses, and
            stargazing domes designed for profound quiet and restorative solitude.
          </p>
        </section>

        {/* 2. Visual Story Mosaic Gallery */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
          <div className="md:col-span-8 relative rounded-3xl overflow-hidden shadow-lg border border-[#E2B4BD]/40 min-h-[320px] sm:min-h-[440px] bg-[#2A2A2A] group">
            <img
              src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=85"
              alt="Crafters'Haven Alpine Timber Lodge"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#F7D6D0] mb-1">
                Zermatt Ridge Sanctuary • Elevation 2,150m
              </span>
              <h3 className="text-lg sm:text-2xl font-bold font-syne leading-snug">
                "We do not build to conquer the mountain. We build so the mountain may speak."
              </h3>
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col gap-4 sm:gap-6">
            <div className="relative rounded-3xl overflow-hidden shadow-md border border-[#E2B4BD]/40 min-h-[180px] sm:min-h-[205px] bg-[#2A2A2A] group flex-1">
              <img
                src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80"
                alt="Wood craftsmanship and cedar tubs"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-5 text-white">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#F7D6D0]">Natural Cedar</span>
                  <p className="text-xs font-bold font-syne">Hand-hewn timber and thermal hot tubs</p>
                </div>
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-md border border-[#E2B4BD]/40 min-h-[180px] sm:min-h-[205px] bg-[#2A2A2A] group flex-1">
              <img
                src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80"
                alt="Celestial Night Sky Corridor"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-5 text-white">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#F7D6D0]">Dark-Sky Sanctuaries</span>
                  <p className="text-xs font-bold font-syne">Zero light pollution eco-domes</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Key Numbers & Metrics Bar */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2B4BD]/40 shadow-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-[#E2B4BD]/30">
            <div className="pt-2 sm:pt-0">
              <div className="text-3xl sm:text-4xl font-extrabold font-syne text-[#4A4A4A]">8</div>
              <span className="text-xs font-bold text-[#4A4A4A] mt-1 block">Verified Suites</span>
              <p className="text-[11px] text-[#4A4A4A]/60 mt-0.5">Independently operated</p>
            </div>

            <div className="pt-4 sm:pt-0">
              <div className="text-3xl sm:text-4xl font-extrabold font-syne text-[#4A4A4A]">2,480m</div>
              <span className="text-xs font-bold text-[#4A4A4A] mt-1 block">Peak Elevation</span>
              <p className="text-[11px] text-[#4A4A4A]/60 mt-0.5">High-altitude vantage</p>
            </div>

            <div className="pt-4 sm:pt-0">
              <div className="text-3xl sm:text-4xl font-extrabold font-syne text-[#4A4A4A]">100%</div>
              <span className="text-xs font-bold text-[#4A4A4A] mt-1 block">Carbon Offset</span>
              <p className="text-[11px] text-[#4A4A4A]/60 mt-0.5">Hydro & solar powered</p>
            </div>

            <div className="pt-4 sm:pt-0">
              <div className="text-3xl sm:text-4xl font-extrabold font-syne text-[#4A4A4A]">4.97★</div>
              <span className="text-xs font-bold text-[#4A4A4A] mt-1 block">Guest Excellence</span>
              <p className="text-[11px] text-[#4A4A4A]/60 mt-0.5">Across 1,200+ stays</p>
            </div>
          </div>
        </section>

        {/* 4. The Four Pillars of Our Craft */}
        <section className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold font-syne text-[#4A4A4A] tracking-tight">
              The Four Tenets of Crafters'Haven
            </h2>
            <p className="text-xs sm:text-sm text-[#4A4A4A]/70 leading-relaxed">
              Every accommodation in our reserve is curated according to strict architectural and environmental standards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E2B4BD]/40 shadow-xs space-y-3 hover:border-[#4A4A4A] transition">
              <div className="w-11 h-11 rounded-2xl bg-[#F7D6D0]/40 text-[#4A4A4A] flex items-center justify-center">
                <TreePine className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base font-syne text-[#4A4A4A] tracking-tight">
                Architectural Timber
              </h3>
              <p className="text-[#4A4A4A]/75 text-xs leading-relaxed">
                Hand-hewn Douglas fir beams, regional cedar paneling, and natural basalt stone hearths crafted by master carpenters.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E2B4BD]/40 shadow-xs space-y-3 hover:border-[#4A4A4A] transition">
              <div className="w-11 h-11 rounded-2xl bg-[#F7D6D0]/40 text-[#4A4A4A] flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base font-syne text-[#4A4A4A] tracking-tight">
                Panoramic Light
              </h3>
              <p className="text-[#4A4A4A]/75 text-xs leading-relaxed">
                Floor-to-ceiling triple-glazed walls aligned with the solar path to maximize natural alpine warmth and valley sunsets.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E2B4BD]/40 shadow-xs space-y-3 hover:border-[#4A4A4A] transition">
              <div className="w-11 h-11 rounded-2xl bg-[#F7D6D0]/40 text-[#4A4A4A] flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base font-syne text-[#4A4A4A] tracking-tight">
                Thermal Solitude
              </h3>
              <p className="text-[#4A4A4A]/75 text-xs leading-relaxed">
                Wood-fired cedar barrel hot tubs and dry Finnish saunas pre-heated before arrival with dried seasoned birch timber.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E2B4BD]/40 shadow-xs space-y-3 hover:border-[#4A4A4A] transition">
              <div className="w-11 h-11 rounded-2xl bg-[#F7D6D0]/40 text-[#4A4A4A] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base font-syne text-[#4A4A4A] tracking-tight">
                Discreet Concierge
              </h3>
              <p className="text-[#4A4A4A]/75 text-xs leading-relaxed">
                Keyless smart access, luggage transfers, private ski fittings, and artisan breakfast provisions without intrusion.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Our Story & Timeline */}
        <section className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E2B4BD]/40 shadow-xs space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#4A4A4A]/60">The Journey</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-syne text-[#4A4A4A]">
              From a Single Cabin to an Alpine Collective
            </h2>
            <p className="text-xs sm:text-sm text-[#4A4A4A]/70 leading-relaxed">
              Our growth has always been intentional. We reject mass resort developments in favor of small-footprint,
              architecturally significant sanctuaries.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
            <div className="p-4 rounded-2xl bg-[#FFF5F5] border border-[#E2B4BD]/40 space-y-2">
              <span className="text-xs font-mono font-bold text-[#4A4A4A] px-2 py-0.5 rounded-md bg-white border border-[#E2B4BD]/40">
                2018
              </span>
              <h4 className="font-bold text-sm font-syne text-[#4A4A4A]">The Zermatt Cabin</h4>
              <p className="text-xs text-[#4A4A4A]/75 leading-relaxed">
                Built by hand as a carpenter's personal high-altitude studio, welcoming its first design travelers.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF5F5] border border-[#E2B4BD]/40 space-y-2">
              <span className="text-xs font-mono font-bold text-[#4A4A4A] px-2 py-0.5 rounded-md bg-white border border-[#E2B4BD]/40">
                2021
              </span>
              <h4 className="font-bold text-sm font-syne text-[#4A4A4A]">Celestial Eco-Domes</h4>
              <p className="text-xs text-[#4A4A4A]/75 leading-relaxed">
                Engineered 360° geodesic glass hemispheres for zero light pollution stargazing at 2,350 meters.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF5F5] border border-[#E2B4BD]/40 space-y-2">
              <span className="text-xs font-mono font-bold text-[#4A4A4A] px-2 py-0.5 rounded-md bg-white border border-[#E2B4BD]/40">
                2024
              </span>
              <h4 className="font-bold text-sm font-syne text-[#4A4A4A]">Summit Penthouses</h4>
              <p className="text-xs text-[#4A4A4A]/75 leading-relaxed">
                Expanded into cantilevered architectural summit residences powered by geothermal heat pumps.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF5F5] border border-[#E2B4BD]/40 space-y-2">
              <span className="text-xs font-mono font-bold text-[#4A4A4A] px-2 py-0.5 rounded-md bg-white border border-[#E2B4BD]/40">
                2026
              </span>
              <h4 className="font-bold text-sm font-syne text-[#4A4A4A]">The Reserve Portal</h4>
              <p className="text-xs text-[#4A4A4A]/75 leading-relaxed">
                Unveiled our seamless express reservation platform and bespoke concierge guest profile system.
              </p>
            </div>
          </div>
        </section>

        {/* 6. Environmental Stewardship & Community Charter */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E2B4BD]/40 shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Leaf className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base font-syne text-[#4A4A4A]">100% Circular Timber</h3>
            <p className="text-xs text-[#4A4A4A]/75 leading-relaxed">
              Every timber beam is responsibly harvested from managed regional forests or salvaged from historic alpine barns.
            </p>
          </div>

          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E2B4BD]/40 shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Sun className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base font-syne text-[#4A4A4A]">Passive Energy Design</h3>
            <p className="text-xs text-[#4A4A4A]/75 leading-relaxed">
              Geothermal heating and high-efficiency solar battery storage maintain 22°C interior comfort even in -20°C alpine winter storms.
            </p>
          </div>

          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E2B4BD]/40 shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base font-syne text-[#4A4A4A]">Local Community Sourcing</h3>
            <p className="text-xs text-[#4A4A4A]/75 leading-relaxed">
              We partner directly with valley bakers, alpine cheesemakers, and local mountain guides to invest back into mountain towns.
            </p>
          </div>
        </section>

        {/* 7. Call to Action Banner */}
        <section className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E2B4BD]/40 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#F7D6D0]/40 text-[#4A4A4A] text-[10px] font-bold uppercase tracking-wider">
              <Award className="w-3 h-3 text-[#4A4A4A]" />
              <span>Experience The Reserve</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-syne text-[#4A4A4A] tracking-tight">
              Ready to immerse yourself in mountain stillness?
            </h3>
            <p className="text-[#4A4A4A]/75 text-xs sm:text-sm leading-relaxed">
              Explore our 8 curated sanctuaries or review our guest assistance guide before crafting your stay.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              to="/rooms"
              className="px-6 py-3 rounded-full bg-[#4A4A4A] hover:bg-[#2D2D2D] text-white font-semibold text-xs transition cursor-pointer shadow-md shadow-[#4A4A4A]/20 active:scale-95 flex items-center gap-1.5"
            >
              <span>Explore Curated Suites</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/faqs"
              className="px-6 py-3 rounded-full border border-[#E2B4BD]/60 hover:bg-[#F7D6D0]/30 bg-white text-[#4A4A4A] font-semibold text-xs transition cursor-pointer active:scale-95"
            >
              Frequently Asked Questions
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;
