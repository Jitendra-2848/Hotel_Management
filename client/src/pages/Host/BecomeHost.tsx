import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import {
  ShieldCheck,
  DollarSign,
  CalendarCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Building,
  Users,
} from "lucide-react";

export const BecomeHost: React.FC = () => {
  const [nightsCount, setNightsCount] = useState<number>(14);
  const [chaletType, setChaletType] = useState<string>("chalet");

  const nightlyRate = chaletType === "penthouse" ? 650 : chaletType === "villa" ? 850 : 490;
  const estimatedEarnings = nightlyRate * nightsCount;

  return (
    <div className="min-h-screen bg-[#FFF5F5] text-[#4A4A4A] font-sans selection:bg-[#4A4A4A] selection:text-white flex flex-col justify-between pb-24 md:pb-12">
      <Header />

      <main className="w-full px-4 sm:px-8 lg:px-12 py-6 sm:py-10 max-w-5xl mx-auto flex-1 space-y-16">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-4 pt-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7D6D0]/50 text-[#4A4A4A] text-[11px] font-semibold uppercase tracking-wider border border-[#E2B4BD]/40">
            <Building className="w-3.5 h-3.5 text-[#4A4A4A]" />
            <span>Host with Crafters'Haven Reserve</span>
          </div>

          <h1 className="font-syne text-3xl sm:text-5xl font-extrabold text-[#4A4A4A] tracking-tight leading-tight">
            Turn your mountain sanctuary into extraordinary income.
          </h1>

          <p className="text-[#4A4A4A]/70 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
            We partner with discerning owners of architectural chalets, summit lofts, and forest villas.
            Enjoy effortless hosting backed by our 24/7 mountain concierge network.
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              to="/host"
              className="px-6 py-3 rounded-full bg-[#4A4A4A] hover:bg-[#333333] text-white font-semibold text-xs tracking-wide transition cursor-pointer shadow-sm active:scale-95 flex items-center gap-1.5"
            >
              <span>Access Host Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* Interactive Earnings Calculator Card */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2B4BD]/40 shadow-lg max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A4A4A]/60">
              Estimated Monthly Revenue
            </span>
            <div className="font-syne text-4xl sm:text-6xl font-extrabold text-[#4A4A4A]">
              ${estimatedEarnings.toLocaleString()}
            </div>
            <p className="text-[#4A4A4A]/60 text-xs">
              Based on {nightsCount} nights booked at an average of ${nightlyRate}/night
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold text-[#4A4A4A] mb-1.5">
                <span>Nights hosted per month</span>
                <span className="font-bold text-[#4A4A4A]">{nightsCount} nights</span>
              </div>
              <input
                type="range"
                min={4}
                max={28}
                value={nightsCount}
                onChange={(e) => setNightsCount(Number(e.target.value))}
                className="w-full accent-[#4A4A4A] cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { id: "chalet", label: "Alpine Chalet", rate: "$490/n" },
                { id: "penthouse", label: "Summit Penthouse", rate: "$650/n" },
                { id: "villa", label: "Forest Estate", rate: "$850/n" },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setChaletType(type.id)}
                  className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                    chaletType === type.id
                      ? "border-[#4A4A4A] bg-[#4A4A4A] text-white font-semibold shadow-xs"
                      : "border-[#E2B4BD]/40 bg-[#FFF5F5]/60 text-[#4A4A4A] hover:bg-[#F7D6D0]/30"
                  }`}
                >
                  <div className="text-xs">{type.label}</div>
                  <div className="text-[10px] opacity-75 mt-0.5">{type.rate}</div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* The Crafters'Haven Host Guarantee */}
        <section className="space-y-6">
          <div className="text-center max-w-lg mx-auto">
            <h2 className="font-syne text-2xl font-bold text-[#4A4A4A]">
              Top-Tier Protection for Every Host
            </h2>
            <p className="text-[#4A4A4A]/70 text-xs mt-1">
              Hosting without stress. Everything is covered from arrival to departure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-[#E2B4BD]/40 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F7D6D0]/50 text-[#4A4A4A] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-syne font-bold text-base text-[#4A4A4A]">
                $3,000,000 HavenCover
              </h3>
              <p className="text-[#4A4A4A]/80 text-xs leading-relaxed">
                Comprehensive damage protection including fine art, architectural woodwork, heated spas,
                and rare amenities.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E2B4BD]/40 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F7D6D0]/50 text-[#4A4A4A] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-syne font-bold text-base text-[#4A4A4A]">
                Vetted High-Profile Guests
              </h3>
              <p className="text-[#4A4A4A]/80 text-xs leading-relaxed">
                Every guest undergoes multi-point identity verification and background security before
                gaining access to your private residence.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E2B4BD]/40 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F7D6D0]/50 text-[#4A4A4A] flex items-center justify-center">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <h3 className="font-syne font-bold text-base text-[#4A4A4A]">
                Full Concierge Dispatch
              </h3>
              <p className="text-[#4A4A4A]/80 text-xs leading-relaxed">
                We handle check-ins, snow-clearing logistics, artisan linen changes, and fire hearth restocking
                so you never have to be on call.
              </p>
            </div>
          </div>
        </section>

        {/* Action Banner to Host Dashboard */}
        <section className="bg-[#4A4A4A] text-white rounded-3xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <h3 className="font-syne text-2xl font-bold">Already a registered host?</h3>
            <p className="text-white/80 text-xs sm:text-sm">
              Log in to your host administration dashboard to toggle suite availability, view occupancy metrics, and manage earnings.
            </p>
          </div>

          <Link
            to="/host"
            className="px-6 py-3 rounded-full bg-white text-[#4A4A4A] hover:bg-[#FFF5F5] font-semibold text-xs transition cursor-pointer shrink-0 active:scale-95 shadow-md"
          >
            Open Host Portal
          </Link>
        </section>
      </main>
    </div>
  );
};

export default BecomeHost;
