import React from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import {
  Mountain,
  Compass,
  TreePine,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Users,
} from "lucide-react";

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFF5F5] text-[#4A4A4A] font-sans selection:bg-[#4A4A4A] selection:text-white flex flex-col justify-between pb-28 md:pb-12">
      <Header />

      <main className="w-full px-4 sm:px-8 lg:px-12 py-6 sm:py-10 max-w-6xl mx-auto flex-1 space-y-16">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-4 pt-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E2B4BD]/40 text-[#4A4A4A] text-[11px] font-bold uppercase tracking-wider shadow-2xs">
            <Mountain className="w-3.5 h-3.5 text-[#4A4A4A]" />
            <span>Our Heritage & Vision</span>
          </div>

          <h1 className="font-syne text-3xl sm:text-5xl font-extrabold text-[#4A4A4A] tracking-tight leading-tight">
            Crafted for Sanctuary. Rooted in the High Alpine.
          </h1>

          <p className="text-[#4A4A4A]/75 text-sm sm:text-base leading-relaxed">
            Crafters'Haven was conceived in 2021 by a collective of high-elevation architects,
            master timber framers, and alpine naturalists. Our mission: to create intimate sanctuaries
            where human craftsmanship and the raw majesty of the mountain landscape meet in total harmony.
          </p>
        </section>

        {/* Feature Hero Image (Strictly bounded) */}
        <div className="relative w-full max-w-full rounded-3xl overflow-hidden shadow-xl border border-[#E2B4BD]/40 aspect-[16/9] max-h-[500px]">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2200&q=85"
            alt="Crafters'Haven Reserve High Lodge"
            className="w-full h-full max-w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent flex items-end p-6 sm:p-10">
            <div className="text-white max-w-xl">
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#F7D6D0] block mb-1">
                High Pines Reserve • 2,100m Elevation
              </span>
              <h3 className="font-syne text-xl sm:text-2xl font-bold">
                Where structural Douglas fir meets boundless alpine silence.
              </h3>
            </div>
          </div>
        </div>

        {/* Philosophy Pillars */}
        <section className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="font-syne text-2xl font-bold text-[#4A4A4A]">
              The Three Tenets of Haven Architecture
            </h2>
            <p className="text-[#4A4A4A]/70 text-xs sm:text-sm mt-1">
              Every chalet, penthouse, and geodesic dome adheres to our uncompromising architectural code.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E2B4BD]/40 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F7D6D0]/40 text-[#4A4A4A] flex items-center justify-center">
                <TreePine className="w-5 h-5" />
              </div>
              <h3 className="font-syne font-bold text-base text-[#4A4A4A]">
                Bioclimatic Timber Joinery
              </h3>
              <p className="text-[#4A4A4A]/75 text-xs leading-relaxed">
                Hand-hewn Douglas fir and charred Yakisugi cedar sourced exclusively from sustainable
                high-altitude forestry, interlocking without non-recyclable synthetics.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E2B4BD]/40 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F7D6D0]/40 text-[#4A4A4A] flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-syne font-bold text-base text-[#4A4A4A]">
                Acoustic & Solar Orientation
              </h3>
              <p className="text-[#4A4A4A]/75 text-xs leading-relaxed">
                Positioned with mathematical precision to maximize winter solar capture and eliminate valley
                echoes, offering total acoustic solitude across all seasons.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E2B4BD]/40 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F7D6D0]/40 text-[#4A4A4A] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-syne font-bold text-base text-[#4A4A4A]">
                Natural Thermal Rituals
              </h3>
              <p className="text-[#4A4A4A]/75 text-xs leading-relaxed">
                Wood-fired cedar barrel tubs, Finnish dry saunas, and granite fireplaces crafted with local
                river rock for authentic, restorative thermal mountain traditions.
              </p>
            </div>
          </div>
        </section>

        {/* The Host Collective */}
        <section className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E2B4BD]/40 shadow-xs flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-lg">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#F7D6D0]/40 text-[#4A4A4A] text-[10px] font-bold uppercase tracking-wider">
              <Award className="w-3 h-3 text-[#4A4A4A]" />
              <span>The Host Collective</span>
            </div>
            <h3 className="font-syne text-2xl font-bold text-[#4A4A4A]">
              Curated by dedicated alpine stewards.
            </h3>
            <p className="text-[#4A4A4A]/75 text-xs sm:text-sm leading-relaxed">
              Every host in the Crafters'Haven network is an experienced alpine resident with verified
              superhost credentials, local knowledge of secret ski routes, and a passion for bespoke hospitality.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              to="/become-a-host"
              className="px-5 py-2.5 rounded-full bg-[#4A4A4A] hover:bg-[#2D2D2D] text-white font-semibold text-xs transition cursor-pointer shadow-xs active:scale-95"
            >
              Become a Host
            </Link>
            <Link
              to="/rooms"
              className="px-5 py-2.5 rounded-full border border-[#E2B4BD]/50 hover:bg-[#F7D6D0]/30 bg-white text-[#4A4A4A] font-semibold text-xs transition cursor-pointer active:scale-95"
            >
              Explore Suites
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;
