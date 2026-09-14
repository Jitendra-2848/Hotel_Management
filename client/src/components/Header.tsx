import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Hotel,
  Home as HomeIcon,
  Heart,
  BedDouble,
  User as UserIcon,
  ArrowUpRight,
  LogOut,
} from "lucide-react";

export const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Rooms", to: "/rooms" },
    { label: "Contact", to: "#contact" },
  ];

  return (
    <>
      {/* Top Header for Desktop & Tablet */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          scrolled
            ? "bg-[#faf9f6]/95 backdrop-blur-md shadow-xs py-3 border-b border-stone-200"
            : "bg-transparent py-4 sm:py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between">
          {/* Logo on Left */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center shrink-0">
              <Hotel className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-syne font-bold text-base sm:text-lg tracking-tight text-stone-900 leading-none">
                Crafters'Haven
              </span>
              <span className="text-[10px] tracking-wider text-stone-500 uppercase mt-0.5">
                Suites & Lodge
              </span>
            </div>
          </Link>

          {/* Center Pill Navbar (Desktop) */}
          <nav className="hidden md:flex items-center bg-stone-900 px-1 py-1 rounded-full border border-stone-800 shadow-sm">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              if (link.to.startsWith("#")) {
                return (
                  <a
                    key={link.label}
                    href={link.to}
                    className="px-5 py-1.5 text-xs font-medium text-stone-300 hover:text-white transition"
                  >
                    {link.label}
                  </a>
                );
              }
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`px-5 py-1.5 text-xs font-medium rounded-full transition ${
                    isActive
                      ? "bg-white text-stone-900 font-semibold shadow-xs"
                      : "text-stone-300 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions (Desktop) */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="hidden sm:flex items-center gap-2 text-xs text-stone-700">
                <span className="font-medium text-stone-900">{user.name}</span>
                <span className="text-stone-400">•</span>
                <button
                  onClick={() => logout()}
                  title="Log Out"
                  className="text-stone-500 hover:text-rose-600 transition flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex text-xs font-medium text-stone-700 hover:text-stone-950 px-3 py-1.5 transition"
              >
                Sign In
              </Link>
            )}

            <Link
              to="/rooms"
              className="inline-flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-white pl-4 pr-2 py-1.5 rounded-full text-xs font-medium transition cursor-pointer"
            >
              <span>Book Now</span>
              <span className="w-5 h-5 rounded-full bg-white text-stone-900 flex items-center justify-center">
                <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Modern Floating Bottom Navigation Bar for Mobile (< md) */}
      <div className="md:hidden fixed bottom-3 inset-x-3 z-50 flex justify-center pointer-events-none">
        <nav className="pointer-events-auto bg-stone-900/95 backdrop-blur-xl border border-stone-800 text-white shadow-xl rounded-2xl px-6 py-2.5 flex items-center justify-between w-full max-w-sm">
          {/* 1. Home */}
          <Link
            to="/"
            className={`flex flex-col items-center gap-0.5 transition ${
              location.pathname === "/" ? "text-white font-semibold" : "text-stone-400 hover:text-stone-200"
            }`}
          >
            <HomeIcon className="w-4 h-4" />
            <span className="text-[10px]">Home</span>
          </Link>

          {/* 2. Wishlist */}
          <Link
            to="/rooms"
            className={`flex flex-col items-center gap-0.5 transition ${
              location.hash === "#wishlist" ? "text-white font-semibold" : "text-stone-400 hover:text-stone-200"
            }`}
          >
            <Heart className="w-4 h-4" />
            <span className="text-[10px]">Wishlist</span>
          </Link>

          {/* 3. Rooms */}
          <Link
            to="/rooms"
            className={`flex flex-col items-center gap-0.5 transition ${
              location.pathname === "/rooms" ? "text-white font-semibold" : "text-stone-400 hover:text-stone-200"
            }`}
          >
            <BedDouble className="w-4 h-4" />
            <span className="text-[10px]">Rooms</span>
          </Link>

          {/* 4. Profile / Sign In */}
          <Link
            to={isAuthenticated ? "/rooms" : "/login"}
            className={`flex flex-col items-center gap-0.5 transition ${
              location.pathname === "/login" ? "text-white font-semibold" : "text-stone-400 hover:text-stone-200"
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span className="text-[10px]">{isAuthenticated ? "Profile" : "Login"}</span>
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Header;
