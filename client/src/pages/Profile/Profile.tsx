import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/Header";
import { roomsApi } from "../../lib/api";
import { CURATED_ROOMS } from "../../data/roomsData";
import { updateSEO } from "../../util/seo";
import {
  User as UserIcon,
  Mail,
  Calendar,
  Heart,
  Settings,
  LogOut,
  Building,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
  Trash2,
  Check,
} from "lucide-react";

interface SavedReservation {
  id: string;
  roomId: string;
  roomName: string;
  image?: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  totalAmount: number;
  confirmationNumber: string;
  status: "Confirmed" | "Upcoming" | "Completed";
  createdAt: string;
}

export const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"reservations" | "wishlist" | "personal" | "settings">("reservations");
  const [reservations, setReservations] = useState<SavedReservation[]>([]);
  const [isLoadingReservations, setIsLoadingReservations] = useState(false);
  const [wishlistRooms, setWishlistRooms] = useState<typeof CURATED_ROOMS>([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [personalSaveSuccess, setPersonalSaveSuccess] = useState(false);
  const [settingsSaveSuccess, setSettingsSaveSuccess] = useState(false);

  // Form states for personal details
  const [fullName, setFullName] = useState(user?.name || "Guest Traveler");
  const [emailAddress, setEmailAddress] = useState(user?.email || "guest@hotelhaven.com");
  const [phoneNumber, setPhoneNumber] = useState("+1 (555) 234-5678");
  const [preferredLanguage, setPreferredLanguage] = useState("English (US)");
  const [homeCity, setHomeCity] = useState("San Francisco, CA");

  // Settings states
  const [currency, setCurrency] = useState("INR");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailReceipts, setEmailReceipts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [arrivalWindow, setArrivalWindow] = useState("15:00");

  useEffect(() => {
    window.scrollTo(0, 0);
    updateSEO("My Account & Reservations | Hotel Haven", "View and manage your hotel bookings, saved wishlist, and personal profile.");

    if (user?.name) setFullName(user.name);
    if (user?.email) setEmailAddress(user.email);

    const loadBookings = async () => {
      setIsLoadingReservations(true);
      try {
        const bookings = await roomsApi.getMyBookings();
        const mapped: SavedReservation[] = (bookings || []).map((b: any) => {
          const checkInDate = new Date(b.checkIn);
          const checkOutDate = new Date(b.checkOut);
          const diffDays = Math.ceil(
            (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          return {
            id: b.id,
            roomId: b.roomId || (b.room && b.room.id) || "1",
            roomName: b.room?.name || "Deluxe Suite",
            image: b.room?.featuredImage || (b.room?.gallery && b.room.gallery[0]),
            checkIn: b.checkIn,
            checkOut: b.checkOut,
            nights: isNaN(diffDays) || diffDays <= 0 ? 1 : diffDays,
            guests: b.guests || 2,
            totalAmount: b.totalPrice,
            confirmationNumber: b.confirmationNumber || b.id,
            status: b.status === "confirmed" ? "Confirmed" : "Upcoming",
            createdAt: b.createdAt ? new Date(b.createdAt).toISOString().slice(0, 10) : "",
          };
        });
        setReservations(mapped);
      } catch {
        setReservations([]);
      } finally {
        setIsLoadingReservations(false);
      }
    };

    loadBookings();

    try {
      const savedWish = localStorage.getItem("chs_wishlist");
      if (savedWish) {
        const ids: string[] = JSON.parse(savedWish);
        const filtered = CURATED_ROOMS.filter((r) => ids.includes(r.id));
        setWishlistRooms(filtered);
      }
    } catch {
      // ignore
    }
  }, [user]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate("/login");
    } catch {
      setIsLoggingOut(false);
    }
  };

  const handleRemoveWishlist = (id: string) => {
    const updated = wishlistRooms.filter((r) => r.id !== id);
    setWishlistRooms(updated);
    try {
      const saved = localStorage.getItem("chs_wishlist");
      if (saved) {
        const ids: string[] = JSON.parse(saved);
        localStorage.setItem("chs_wishlist", JSON.stringify(ids.filter((itemId) => itemId !== id)));
      }
    } catch {
      // ignore
    }
  };

  const handleSavePersonal = (e: React.FormEvent) => {
    e.preventDefault();
    setPersonalSaveSuccess(true);
    setTimeout(() => setPersonalSaveSuccess(false), 3000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaveSuccess(true);
    setTimeout(() => setSettingsSaveSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FFF5F5] text-[#4A4A4A] font-sans selection:bg-[#4A4A4A] selection:text-white flex flex-col justify-between pb-24 md:pb-12">
      <Header />

      <main className="w-full px-4 sm:px-6 lg:px-10 py-6 sm:py-8 max-w-7xl mx-auto flex-1">
        {/* MOBILE COMPACT USER IDENTITY BANNER (< lg screens) */}
        <div className="lg:hidden bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs mb-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#4A4A4A] text-white flex items-center justify-center font-syne font-bold text-lg shadow-sm shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : "G"}
            </div>
            <div className="min-w-0 flex-1 text-left">
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-bold font-syne text-[#4A4A4A] truncate">
                  {user?.name || "Hotel Haven Guest"}
                </h1>
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Verified Member" />
              </div>
              <p className="text-[11px] text-stone-500 truncate">{user?.email || "guest@hotelhaven.com"}</p>
              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-stone-600 font-semibold">
                <span>{reservations.length} Bookings</span>
                <span>•</span>
                <span>{wishlistRooms.length} Saved</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100">
            <Link
              to="/admin"
              className="py-1.5 px-3 rounded-lg bg-[#4A4A4A] text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <Building className="w-3.5 h-3.5" />
              <span>Host Portal</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="py-1.5 px-3 rounded-lg border border-stone-200 text-stone-700 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
            </button>
          </div>
        </div>

        {/* Desktop 2-Column Layout */}
        <div className="lg:grid lg:grid-cols-[300px_1fr] xl:grid-cols-[320px_1fr] gap-8 items-start">
          {/* LEFT COLUMN: User Identity Card (Desktop Only) */}
          <aside className="hidden lg:block sticky top-24 self-start bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-6">
            {/* User Avatar & Status */}
            <div className="text-center space-y-3 pb-6 border-b border-stone-200/80">
              <div className="relative inline-block">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#4A4A4A] text-white flex items-center justify-center font-syne font-bold text-2xl sm:text-3xl shadow-md mx-auto">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "G"}
                </div>
                <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white" title="Verified Member">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              <div>
                <h1 className="text-lg font-bold font-syne text-[#4A4A4A] truncate">
                  {user?.name || "Hotel Haven Guest"}
                </h1>
                <p className="text-xs text-stone-500 flex items-center justify-center gap-1.5 mt-0.5 truncate">
                  <Mail className="w-3 h-3 text-stone-400 shrink-0" />
                  <span className="truncate">{user?.email || "guest@hotelhaven.com"}</span>
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-stone-800 text-[11px] font-semibold">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Verified Traveler</span>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3 text-center pb-6 border-b border-stone-200/80">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60">
                <span className="block text-xl font-bold font-syne text-[#4A4A4A]">
                  {reservations.length}
                </span>
                <span className="text-[11px] text-stone-500 font-medium">Reservations</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60">
                <span className="block text-xl font-bold font-syne text-[#4A4A4A]">
                  {wishlistRooms.length}
                </span>
                <span className="text-[11px] text-stone-500 font-medium">Saved Rooms</span>
              </div>
            </div>

            {/* Account Quick Links & Logout */}
            <div className="space-y-2">
              <Link
                to="/admin"
                className="w-full py-2.5 px-4 rounded-xl bg-[#4A4A4A] hover:bg-[#2D2D2D] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition active:scale-98 cursor-pointer"
              >
                <Building className="w-4 h-4 shrink-0" />
                <span>Host Portal / Dashboard</span>
              </Link>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full py-2.5 px-4 rounded-xl border border-stone-200 hover:bg-stone-50 text-[#4A4A4A] text-xs font-semibold flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-stone-500 shrink-0" />
                <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
              </button>
            </div>
          </aside>

          {/* RIGHT COLUMN: Tab Navigation & Tab Content */}
          <div className="min-w-0 w-full space-y-6">
            {/* Top Navigation Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-stone-200/80">
              {[
                { id: "reservations", label: "Bookings & Trips", icon: Calendar, badge: reservations.length },
                { id: "wishlist", label: "Saved Wishlist", icon: Heart, badge: wishlistRooms.length },
                { id: "personal", label: "Personal Details", icon: UserIcon },
                { id: "settings", label: "Security & Preferences", icon: Settings },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer active:scale-95 whitespace-nowrap shrink-0 ${
                      isActive
                        ? "bg-[#4A4A4A] text-white shadow-xs"
                        : "bg-white text-stone-600 border border-stone-200/80 hover:bg-stone-50"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-stone-500"}`} />
                    <span>{tab.label}</span>
                    {tab.badge !== undefined && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold tabular-nums ${
                          isActive ? "bg-white/20 text-white" : "bg-stone-100 text-stone-600"
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* TAB 1: RESERVATIONS */}
            {activeTab === "reservations" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold font-syne text-[#4A4A4A]">
                    Your Room Bookings
                  </h2>
                  <span className="text-xs text-stone-500">
                    {reservations.length} confirmed stay{reservations.length === 1 ? "" : "s"}
                  </span>
                </div>

                {isLoadingReservations ? (
                  <div className="bg-white rounded-2xl p-10 border border-stone-200/80 text-center space-y-3">
                    <div className="w-6 h-6 border-2 border-[#4A4A4A] border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-stone-500">Retrieving your confirmed bookings...</p>
                  </div>
                ) : reservations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reservations.map((res) => (
                      <div
                        key={res.id}
                        className="bg-white rounded-2xl border border-stone-200/80 shadow-xs hover:border-stone-400 transition overflow-hidden flex flex-col justify-between"
                      >
                        {/* Room Image Banner */}
                        <div className="h-36 sm:h-40 w-full bg-stone-100 overflow-hidden relative">
                          <img
                            src={res.image || "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"}
                            alt={res.roomName}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2.5 right-2.5">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{res.status}</span>
                            </span>
                          </div>
                          <div className="absolute bottom-2 left-2.5">
                            <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono">
                              #{res.confirmationNumber}
                            </span>
                          </div>
                        </div>

                        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div>

                            <h3 className="font-bold font-syne text-base text-[#4A4A4A] mb-1">
                              {res.roomName}
                            </h3>

                            <div className="space-y-1.5 text-xs text-stone-600 mt-2">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                                <span>
                                  {res.checkIn} → {res.checkOut} ({res.nights} {res.nights === 1 ? "night" : "nights"})
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                                <span>Check-in from 15:00 • Keyless Check-in</span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-stone-400 uppercase font-bold block">
                                Total Paid
                              </span>
                              <span className="text-base font-bold font-syne text-[#4A4A4A]">
                                ${res.totalAmount}
                              </span>
                            </div>
                            <Link
                              to={`/rooms/${res.roomId}`}
                              className="px-3.5 py-1.5 rounded-xl bg-[#4A4A4A] hover:bg-[#2D2D2D] text-white text-xs font-semibold transition active:scale-95 flex items-center gap-1 shadow-2xs"
                            >
                              <span>View Stay</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-10 border border-stone-200/80 text-center space-y-3">
                    <Calendar className="w-10 h-10 text-stone-300 mx-auto" />
                    <h3 className="font-bold text-base text-[#4A4A4A]">No Active Bookings Found</h3>
                    <p className="text-xs text-stone-500 max-w-sm mx-auto">
                      Explore our handpicked hotel rooms and luxury suites to book your next getaway.
                    </p>
                    <Link
                      to="/rooms"
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#4A4A4A] text-white text-xs font-semibold shadow-xs hover:bg-[#2D2D2D] transition cursor-pointer"
                    >
                      <span>Browse Rooms</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: WISHLIST */}
            {activeTab === "wishlist" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold font-syne text-[#4A4A4A]">
                    Saved Accommodations
                  </h2>
                  <span className="text-xs text-stone-500">
                    {wishlistRooms.length} room{wishlistRooms.length === 1 ? "" : "s"} saved
                  </span>
                </div>

                {wishlistRooms.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {wishlistRooms.map((room) => (
                      <div
                        key={room.id}
                        className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs flex flex-col justify-between"
                      >
                        <div className="relative h-44 w-full bg-stone-100">
                          <img
                            src={room.featuredImage}
                            alt={room.name}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => handleRemoveWishlist(room.id)}
                            className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 hover:bg-white text-rose-600 transition shadow-xs cursor-pointer"
                            title="Remove from saved"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                          <div>
                            <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
                              <span className="font-semibold uppercase tracking-wider">{room.category}</span>
                              <span className="font-semibold text-stone-800">★ {room.rating}</span>
                            </div>
                            <h4 className="font-bold text-sm text-[#4A4A4A] font-syne line-clamp-1">{room.name}</h4>
                            <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">{room.tagline}</p>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                            <span className="font-bold text-sm text-[#4A4A4A] font-syne">
                              ${room.price} <span className="text-[11px] font-normal text-stone-400">/ night</span>
                            </span>
                            <Link
                              to={`/rooms/${room.id}`}
                              className="px-3.5 py-1.5 rounded-xl bg-[#4A4A4A] text-white text-xs font-semibold hover:bg-[#2D2D2D] transition flex items-center gap-1 shadow-2xs"
                            >
                              <span>Book Now</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-10 border border-stone-200/80 text-center space-y-3">
                    <Heart className="w-10 h-10 text-stone-300 mx-auto" />
                    <h3 className="font-bold text-base text-[#4A4A4A]">Your Wishlist is Empty</h3>
                    <p className="text-xs text-stone-500 max-w-sm mx-auto">
                      Click the heart icon on any hotel card to save properties for future trips.
                    </p>
                    <Link
                      to="/rooms"
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#4A4A4A] text-white text-xs font-semibold shadow-xs hover:bg-[#2D2D2D] transition cursor-pointer"
                    >
                      <span>Explore Stays</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: PERSONAL DETAILS */}
            {activeTab === "personal" && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-xs max-w-2xl space-y-6">
                <div>
                  <h2 className="text-base font-bold font-syne text-[#4A4A4A]">
                    Personal Information
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Update your personal information used for room bookings and check-in verifications.
                  </p>
                </div>

                {personalSaveSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Personal information updated successfully.</span>
                  </div>
                )}

                <form onSubmit={handleSavePersonal} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        Full Legal Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-[#4A4A4A] bg-stone-50/50 focus:bg-white focus:outline-none focus:border-[#4A4A4A] transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-[#4A4A4A] bg-stone-50/50 focus:bg-white focus:outline-none focus:border-[#4A4A4A] transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-[#4A4A4A] bg-stone-50/50 focus:bg-white focus:outline-none focus:border-[#4A4A4A] transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        Preferred Language
                      </label>
                      <input
                        type="text"
                        value={preferredLanguage}
                        onChange={(e) => setPreferredLanguage(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-[#4A4A4A] bg-stone-50/50 focus:bg-white focus:outline-none focus:border-[#4A4A4A] transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Home City / Region
                    </label>
                    <input
                      type="text"
                      value={homeCity}
                      onChange={(e) => setHomeCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-[#4A4A4A] bg-stone-50/50 focus:bg-white focus:outline-none focus:border-[#4A4A4A] transition"
                    />
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#4A4A4A] hover:bg-[#2D2D2D] text-white text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
                    >
                      Save Profile Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 4: SETTINGS & SECURITY */}
            {activeTab === "settings" && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-xs max-w-2xl space-y-6">
                <div>
                  <h2 className="text-base font-bold font-syne text-[#4A4A4A]">
                    Account Security & Preferences
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Manage two-factor authentication, display currency, and notification channels.
                  </p>
                </div>

                {settingsSaveSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Preferences saved successfully.</span>
                  </div>
                )}

                <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                  {/* Currency */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
                    <div>
                      <h4 className="font-semibold text-[#4A4A4A]">Display Currency</h4>
                      <p className="text-stone-500 text-[11px]">Pricing and checkout currency.</p>
                    </div>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs text-[#4A4A4A] bg-white focus:outline-none cursor-pointer"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>

                  {/* 2FA Toggle */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
                    <div>
                      <h4 className="font-semibold text-[#4A4A4A]">Two-Factor Authentication (2FA)</h4>
                      <p className="text-stone-500 text-[11px]">Require OTP verification upon signing in.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold transition cursor-pointer ${
                        twoFactorEnabled
                          ? "bg-emerald-600 text-white"
                          : "bg-stone-200 text-stone-700 hover:bg-stone-300"
                      }`}
                    >
                      {twoFactorEnabled ? "Enabled" : "Enable 2FA"}
                    </button>
                  </div>

                  {/* Email Notifications */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
                    <div>
                      <h4 className="font-semibold text-[#4A4A4A]">Email Itinerary & Invoices</h4>
                      <p className="text-stone-500 text-[11px]">Receive PDF booking confirmations via email.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailReceipts}
                      onChange={(e) => setEmailReceipts(e.target.checked)}
                      className="w-4 h-4 accent-[#4A4A4A] cursor-pointer"
                    />
                  </div>

                  {/* SMS Alerts */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
                    <div>
                      <h4 className="font-semibold text-[#4A4A4A]">SMS Arrival & Gate Code Alerts</h4>
                      <p className="text-stone-500 text-[11px]">Receive check-in instructions and access PINs.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={smsAlerts}
                      onChange={(e) => setSmsAlerts(e.target.checked)}
                      className="w-4 h-4 accent-[#4A4A4A] cursor-pointer"
                    />
                  </div>

                  {/* Preferred Arrival Window */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
                    <div>
                      <h4 className="font-semibold text-[#4A4A4A]">Target Arrival Window</h4>
                      <p className="text-stone-500 text-[11px]">Helps concierge prepare your room.</p>
                    </div>
                    <select
                      value={arrivalWindow}
                      onChange={(e) => setArrivalWindow(e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs text-[#4A4A4A] bg-white focus:outline-none cursor-pointer"
                    >
                      <option value="15:00">15:00 – 17:00 (Afternoon)</option>
                      <option value="17:00">17:00 – 19:00 (Sunset)</option>
                      <option value="19:00">19:00 – 21:00 (Evening)</option>
                      <option value="late">Late Arrival (Keyless)</option>
                    </select>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#4A4A4A] hover:bg-[#2D2D2D] text-white text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
                    >
                      Save Preferences
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
