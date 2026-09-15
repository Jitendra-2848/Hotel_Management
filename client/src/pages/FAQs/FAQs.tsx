import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  ShieldCheck,
  Calendar,
  Sparkles,
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: "booking" | "arrival" | "amenities" | "hosting";
}

const FAQ_DATA: FAQItem[] = [
  {
    category: "booking",
    question: "What is the cancellation and refund policy?",
    answer:
      "All Crafters'Haven reservations include flexible cancellation up to 7 days before your scheduled check-in date for a 100% refund. Cancellations made within 7 to 2 days receive a 50% refund or full stay credit valid for 24 months across any of our mountain sanctuaries.",
  },
  {
    category: "booking",
    question: "How do security deposits and linen fees work?",
    answer:
      "A standard pre-authorization is held 24 hours prior to arrival and released within 48 hours of checkout after chalet inspection. The chalet preparation fee covers artisan bed linens, organic cedar bath amenities, and wood restocking.",
  },
  {
    category: "arrival",
    question: "How do we access high-elevation sanctuaries during heavy snowfall?",
    answer:
      "All Crafters'Haven alpine roads are cleared twice daily by private snow plows. In addition, our front desk provides complimentary 4x4 heated Mercedes Sprinter shuttles between the regional airport / train depot and your suite.",
  },
  {
    category: "arrival",
    question: "Can private helicopter transfers be arranged directly to the lodge?",
    answer:
      "Yes. Our Summit Penthouses and High Pines Chalets have certified helipads within 5 minutes of each residence. Our front desk concierge coordinates flight manifests, luggage transfers, and FAA clearance.",
  },
  {
    category: "amenities",
    question: "Are private hot tubs and Finnish saunas pre-heated prior to arrival?",
    answer:
      "Always. Your private cedar barrel hot tub and Finnish dry cedar sauna are pre-heated to optimal temperatures (39°C / 102°F) prior to your arrival, with aromatic alpine pine infusions ready for your first evening.",
  },
  {
    category: "amenities",
    question: "Can we request a private executive chef for dinners?",
    answer:
      "Yes. You can select the Private Chalet Chef add-on during checkout or anytime via our concierge. Our culinary chefs prepare customized 4-course alpine tasting menus directly inside your suite's gourmet kitchen.",
  },
  {
    category: "hosting",
    question: "How do I list my mountain property with Crafters'Haven?",
    answer:
      "Owners of architectural mountain homes can submit their residence for review via our 'Become a Host' portal. We evaluate architectural integrity, acoustic solitude, and thermal amenities before onboarding.",
  },
  {
    category: "hosting",
    question: "What host protection and property management does Haven provide?",
    answer:
      "We provide $3,000,000 in comprehensive property damage insurance, guest identity verification, round-the-clock alpine concierge dispatch, and professional turnover linen logistics.",
  },
];

export const FAQs: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs =
    activeCategory === "all"
      ? FAQ_DATA
      : FAQ_DATA.filter((item) => item.category === activeCategory);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#FFF5F5] text-[#4A4A4A] font-sans selection:bg-[#4A4A4A] selection:text-white flex flex-col justify-between pb-24 md:pb-12">
      <Header />

      <main className="w-full px-4 sm:px-8 lg:px-12 py-6 sm:py-10 max-w-5xl mx-auto flex-1 space-y-12">
        {/* Header Section */}
        <section className="text-center max-w-2xl mx-auto space-y-3 pt-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7D6D0]/50 text-[#4A4A4A] text-[11px] font-semibold uppercase tracking-wider border border-[#E2B4BD]/40">
            <HelpCircle className="w-3.5 h-3.5 text-[#4A4A4A]" />
            <span>Frequently Asked Questions</span>
          </div>

          <h1 className="font-syne text-3xl sm:text-5xl font-extrabold text-[#4A4A4A] tracking-tight">
            Guest Assistance & Information
          </h1>

          <p className="text-[#4A4A4A]/70 text-xs sm:text-sm leading-relaxed">
            Everything you need to know about reserving, arriving at, and experiencing your Crafters'Haven
            mountain sanctuary.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {[
              { id: "all", label: "All Questions" },
              { id: "booking", label: "Booking & Cancellations" },
              { id: "arrival", label: "Arrival & Transfers" },
              { id: "amenities", label: "Amenities & Dining" },
              { id: "hosting", label: "Hosting" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer active:scale-95 ${
                  activeCategory === cat.id
                    ? "bg-[#4A4A4A] text-white shadow-xs"
                    : "bg-white text-[#4A4A4A] border border-[#E2B4BD]/40 hover:bg-[#F7D6D0]/30"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* FAQs Accordion */}
        <section className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#E2B4BD]/40 overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full px-5 py-4 sm:px-6 sm:py-4.5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FFF5F5]/60 transition"
                >
                  <span className="font-semibold text-[#4A4A4A] text-sm sm:text-base">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? "bg-[#4A4A4A] text-white rotate-180" : "bg-[#F7D6D0]/40 text-[#4A4A4A]"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-[#4A4A4A]/80 leading-relaxed border-t border-[#E2B4BD]/20 pt-3.5 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </section>

        {/* Concierge Assistance Footer Strip */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2B4BD]/40 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-syne font-bold text-lg text-[#4A4A4A]">
              Have an inquiry not answered above?
            </h3>
            <p className="text-[#4A4A4A]/70 text-xs mt-1">
              Our 24/7 mountain concierge team is on standby to assist with bespoke itineraries.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="tel:+18005550199"
              className="px-4 py-2 rounded-full bg-[#4A4A4A] hover:bg-[#333333] text-white font-semibold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Concierge</span>
            </a>
            <Link
              to="/rooms"
              className="px-4 py-2 rounded-full border border-[#E2B4BD]/60 hover:border-[#4A4A4A] bg-white text-[#4A4A4A] font-semibold text-xs transition cursor-pointer active:scale-95 hover:bg-[#F7D6D0]/20"
            >
              Browse Suites
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default FAQs;
