import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import { updateSEO } from "../../util/seo";
import {
  HelpCircle,
  Search,
  ChevronDown,
  CalendarCheck,
  KeyRound,
  Sparkles,
  Phone,
  Compass,
  ArrowUpRight,
  X,
  ShieldCheck,
  Flame,
} from "lucide-react";

interface FAQItem {
  id: string;
  category: "booking" | "arrival" | "amenities" | "concierge";
  categoryLabel: string;
  question: string;
  answer: string;
  highlight?: string;
  tags: string[];
}

const FAQ_DATA: FAQItem[] = [
  // Category 1: Booking & Policies
  {
    id: "booking-cancellation",
    category: "booking",
    categoryLabel: "Booking & Policies",
    question: "What is the Crafters'Haven cancellation and refund policy?",
    answer:
      "Full refunds are available for reservations cancelled at least 7 days before check-in. Stays cancelled between 7 days and 48 hours prior to check-in receive a 50% refund or a 100% reservation credit valid for 18 months. Cancellations made within 48 hours are non-refundable due to the preparation of custom amenities.",
    highlight: "100% refund up to 7 days before arrival; flexible credit rebooking within 18 months.",
    tags: ["cancellation", "refund", "deposit", "policy", "terms", "changes"],
  },
  {
    id: "booking-deposit",
    category: "booking",
    categoryLabel: "Booking & Policies",
    question: "Is there a security deposit required for booking?",
    answer:
      "A temporary pre-authorization hold of $250 (or local equivalent) is placed on your payment card 24 hours before check-in. The hold is automatically released within 48 hours after departure following our routine checkout inspection.",
    highlight: "Standard $250 pre-authorization released promptly after check-out.",
    tags: ["deposit", "security", "hold", "credit card", "payment"],
  },
  {
    id: "booking-payment-methods",
    category: "booking",
    categoryLabel: "Booking & Policies",
    question: "What payment methods are supported for reservations?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express), Apple Pay, Google Pay, and direct bank transfers for stays exceeding 5 nights.",
    highlight: "Major credit cards, Apple Pay, and Google Pay supported.",
    tags: ["payment", "methods", "visa", "apple pay", "cards"],
  },

  // Category 2: Arrival & Access
  {
    id: "arrival-times",
    category: "arrival",
    categoryLabel: "Arrival & Access",
    question: "What are the standard check-in and checkout times?",
    answer:
      "Check-in begins at 3:00 PM and checkout is at 11:00 AM. Early arrivals (from 12:00 PM) and extended late checkouts (until 2:00 PM) may be requested via your guest portal and are accommodated based on availability.",
    highlight: "Check-in: 3:00 PM • Checkout: 11:00 AM • Complimentary luggage drop available.",
    tags: ["check-in", "checkout", "timing", "early arrival", "late checkout"],
  },
  {
    id: "arrival-keyless",
    category: "arrival",
    categoryLabel: "Arrival & Access",
    question: "How does keyless digital self check-in work?",
    answer:
      "48 hours prior to arrival, you will receive a secure encrypted digital access code and mobile entry key via SMS and email. Simply enter your private pin on the smart keypad at the property entrance for instant entry at any hour.",
    highlight: "24/7 self check-in enabled with private encrypted keypad PIN.",
    tags: ["keyless", "smart lock", "entry code", "access", "self check-in", "late arrival"],
  },
  {
    id: "arrival-parking-transport",
    category: "arrival",
    categoryLabel: "Arrival & Access",
    question: "Is vehicle parking and winter road access provided?",
    answer:
      "Every suite includes a dedicated heated parking bay with universal Level 2 EV charging. During winter months (Nov–April), all access roads and private driveways are plowed twice daily. AWD/4WD vehicles or snow chains are recommended for summit properties.",
    highlight: "Free heated parking & EV charging included with twice-daily snow clearing.",
    tags: ["parking", "ev charger", "winter", "roads", "snow", "4wd"],
  },

  // Category 3: Comfort & Amenities
  {
    id: "amenities-hot-tub",
    category: "amenities",
    categoryLabel: "Comfort & Amenities",
    question: "Are private hot tubs and saunas pre-heated before arrival?",
    answer:
      "Yes. Our cedar barrel hot tubs and Finnish panoramic saunas are maintained at optimal soaking temperatures (39°C / 102°F) year-round. Our mountain maintenance team prepares and sanitizes every installation before your arrival.",
    highlight: "Hot tubs pre-heated to 39°C and private saunas ready on arrival.",
    tags: ["hot tub", "sauna", "spa", "cedar", "temperature", "relaxation"],
  },
  {
    id: "amenities-wifi-work",
    category: "amenities",
    categoryLabel: "Comfort & Amenities",
    question: "What is the Wi-Fi speed and is the space suitable for remote work?",
    answer:
      "All Crafters'Haven sanctuaries feature redundant high-speed fiber internet (150–300 Mbps download & upload) alongside ergonomic workstations, secondary monitors upon request, and multi-region power adaptors.",
    highlight: "High-speed fiber (150+ Mbps) and dedicated ergonomic workspaces.",
    tags: ["wifi", "internet", "remote work", "speed", "workstation"],
  },
  {
    id: "amenities-fireplace-heating",
    category: "amenities",
    categoryLabel: "Comfort & Amenities",
    question: "How are the properties heated during winter?",
    answer:
      "Properties combine radiant in-floor geothermal heating with authentic Norwegian cast-iron wood fireplaces. Seasoned birch firewood, natural fire-starters, and kindle are replenished daily by our groundskeeping staff.",
    highlight: "Radiant floor heating + unlimited seasoned birch firewood provided.",
    tags: ["fireplace", "heating", "wood", "winter", "temperature", "cozy"],
  },

  // Category 4: Concierge & Experiences
  {
    id: "concierge-dining",
    category: "concierge",
    categoryLabel: "Concierge Services",
    question: "Can private chefs or local grocery provisions be arranged?",
    answer:
      "Yes. Our bespoke culinary concierge can arrange private in-chalet multi-course dining by acclaimed regional chefs, as well as artisanal breakfast baskets and refrigerator pre-stocking with farm-fresh mountain goods prior to your arrival.",
    highlight: "In-chalet private dining & farm-fresh refrigerator stocking upon request.",
    tags: ["chef", "dining", "breakfast", "groceries", "food", "catering"],
  },
  {
    id: "concierge-ski-outdoor",
    category: "concierge",
    categoryLabel: "Concierge Services",
    question: "Do you provide ski-in/ski-out assistance and guided alpine tours?",
    answer:
      "Select ridge properties feature direct ski-in/ski-out trail access. Our concierge team can coordinate private certified ski guides, helicopter glacier transfers, snowshoe equipment delivery, and bespoke mountaineering itineraries.",
    highlight: "Private ski guides, equipment delivery, and helicopter transfers coordinated.",
    tags: ["ski", "snowboard", "guides", "hiking", "activities", "tours"],
  },
];

