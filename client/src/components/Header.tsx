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
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#E2B4BD]/40 transition-all">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-[#4A4A4A] text-brand-white flex items-center justify-center shrink-0 shadow-sm group-hover:bg-[#2D2D2D] transition">
              <Hotel className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm sm:text-lg tracking-tight text-[#4A4A4A] leading-none">
                Crafters'Haven
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-wider text-[#4A4A4A]/70 uppercase mt-0.5 font-medium">
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
            {/* Become a Host / Host Portal Link */}
            <Link
              to={isAuthenticated ? "/admin" : "/login"}
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-[#4A4A4A] px-3.5 py-1.5 rounded-full bg-[#F7D6D0]/50 hover:bg-[#F7D6D0] transition border border-[#E2B4BD]/40 shadow-2xs"
            >
              <Building className="w-3.5 h-3.5 text-[#4A4A4A]" />
              <span>{isAuthenticated ? "Host Portal" : "Become a Host"}</span>
            </Link>

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
              className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#4A4A4A] hover:bg-[#2D2D2D] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-semibold tracking-wide transition-all shadow-sm shadow-[#4A4A4A]/20 cursor-pointer active:scale-95"
            >
              <span>Explore Suites</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Truly Fully Fixed Bottom Navigation Bar for Mobile (< md) with Active Indicator Strip */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-xl border-t border-[#E2B4BD]/40 px-2 sm:px-6 py-1 pb-[max(0.65rem,env(safe-area-inset-bottom))] shadow-[0_-4px_24px_rgba(74,74,74,0.08)] flex items-center justify-around w-full touch-manipulation select-none"
      >
        {/* 1. Home */}
        {(() => {
          const isHome = location.pathname === "/";
          return (
            <Link
              to="/"
              className={`relative flex-1 min-w-[54px] py-1 flex flex-col items-center justify-center transition-all duration-150 active:scale-95 touch-manipulation ${
                isHome ? "text-[#4A4A4A] font-bold" : "text-[#4A4A4A]/60 hover:text-[#4A4A4A]"
              }`}
            >
              {isHome && (
                <span className="absolute -top-1 w-7 h-1 bg-[#4A4A4A] rounded-full shadow-xs animate-in fade-in zoom-in-75 duration-200" />
              )}
              <div
                className={`p-1 rounded-xl transition-all duration-200 ${
                  isHome ? "bg-[#F7D6D0]/60 text-[#4A4A4A]" : "hover:bg-[#FFF5F5]"
                }`}
              >
                <HomeIcon className="w-4.5 h-4.5" />
              </div>
              <span className="text-[10px] mt-0.5 leading-none">Home</span>
            </Link>
          );
        })()}

        {/* 2. Suites */}
        {(() => {
          const isSuites = location.pathname === "/rooms" && location.hash !== "#wishlist";
          return (
            <Link
              to="/rooms"
              className={`relative flex-1 min-w-[54px] py-1 flex flex-col items-center justify-center transition-all duration-150 active:scale-95 touch-manipulation ${
                isSuites ? "text-[#4A4A4A] font-bold" : "text-[#4A4A4A]/60 hover:text-[#4A4A4A]"
              }`}
            >
              {isSuites && (
                <span className="absolute -top-1 w-7 h-1 bg-[#4A4A4A] rounded-full shadow-xs animate-in fade-in zoom-in-75 duration-200" />
              )}
              <div
                className={`p-1 rounded-xl transition-all duration-200 ${
                  isSuites ? "bg-[#F7D6D0]/60 text-[#4A4A4A]" : "hover:bg-[#FFF5F5]"
                }`}
              >
                <BedDouble className="w-4.5 h-4.5" />
              </div>
              <span className="text-[10px] mt-0.5 leading-none">Suites</span>
            </Link>
          );
        })()}

        {/* 3. Wishlist */}
        {(() => {
          const isWishlist = location.hash === "#wishlist";
          return (
            <Link
              to="/rooms#wishlist"
              className={`relative flex-1 min-w-[54px] py-1 flex flex-col items-center justify-center transition-all duration-150 active:scale-95 touch-manipulation ${
                isWishlist ? "text-[#4A4A4A] font-bold" : "text-[#4A4A4A]/60 hover:text-[#4A4A4A]"
              }`}
            >
              {isWishlist && (
                <span className="absolute -top-1 w-7 h-1 bg-[#4A4A4A] rounded-full shadow-xs animate-in fade-in zoom-in-75 duration-200" />
              )}
              <div
                className={`p-1 rounded-xl transition-all duration-200 ${
                  isWishlist ? "bg-[#F7D6D0]/60 text-[#4A4A4A]" : "hover:bg-[#FFF5F5]"
                }`}
              >
                <Heart
                  className={`w-4.5 h-4.5 ${isWishlist ? "fill-[#E2B4BD] text-[#4A4A4A]" : ""}`}
                />
              </div>
              <span className="text-[10px] mt-0.5 leading-none">Wishlist</span>
            </Link>
          );
        })()}

        {/* 4. FAQs */}
        {(() => {
          const isFaqs = location.pathname === "/faqs";
          return (
            <Link
              to="/faqs"
              className={`relative flex-1 min-w-[54px] py-1 flex flex-col items-center justify-center transition-all duration-150 active:scale-95 touch-manipulation ${
                isFaqs ? "text-[#4A4A4A] font-bold" : "text-[#4A4A4A]/60 hover:text-[#4A4A4A]"
              }`}
            >
              {isFaqs && (
                <span className="absolute -top-1 w-7 h-1 bg-[#4A4A4A] rounded-full shadow-xs animate-in fade-in zoom-in-75 duration-200" />
              )}
              <div
                className={`p-1 rounded-xl transition-all duration-200 ${
                  isFaqs ? "bg-[#F7D6D0]/60 text-[#4A4A4A]" : "hover:bg-[#FFF5F5]"
                }`}
              >
                <HelpCircle className="w-4.5 h-4.5" />
              </div>
              <span className="text-[10px] mt-0.5 leading-none">FAQs</span>
            </Link>
          );
        })()}

        {/* 5. Account / Sign In */}
        {(() => {
          const isProfileOrLogin = location.pathname === "/profile" || location.pathname === "/login";
          return (
            <Link
              to={isAuthenticated ? "/profile" : "/login"}
              className={`relative flex-1 min-w-[54px] py-1 flex flex-col items-center justify-center transition-all duration-150 active:scale-95 touch-manipulation ${
                isProfileOrLogin ? "text-[#4A4A4A] font-bold" : "text-[#4A4A4A]/60 hover:text-[#4A4A4A]"
              }`}
            >
              {isProfileOrLogin && (
                <span className="absolute -top-1 w-7 h-1 bg-[#4A4A4A] rounded-full shadow-xs animate-in fade-in zoom-in-75 duration-200" />
              )}
              <div
                className={`p-1 rounded-xl transition-all duration-200 ${
                  isProfileOrLogin ? "bg-[#F7D6D0]/60 text-[#4A4A4A]" : "hover:bg-[#FFF5F5]"
                }`}
              >
                <UserIcon className="w-4.5 h-4.5" />
              </div>
              <span className="text-[10px] mt-0.5 leading-none">
                {isAuthenticated ? "Profile" : "Login"}
              </span>
            </Link>
          );
        })()}
      </nav>
    </>
  );
};

export default Header;
