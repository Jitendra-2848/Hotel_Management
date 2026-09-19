import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/Header";
import { CURATED_ROOMS } from "../../data/roomsData";
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

  const [activeTab, setActiveTab] = useState<"reservations" | "personal" | "wishlist" | "settings">("reservations");
  const [reservations, setReservations] = useState<SavedReservation[]>([]);
  const [wishlistRooms, setWishlistRooms] = useState<typeof CURATED_ROOMS>([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Load saved reservations
    try {
      const savedRes = localStorage.getItem("chs_reservations");
      if (savedRes) {
        setReservations(JSON.parse(savedRes));
      } else {
        setReservations([]);
      }
    } catch {
      setReservations([]);
    }

    // Load wishlist
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
  }, []);

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

  return (
    <div className="min-h-screen bg-[#FFF5F5] text-[#4A4A4A] font-sans selection:bg-[#4A4A4A] selection:text-brand-white flex flex-col justify-between pb-24 md:pb-12">
      <Header />

      <main className="w-full px-4 sm:px-8 lg:px-12 py-6 sm:py-10 max-w-6xl mx-auto flex-1">
        {/* User Hero Identity Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2B4BD]/40 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#4A4A4A] text-brand-white flex items-center justify-center font-syne font-bold text-2xl shadow-md shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : "G"}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-xl sm:text-2xl font-bold font-syne text-[#4A4A4A]">
                    {user?.name || "Distinguished Guest"}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F7D6D0]/60 text-[#4A4A4A] text-[10px] font-bold uppercase tracking-wider border border-[#E2B4BD]/50">
                    {user?.role || "GUEST"}
                  </span>
                </div>
                <p className="text-xs text-[#4A4A4A]/70 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#4A4A4A]/60" />
                  <span>{user?.email || "guest@craftershaven.com"}</span>
                </p>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-[#4A4A4A]/60">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Alpine Connoisseur Tier</span>
                  </span>
                  <span>•</span>
                  <span>Member since 2026</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Link
                to="/admin"
                className="px-4 py-2 rounded-full bg-[#4A4A4A] hover:bg-[#2D2D2D] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
              >
                <Building className="w-3.5 h-3.5" />
                <span>Become a Host</span>
              </Link>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="px-4 py-2 rounded-full border border-[#E2B4BD]/60 hover:bg-[#F7D6D0]/30 text-[#4A4A4A] text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-[#4A4A4A]" />
                <span>{isLoggingOut ? "Logging out..." : "Log Out"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#E2B4BD]/30 pb-3 mb-6 overflow-x-auto scrollbar-none">
          {[
            { id: "reservations", label: "My Reservations", icon: Calendar, badge: reservations.length },
            { id: "wishlist", label: "Saved Wishlist", icon: Heart, badge: wishlistRooms.length },
            { id: "personal", label: "Personal Details", icon: UserIcon },
            { id: "settings", label: "Preferences & Security", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition cursor-pointer active:scale-95 whitespace-nowrap ${isActive
                    ? "bg-[#4A4A4A] text-brand-white shadow-xs"
                    : "bg-white text-[#4A4A4A] border border-[#E2B4BD]/40 hover:bg-[#F7D6D0]/30 shadow-2xs"
                  }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-brand-white" : "text-[#4A4A4A]"}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? "bg-white/20 text-brand-white" : "bg-[#F7D6D0]/50 text-[#4A4A4A]"
                      }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content 1: Reservations */}
        {activeTab === "reservations" && (
          <div className="space-y-4">
            {reservations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reservations.map((res) => (
                  <div
                    key={res.id}
                    className="bg-white rounded-2xl p-5 border border-[#E2B4BD]/40 shadow-xs hover:border-[#4A4A4A] transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{res.status}</span>
                        </span>
                        <span className="text-[11px] font-mono text-[#4A4A4A]/60">
                          {res.confirmationNumber}
                        </span>
                      </div>

                      <h3 className="font-bold font-syne text-base text-[#4A4A4A] mb-1">
                        {res.roomName}
                      </h3>

                      <div className="space-y-1 text-xs text-[#4A4A4A]/80 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-[#4A4A4A]/60" />
                          <span>
                            {res.checkIn} → {res.checkOut} ({res.nights} nights)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-[#4A4A4A]/60" />
                          <span>Check-in 15:00 • Private Concierge Check-in</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#E2B4BD]/20 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#4A4A4A]/60 uppercase font-semibold block">Total Paid</span>
                        <span className="text-base font-bold font-syne text-[#4A4A4A]">${res.totalAmount}</span>
                      </div>
                      <Link
                        to={`/rooms/${res.roomId}`}
                        className="px-3.5 py-1.5 rounded-full bg-[#4A4A4A] hover:bg-[#2D2D2D] text-brand-white text-xs font-semibold transition active:scale-95 flex items-center gap-1 shadow-2xs"
                      >
                        <span>View Sanctuary</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-10 border border-[#E2B4BD]/40 text-center space-y-3">
                <Calendar className="w-10 h-10 text-[#4A4A4A]/40 mx-auto" />
                <h3 className="font-bold text-base text-[#4A4A4A]">No Active Reservations Found</h3>
                <p className="text-xs text-[#4A4A4A]/70 max-w-sm mx-auto">
                  Explore our verified mountain chalets and stargazing domes to craft your next alpine escape.
                </p>
                <Link
                  to="/rooms"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#4A4A4A] text-brand-white text-xs font-semibold shadow-sm hover:bg-[#2D2D2D] transition"
                >
                  <span>Explore Suites</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab Content 2: Wishlist */}
        {activeTab === "wishlist" && (
          <div className="space-y-4">
            {wishlistRooms.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlistRooms.map((room) => (
                  <div
                    key={room.id}
                    className="bg-white rounded-2xl overflow-hidden border border-[#E2B4BD]/40 shadow-xs flex flex-col justify-between"
                  >
                    <div className="relative h-44 w-full bg-[#2A2A2A]">
                      <img
                        src={room.featuredImage}
                        alt={room.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => handleRemoveWishlist(room.id)}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-rose-600 transition shadow-xs cursor-pointer"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-[#4A4A4A]/70 mb-1">
                          <span className="font-semibold uppercase tracking-wider">{room.category}</span>
                          <span>★ {room.rating}</span>
                        </div>
                        <h4 className="font-bold text-sm text-[#4A4A4A] font-syne line-clamp-1">{room.name}</h4>
                        <p className="text-xs text-[#4A4A4A]/70 line-clamp-1 mt-0.5">{room.tagline}</p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-[#E2B4BD]/20">
                        <span className="font-bold text-sm text-[#4A4A4A] font-syne">
                          ${room.price} <span className="text-[11px] font-normal text-[#4A4A4A]/60">/ night</span>
                        </span>
                        <Link
                          to={`/rooms/${room.id}`}
                          className="px-3 py-1.5 rounded-full bg-[#4A4A4A] text-brand-white text-xs font-semibold hover:bg-[#2D2D2D] transition flex items-center gap-1 shadow-2xs"
                        >
                          <span>Reserve</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-10 border border-[#E2B4BD]/40 text-center space-y-3">
                <Heart className="w-10 h-10 text-[#4A4A4A]/40 mx-auto" />
                <h3 className="font-bold text-base text-[#4A4A4A]">Your Wishlist is Empty</h3>
                <p className="text-xs text-[#4A4A4A]/70 max-w-sm mx-auto">
                  Click the heart icon on any chalet card to save accommodations for future retreats.
                </p>
                <Link
                  to="/rooms"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#4A4A4A] text-brand-white text-xs font-semibold shadow-sm hover:bg-[#2D2D2D] transition"
                >
                  <span>Browse Accommodations</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab Content 3: Personal Details */}
        {activeTab === "personal" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2B4BD]/40 shadow-xs max-w-2xl">
            <h3 className="text-base font-bold font-syne text-[#4A4A4A] mb-4 pb-2 border-b border-[#E2B4BD]/20">
              Personal Information & Concierge Profile
            </h3>
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#4A4A4A]/70 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    defaultValue={user?.name || "Eleanor Vance"}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2B4BD]/60 text-xs text-[#4A4A4A] bg-white focus:outline-none focus:border-[#4A4A4A]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#4A4A4A]/70 mb-1">Email Address</label>
                  <input
                    type="email"
                    defaultValue={user?.email || "eleanor@haven.com"}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2B4BD]/60 text-xs text-[#4A4A4A] bg-white focus:outline-none focus:border-[#4A4A4A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#4A4A4A]/70 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    defaultValue="+1 (555) 349-9210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2B4BD]/60 text-xs text-[#4A4A4A] bg-white focus:outline-none focus:border-[#4A4A4A]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#4A4A4A]/70 mb-1">Preferred Language</label>
                  <input
                    type="text"
                    defaultValue="English (US) / French"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2B4BD]/60 text-xs text-[#4A4A4A] bg-white focus:outline-none focus:border-[#4A4A4A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#4A4A4A]/70 mb-1">Preferred Alpine Destination</label>
                <input
                  type="text"
                  defaultValue="Zermatt Valley / St. Moritz Crest"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2B4BD]/60 text-xs text-[#4A4A4A] bg-white focus:outline-none focus:border-[#4A4A4A]"
                />
              </div>

              <div className="pt-3 border-t border-[#E2B4BD]/20 flex justify-end">
                <button
                  type="button"
                  onClick={() => alert("Personal details updated successfully.")}
                  className="px-5 py-2.5 rounded-full bg-[#4A4A4A] hover:bg-[#2D2D2D] text-brand-white text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 4: Settings */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2B4BD]/40 shadow-xs max-w-2xl space-y-6">
            <div>
              <h3 className="text-base font-bold font-syne text-[#4A4A4A] mb-1">Account Preferences</h3>
              <p className="text-xs text-[#4A4A4A]/70">Configure your security, notifications, and currency settings.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FFF5F5] border border-[#E2B4BD]/30">
                <div>
                  <h4 className="font-semibold text-[#4A4A4A]">Display Currency</h4>
                  <p className="text-[#4A4A4A]/60 text-[11px]">Choose currency for suite pricing and receipts.</p>
                </div>
                <select className="px-3 py-1.5 rounded-xl border border-[#E2B4BD]/60 text-xs text-[#4A4A4A] bg-white focus:outline-none">
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="CHF">CHF (Fr)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FFF5F5] border border-[#E2B4BD]/30">
                <div>
                  <h4 className="font-semibold text-[#4A4A4A]">Concierge SMS Notifications</h4>
                  <p className="text-[#4A4A4A]/60 text-[11px]">Receive arrival gates and private ski transfer updates via SMS.</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#4A4A4A] cursor-pointer" />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FFF5F5] border border-[#E2B4BD]/30">
                <div>
                  <h4 className="font-semibold text-[#4A4A4A]">Seasonal Sanctuary Letters</h4>
                  <p className="text-[#4A4A4A]/60 text-[11px]">Receive exclusive invitations to new chalet unveilings.</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#4A4A4A] cursor-pointer" />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
