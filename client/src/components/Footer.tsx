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
    <footer className="w-full bg-[#0d0d0f] text-stone-400 font-sans border-t border-stone-800/80">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-12 sm:py-16">
        {/* Main Upper Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-stone-800/60">
          {/* Brand Signature */}
          <div className="md:col-span-4 space-y-3">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="font-syne font-extrabold text-2xl tracking-tight text-white">
                <Hotel />
              </span>
              <span className="text-stone-600">/</span>
              <span className="font-syne text-xs tracking-widest uppercase font-semibold text-stone-300">
                Crafters'Haven Suites
              </span>
            </Link>
            <p className="text-xs text-stone-500 leading-relaxed max-w-xs font-normal">
              An intimate alpine sanctuary in the high mountain reserve.
            </p>
          </div>

          {/* Minimal Navigation Links */}
          <div className="md:col-span-4 flex items-start gap-10 sm:gap-14 text-xs">
            <div className="space-y-2.5">
              <span className="text-[10px] tracking-widest uppercase text-stone-600 font-semibold block">
                Explore
              </span>
              <ul className="space-y-2">
                <li>
                  <Link to="/rooms" className="text-stone-300 hover:text-white transition">
                    Rooms & Suites
                  </Link>
                </li>
                <li>
                  <a href="#about" className="text-stone-300 hover:text-white transition">
                    Our Story
                  </a>
                </li>
                <li>
                  <a href="#gallery" className="text-stone-300 hover:text-white transition">
                    Gallery
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <span className="text-[10px] tracking-widest uppercase text-stone-600 font-semibold block">
                Stay
              </span>
              <ul className="space-y-2">
                <li>
                  <a href="#about" className="text-stone-300 hover:text-white transition">
                    Nordic Spa
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-stone-300 hover:text-white transition">
                    Concierge
                  </a>
                </li>
                <li>
                  <Link to="/login" className="text-stone-300 hover:text-white transition">
                    Guest Portal
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Minimal Newsletter / Direct Contact */}
          <div className="md:col-span-4 space-y-2.5">
            <span className="text-[10px] tracking-widest uppercase text-stone-600 font-semibold block">
              Stay Connected
            </span>
            {subscribed ? (
              <div className="flex items-center gap-2 text-xs text-emerald-400 py-1">
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
                  className="flex-1 bg-stone-900 border border-stone-800 text-white text-xs px-3.5 py-2 rounded-l-full focus:outline-none focus:border-stone-600 placeholder-stone-600"
                />
                <button
                  type="submit"
                  className="bg-white hover:bg-stone-200 text-stone-950 px-4 py-2 rounded-r-full text-xs font-semibold transition cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <span>Join</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
            <p className="text-[11px] text-stone-500">
              Inquiries: <a href="mailto:prajapatijitendra2848@gmail.com" className="text-stone-400 hover:text-white underline">prajapatijitendra2848@gmail.com</a>
            </p>
          </div>
        </div>

        {/* Lower Row: Legal, Copyright & Scroll to Top */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <p>© {new Date().getFullYear()} Crafters'Haven . All rights reserved.</p>

          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-stone-300 transition">Privacy</a>
            <a href="#terms" className="hover:text-stone-300 transition">Terms</a>
            <a href="#cookies" className="hover:text-stone-300 transition">Cookies</a>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-stone-400 hover:text-white transition cursor-pointer ml-2"
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