const CATEGORIES = [
  { id: "all", label: "All Topics", icon: Sparkles },
  { id: "booking", label: "Booking & Policies", icon: CalendarCheck },
  { id: "arrival", label: "Arrival & Access", icon: KeyRound },
  { id: "amenities", label: "Comfort & Amenities", icon: Flame },
  { id: "concierge", label: "Concierge Services", icon: Compass },
];

export const FAQs: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openIndex, setOpenIndex] = useState<string | null>("booking-cancellation");

  useEffect(() => {
    updateSEO(
      "FAQs | Crafters'Haven",
      "Find answers to frequently asked questions about booking, arrival check-in, amenities, and concierge services at Crafters'Haven."
    );
  }, []);

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.category === activeCategory;
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesCategory;

      const matchesQuery =
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        item.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        (item.highlight && item.highlight.toLowerCase().includes(query));

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, searchQuery]);

  const toggleFAQ = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#FFF5F5] text-[#4A4A4A] font-sans selection:bg-[#4A4A4A] selection:text-white flex flex-col justify-between pb-24 md:pb-12">
      <Header />

      <main className="w-full px-4 sm:px-8 lg:px-12 py-6 sm:py-10 max-w-5xl mx-auto flex-1 space-y-8">
        {/* Header Hero Section */}
        <section className="text-center max-w-2xl mx-auto space-y-3 pt-2 sm:pt-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7D6D0]/50 text-[#4A4A4A] text-[11px] font-bold uppercase tracking-wider border border-[#E2B4BD]/40 shadow-2xs">
            <HelpCircle className="w-3.5 h-3.5 text-[#4A4A4A]" />
            <span>Guest Assistance & Guidance</span>
          </div>

          <h1 className="font-extrabold text-3xl sm:text-4xl text-[#4A4A4A] tracking-tight font-syne">
            Frequently Asked Questions
          </h1>

          <p className="text-[#4A4A4A]/75 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
            Everything you need to know about reserving, arriving at, and experiencing your Crafters'Haven
            mountain retreat.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              const count =
                cat.id === "all"
                  ? FAQ_DATA.length
                  : FAQ_DATA.filter((i) => i.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer active:scale-95 shadow-2xs ${
                    isActive
                      ? "bg-[#4A4A4A] text-white shadow-xs"
                      : "bg-white text-[#4A4A4A] border border-[#E2B4BD]/40 hover:bg-[#F7D6D0]/30"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-[#4A4A4A]"}`} />
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? "bg-white/20 text-white" : "bg-[#F7D6D0]/40 text-[#4A4A4A]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="relative max-w-md mx-auto pt-2">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-[#4A4A4A]/60 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search topics (e.g. cancellation, check-in, wifi, hot tub)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#E2B4BD]/60 rounded-full text-xs text-[#4A4A4A] placeholder:text-[#4A4A4A]/40 focus:outline-none focus:border-[#4A4A4A] shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 p-1 rounded-full hover:bg-[#F7D6D0]/40 text-[#4A4A4A]/60 hover:text-[#4A4A4A] transition cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-[11px] text-[#4A4A4A]/70 text-left px-3 pt-1.5">
                Found {filteredFaqs.length} {filteredFaqs.length === 1 ? "result" : "results"} for "{searchQuery}"
              </p>
            )}
          </div>


        <section className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = openIndex === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? "border-[#4A4A4A] shadow-sm ring-1 ring-[#4A4A4A]/10"
                      : "border-[#E2B4BD]/40 shadow-xs hover:border-[#E2B4BD]"
                  }`}
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full px-5 py-4 sm:px-6 sm:py-4.5 text-left flex items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-[#FFF5F5]/40 transition"
                  >
                    <div className="flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A4A4A]/60 block mb-0.5">
                        {faq.categoryLabel}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-[#4A4A4A] font-syne">
                        {faq.question}
                      </h3>
                    </div>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 bg-[#4A4A4A] text-white" : "bg-[#F7D6D0]/40 text-[#4A4A4A]"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 text-xs sm:text-sm text-[#4A4A4A]/80 leading-relaxed border-t border-[#E2B4BD]/30 bg-[#FFF5F5]/20 space-y-3 animate-fadeIn">
                      <p>{faq.answer}</p>
                      {faq.highlight && (
                        <div className="p-2.5 sm:p-3 rounded-xl bg-[#F7D6D0]/30 border border-[#E2B4BD]/50 flex items-start gap-2">
                          <ShieldCheck className="w-4 h-4 text-[#4A4A4A] shrink-0 mt-0.5" />
                          <span className="text-xs font-semibold text-[#4A4A4A]">
                            Key Insight: {faq.highlight}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-[#E2B4BD]/40 p-8 space-y-3">
              <HelpCircle className="w-8 h-8 text-[#4A4A4A]/40 mx-auto" />
              <h3 className="font-bold text-base font-syne text-[#4A4A4A]">No matching questions found</h3>
              <p className="text-xs text-[#4A4A4A]/70 max-w-sm mx-auto">
                We couldn't find an answer matching "{searchQuery}". Try searching with different keywords or contact our team directly.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="px-4 py-2 rounded-full bg-[#4A4A4A] text-white text-xs font-semibold hover:bg-[#2D2D2D] transition cursor-pointer"
              >
                Clear Search Query
              </button>
            </div>
          )}
        </section>

        {/* Concierge Help Strip */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2B4BD]/40 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-base sm:text-lg font-bold font-syne text-[#4A4A4A]">
              Have a tailored inquiry not covered above?
            </h3>
            <p className="text-[#4A4A4A]/70 text-xs mt-0.5">
              Our dedicated alpine concierge team is available to assist with dates, private transfers, and bespoke stays.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/about"
              className="px-4 py-2 rounded-full bg-[#4A4A4A] hover:bg-[#2D2D2D] text-white font-semibold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs active:scale-95"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Concierge Desk</span>
            </Link>
            <Link
              to="/rooms"
              className="px-4 py-2 rounded-full border border-[#E2B4BD]/60 hover:bg-[#F7D6D0]/30 bg-white text-[#4A4A4A] font-semibold text-xs transition cursor-pointer active:scale-95 flex items-center gap-1"
            >
              <span>Browse Suites</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default FAQs;
