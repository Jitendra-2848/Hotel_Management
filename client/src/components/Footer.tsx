import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, ArrowUpRight, Check, Hotel } from "lucide-react";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-white/70 backdrop-blur-md text-[#4A4A4A] font-sans border-t border-[#E2B4BD]/40">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-12 sm:py-16">
        {/* Main Upper Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-[#E2B4BD]/30">
          {/* Brand Signature */}
          <div className="md:col-span-4 space-y-3">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="font-extrabold text-2xl tracking-tight text-[#4A4A4A]">
                <Hotel className="w-6 h-6" />
              </span>
              <span className="text-[#E2B4BD]">/</span>
              <span className="text-xs tracking-widest uppercase font-semibold text-[#4A4A4A]">
                Crafters'Haven
              </span>
            </Link>
            <p className="text-xs text-[#4A4A4A]/70 leading-relaxed max-w-xs font-normal">
              An intimate alpine sanctuary in the high mountain reserve. Crafted for solitude, architecture, and luxury rest.
            </p>
          </div>

          {/* Minimal Navigation Links */}
          <div className="md:col-span-4 flex items-start gap-10 sm:gap-14 text-xs">
            <div className="space-y-2.5">
              <span className="text-[10px] tracking-widest uppercase text-[#4A4A4A]/60 font-bold block">
                Explore
              </span>
              <ul className="space-y-2">
                <li>
                  <Link to="/rooms" className="text-[#4A4A4A]/80 hover:text-[#4A4A4A] transition inline-block">
                    Rooms & Suites
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-[#4A4A4A]/80 hover:text-[#4A4A4A] transition inline-block">
                    About Our Heritage
                  </Link>
                </li>
                <li>
                  <Link to="/faqs" className="text-[#4A4A4A]/80 hover:text-[#4A4A4A] transition inline-block">
                    Guest FAQs
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <span className="text-[10px] tracking-widest uppercase text-[#4A4A4A]/60 font-bold block">
                Sanctuary Guidance
              </span>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-[#4A4A4A]/80 hover:text-[#4A4A4A] transition inline-block">
                    About Crafters'Haven
                  </Link>
                </li>
                <li>
                  <Link to="/faqs" className="text-[#4A4A4A]/80 hover:text-[#4A4A4A] transition inline-block">
                    Frequently Asked Questions
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="text-[#4A4A4A]/80 hover:text-[#4A4A4A] transition inline-block">
                    Guest Profile & Reservations
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-[#4A4A4A]/80 hover:text-[#4A4A4A] transition inline-block">
                    Guest Sign In
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Minimal Newsletter / Direct Contact */}
          <div className="md:col-span-4 space-y-2.5">
            <span className="text-[10px] tracking-widest uppercase text-[#4A4A4A]/60 font-bold block">
              Stay Connected
            </span>
            {subscribed ? (
              <div className="flex items-center gap-2 text-xs text-emerald-700 py-1 font-medium">
                <Check className="w-3.5 h-3.5" />
                <span>Thank you. You're on the list.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center max-w-sm">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 bg-white border border-[#E2B4BD]/60 text-[#4A4A4A] text-xs px-3.5 py-2 rounded-l-full focus:outline-none focus:border-[#4A4A4A] placeholder-[#4A4A4A]/40 shadow-2xs"
                />
                <button
                  type="submit"
                  className="bg-[#4A4A4A] hover:bg-[#333333] text-brand-white px-4 py-2 rounded-r-full text-xs font-semibold transition cursor-pointer flex items-center gap-1 shrink-0 active:scale-95 shadow-2xs"
                >
                  <span>Join</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
            <p className="text-[11px] text-[#4A4A4A]/60">
              Inquiries: <Link to="/about" className="text-[#4A4A4A]/80 hover:text-[#4A4A4A] underline decoration-[#E2B4BD]">Concierge Desk & Inquiries</Link>
            </p>
          </div>
        </div>

        {/* Lower Row: Legal, Copyright & Scroll to Top */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#4A4A4A]/60">
          <p>© {new Date().getFullYear()} Crafters'Haven Reserve. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link to="/faqs" className="hover:text-[#4A4A4A] transition">Privacy</Link>
            <Link to="/faqs" className="hover:text-[#4A4A4A] transition">Terms</Link>
            <Link to="/faqs" className="hover:text-[#4A4A4A] transition">Cookies</Link>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-[#4A4A4A]/70 hover:text-[#4A4A4A] transition cursor-pointer ml-2 active:scale-95"
              title="Back to top"
            >
              <span>Top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;