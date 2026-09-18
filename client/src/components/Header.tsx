import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Hotel,
  Home as HomeIcon,
  Heart,
  BedDouble,
  User as UserIcon,
  ArrowUpRight,
  HelpCircle,
  Building,
} from "lucide-react";

export const Header: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();


  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Suites", to: "/rooms" },
    { label: "About", to: "/about" },
    { label: "FAQs", to: "/faqs" },
  ];

  return (
    <>
      {/* Top Header for Desktop & Tablet */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E2B4BD]/40 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-[#4A4A4A] text-brand-white flex items-center justify-center shrink-0 shadow-sm group-hover:bg-[#2D2D2D] transition">
              <Hotel className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base sm:text-lg tracking-tight text-[#4A4A4A] leading-none">
                Crafters'Haven
              </span>
              <span className="text-[10px] tracking-wider text-[#4A4A4A]/70 uppercase mt-0.5 font-medium">
                Mountain Sanctuaries
              </span>
            </div>
          </Link>

          {/* Center Pill Navbar (Desktop) */}
          <nav className="hidden md:flex items-center bg-[#FFF5F5] backdrop-blur-md px-1.5 py-1 rounded-full border border-[#E2B4BD]/50 shadow-xs">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-150 ${isActive
                    ? "bg-[#4A4A4A] text-brand-white font-semibold shadow-xs"
                    : "text-[#4A4A4A] hover:text-brand-charcoal "
                    }`}
                >
                  <span>
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions (Desktop) */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Conditional Admin Portal Link (Hidden from regular guests) */}
            {isAuthenticated && (user?.role === "MANAGER" || user?.role === "STAFF") && (
              <Link
                to="/admin"
                className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-[#4A4A4A] px-3 py-1.5 rounded-full bg-[#F7D6D0]/50 hover:bg-[#F7D6D0] transition border border-[#E2B4BD]/40 shadow-2xs"
              >
                <Building className="w-3.5 h-3.5 text-[#4A4A4A]" />
                <span>Admin Portal</span>
              </Link>
            )}

            {isAuthenticated && user ? (
              <Link
                to="/profile"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#4A4A4A] hover:text-brand-charcoal px-3 py-1.5 rounded-full hover:bg-[#F7D6D0]/40 transition border border-[#E2B4BD]/30"
              >
                <UserIcon className="w-3.5 h-3.5 text-[#4A4A4A]/70" />
                <span>{user.name}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex text-xs font-semibold text-[#4A4A4A] hover:text-brand-charcoal px-3 py-1.5 rounded-full hover:bg-[#F7D6D0]/40 transition"
              >
                Sign In
              </Link>
            )}

            {/* Editorial Luxury Book Now Button */}
            <Link
              to="/rooms"
              className="inline-flex items-center gap-2 bg-[#4A4A4A] hover:bg-[#2D2D2D] text-white px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all shadow-sm shadow-[#4A4A4A]/20 cursor-pointer active:scale-95"
            >
              <span>Explore Suites</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Truly Fully Fixed Bottom Navigation Bar for Mobile (< md) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-xl border-t border-[#E2B4BD]/40 px-6 py-2 pb-[max(0.65rem,env(safe-area-inset-bottom))] shadow-[0_-4px_24px_rgba(74,74,74,0.08)] flex items-center justify-between w-full"
      >
        {/* 1. Home */}
        <Link
          to="/"
          className={`flex flex-col items-center gap-1 transition py-1 ${location.pathname === "/" ? "text-[#4A4A4A] font-bold" : "text-[#4A4A4A]/60 hover:text-[#4A4A4A]"
            }`}
        >
          <HomeIcon className="w-4 h-4" />
          <span className="text-[10px]">Home</span>
        </Link>

        {/* 2. Suites */}
        <Link
          to="/rooms"
          className={`flex flex-col items-center gap-1 transition py-1 ${location.pathname === "/rooms" && location.hash !== "#wishlist"
            ? "text-[#4A4A4A] font-bold"
            : "text-[#4A4A4A]/60 hover:text-[#4A4A4A]"
            }`}
        >
          <BedDouble className="w-4 h-4" />
          <span className="text-[10px]">Suites</span>
        </Link>

        {/* 3. Wishlist */}
        <Link
          to="/rooms#wishlist"
          className={`flex flex-col items-center gap-1 transition py-1 ${location.hash === "#wishlist" ? "text-[#4A4A4A] font-bold" : "text-[#4A4A4A]/60 hover:text-[#4A4A4A]"
            }`}
        >
          <Heart className={`w-4 h-4 ${location.hash === "#wishlist" ? "fill-[#E2B4BD] text-[#4A4A4A]" : ""}`} />
          <span className="text-[10px]">Wishlist</span>
        </Link>

        {/* 4. FAQs */}
        <Link
          to="/faqs"
          className={`flex flex-col items-center gap-1 transition py-1 ${location.pathname === "/faqs" ? "text-[#4A4A4A] font-bold" : "text-[#4A4A4A]/60 hover:text-[#4A4A4A]"
            }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span className="text-[10px]">FAQs</span>
        </Link>

        {/* 5. Account / Sign In */}
        <Link
          to={isAuthenticated ? "/profile" : "/login"}
          className={`flex flex-col items-center gap-1 transition py-1 ${location.pathname === "/profile" || location.pathname === "/login" ? "text-[#4A4A4A] font-bold" : "text-[#4A4A4A]/60 hover:text-[#4A4A4A]"
            }`}
        >
          <UserIcon className="w-4 h-4" />
          <span className="text-[10px]">{isAuthenticated ? "Profile" : "Login"}</span>
        </Link>
      </nav>
    </>
  );
};

export default Header;
