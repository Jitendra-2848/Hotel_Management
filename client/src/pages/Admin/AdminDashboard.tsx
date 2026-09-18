import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/Header";
import { CURATED_ROOMS } from "../../data/roomsData";
import {
  LayoutDashboard,
  Building2,
  CalendarCheck,
  MessageSquare,
  DollarSign,
  Users,
  Sliders,
  ShieldCheck,
  Plus,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  Search,
  Filter,
} from "lucide-react";

type AdminTab =
  | "overview"
  | "suites"
  | "bookings"
  | "inquiries"
  | "pricing"
  | "staff"
  | "settings";

export const AdminDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [searchTerm, setSearchTerm] = useState("");

  // Role Gate Check: If user is not manager/staff, show restricted access
  const isAuthorized = isAuthenticated && (user?.role === "MANAGER" || user?.role === "STAFF");

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#FFF5F5] text-[#4A4A4A] flex flex-col justify-between">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-8 sm:p-12 max-w-md w-full text-center border border-[#E2B4BD]/40 shadow-xl space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold font-syne text-[#4A4A4A]">Restricted Admin Portal</h2>
            <p className="text-xs text-[#4A4A4A]/70 leading-relaxed">
              This administrative environment is restricted to verified sanctuary managers and staff credentials.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/profile"
                className="w-full py-2.5 rounded-full bg-[#4A4A4A] hover:bg-[#2D2D2D] text-brand-white text-xs font-semibold transition"
              >
                Return to My Profile
              </Link>
              <Link
                to="/"
                className="w-full py-2.5 rounded-full border border-[#E2B4BD]/60 hover:bg-[#F7D6D0]/30 text-[#4A4A4A] text-xs font-semibold transition"
              >
                Back to Public Sanctuary
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const ADMIN_PAGES: { id: AdminTab; label: string; icon: React.ElementType; description: string }[] = [
    {
      id: "overview",
      label: "Overview & Metrics",
      icon: LayoutDashboard,
      description: "Real-time occupancy, monthly revenue metrics, and booking velocity.",
    },
    {
      id: "suites",
      label: "Suites & Inventory",
      icon: Building2,
      description: "Manage 8 curated accommodations, housekeeping status, and photography.",
    },
    {
      id: "bookings",
      label: "Bookings & Reservations",
      icon: CalendarCheck,
      description: "Direct guest reservations, check-in schedules, and arrival transfers.",
    },
    {
      id: "inquiries",
      label: "Guest Inquiries & Concierge",
      icon: MessageSquare,
      description: "Direct guest inquiry requests, private ski requests, and dietary needs.",
    },
    {
      id: "pricing",
      label: "Pricing & Seasonal Rates",
      icon: DollarSign,
      description: "Winter peak surge rates, ski season minimum stay thresholds, and taxes.",
    },
    {
      id: "staff",
      label: "Staff & Access Control",
      icon: Users,
      description: "Manage concierge dispatchers, housekeeping leads, and manager keys.",
    },
    {
      id: "settings",
      label: "System & Analytics Settings",
      icon: Sliders,
      description: "API connections, payment gateway credentials, and system audit logs.",
    },
  ];

  const currentTabMeta = ADMIN_PAGES.find((p) => p.id === activeTab)!;

  return (
    <div className="min-h-screen bg-[#FFF5F5] text-[#4A4A4A] font-sans selection:bg-[#4A4A4A] selection:text-brand-white flex flex-col justify-between pb-24 md:pb-12">
      <Header />

      <main className="w-full px-4 sm:px-8 lg:px-12 py-6 sm:py-8 max-w-7xl mx-auto flex-1">
        {/* Top Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2B4BD]/40 shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#4A4A4A] text-brand-white text-[10px] font-bold uppercase tracking-wider">
                Sanctuary Management
              </span>
              <span className="text-xs font-semibold text-[#4A4A4A]/70">Admin Environment</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-syne text-[#4A4A4A]">
              Crafters'Haven Reserve Command
            </h1>
            <p className="text-xs text-[#4A4A4A]/70 mt-1">
              Logged in as <strong className="text-[#4A4A4A]">{user?.name}</strong> ({user?.role}) • All systems operational
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/rooms"
              className="px-4 py-2 rounded-full border border-[#E2B4BD]/60 hover:bg-[#F7D6D0]/30 text-[#4A4A4A] text-xs font-semibold transition cursor-pointer"
            >
              Public Suites
            </Link>
            <Link
              to="/profile"
              className="px-4 py-2 rounded-full bg-[#4A4A4A] hover:bg-[#2D2D2D] text-brand-white text-xs font-semibold transition cursor-pointer shadow-2xs"
            >
              My Profile
            </Link>
          </div>
        </div>

        {/* Multi-Page Tab Navigation (Named Pages for Admin) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-6">
          {ADMIN_PAGES.map((page) => {
            const Icon = page.icon;
            const isActive = activeTab === page.id;
            return (
              <button
                key={page.id}
                onClick={() => setActiveTab(page.id)}
                className={`p-3 rounded-2xl text-left border transition cursor-pointer flex flex-col justify-between min-h-[85px] active:scale-95 ${isActive
                    ? "bg-[#4A4A4A] text-brand-white border-[#4A4A4A] shadow-sm"
                    : "bg-white text-[#4A4A4A] border-[#E2B4BD]/40 hover:bg-[#F7D6D0]/30 shadow-2xs"
                  }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-brand-white" : "text-[#4A4A4A]"}`} />
                <span className="font-bold text-xs leading-tight mt-2 block">{page.label}</span>
              </button>
            );
          })}
        </div>

        {/* Current Active Page Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2B4BD]/40 shadow-xs space-y-6">
          {/* Active Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2B4BD]/20">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#4A4A4A]/60 block mb-0.5">
                Admin Section
              </span>
              <h2 className="text-xl font-bold font-syne text-[#4A4A4A]">{currentTabMeta.label}</h2>
              <p className="text-xs text-[#4A4A4A]/70 mt-0.5">{currentTabMeta.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Live Synchronized</span>
              </span>
            </div>
          </div>

          {/* PAGE 1: OVERVIEW & METRICS */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: "Monthly Reserve Revenue", value: "$48,920", sub: "+18.4% vs last month", icon: DollarSign },
                  { title: "Sanctuary Occupancy", value: "87.5%", sub: "7 of 8 suites reserved", icon: Building2 },
                  { title: "Active Reservations", value: "14", sub: "3 checking in today", icon: CalendarCheck },
                  { title: "Pending Inquiries", value: "5", sub: "Avg reply time: 18 mins", icon: MessageSquare },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="p-4 rounded-2xl bg-[#FFF5F5] border border-[#E2B4BD]/40">
                      <div className="flex items-center justify-between text-[#4A4A4A]/70 mb-2">
                        <span className="text-xs font-semibold">{stat.title}</span>
                        <Icon className="w-4 h-4 text-[#4A4A4A]" />
                      </div>
                      <div className="text-2xl font-bold font-syne text-[#4A4A4A]">{stat.value}</div>
                      <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>{stat.sub}</span>
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="p-5 rounded-2xl border border-[#E2B4BD]/30 bg-white">
                <h3 className="font-bold text-sm text-[#4A4A4A] mb-3">Recent Alpine Reservations</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E2B4BD]/20 text-[#4A4A4A]/60">
                        <th className="pb-2 font-semibold">Guest</th>
                        <th className="pb-2 font-semibold">Sanctuary</th>
                        <th className="pb-2 font-semibold">Dates</th>
                        <th className="pb-2 font-semibold">Total</th>
                        <th className="pb-2 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2B4BD]/10 text-[#4A4A4A]">
                      <tr>
                        <td className="py-2.5 font-semibold">Eleanor Vance</td>
                        <td>Whispering Pines Chalet</td>
                        <td>Oct 12 – Oct 16 (4 nights)</td>
                        <td className="font-bold font-syne">$2,650</td>
                        <td>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                            Confirmed
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-semibold">Marcus Sterling</td>
                        <td>Glacial Vista Summit Penthouse</td>
                        <td>Nov 03 – Nov 08 (5 nights)</td>
                        <td className="font-bold font-syne">$4,200</td>
                        <td>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                            Confirmed
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* PAGE 2: SUITES & INVENTORY */}
          {activeTab === "suites" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs text-[#4A4A4A]/70">
                  Showing {CURATED_ROOMS.length} verified suites currently published in the catalog.
                </p>
                <button
                  onClick={() => alert("Add Suite wizard will open in next release.")}
                  className="px-4 py-2 rounded-full bg-[#4A4A4A] text-brand-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs hover:bg-[#2D2D2D] transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Suite</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CURATED_ROOMS.map((room) => (
                  <div
                    key={room.id}
                    className="p-4 rounded-2xl border border-[#E2B4BD]/40 flex items-center gap-4 bg-[#FFF5F5]/40"
                  >
                    <img
                      src={room.featuredImage}
                      alt={room.name}
                      className="w-20 h-20 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-[#4A4A4A]/60">{room.category}</span>
                        <span className="text-xs font-bold font-syne text-[#4A4A4A]">${room.price} / night</span>
                      </div>
                      <h4 className="font-bold text-sm text-[#4A4A4A] font-syne truncate">{room.name}</h4>
                      <p className="text-[11px] text-[#4A4A4A]/70 truncate">{room.tagline}</p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-[#4A4A4A]/80">
                        <span>Max {room.guests} Guests</span>
                        <span>•</span>
                        <span>{room.size}</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-medium">Ready</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PAGE 3: BOOKINGS & RESERVATIONS */}
          {activeTab === "bookings" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#FFF5F5] border border-[#E2B4BD]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Search className="w-4 h-4 text-[#4A4A4A]/60" />
                  <input
                    type="text"
                    placeholder="Search by reservation code or guest..."
                    className="bg-transparent border-none text-xs text-[#4A4A4A] focus:outline-none w-full sm:w-64"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#4A4A4A]/60">Status filter:</span>
                  <select className="px-2.5 py-1 rounded-lg border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] bg-white">
                    <option>All Reservations</option>
                    <option>Confirmed</option>
                    <option>Completed</option>
                  </select>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-[#E2B4BD]/40 bg-white space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-[#E2B4BD]/20">
                  <div>
                    <span className="font-bold text-sm text-[#4A4A4A]">Confirmation #CHS-9482-PINE</span>
                    <p className="text-xs text-[#4A4A4A]/70">Whispering Pines Alpine Chalet • 4 Nights</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                    Active Arrival Oct 12
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-[#4A4A4A]/80">
                  <div>
                    <span className="text-[10px] text-[#4A4A4A]/60 block">Guest Name</span>
                    <strong className="text-[#4A4A4A]">Eleanor Vance</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#4A4A4A]/60 block">Party Size</span>
                    <strong className="text-[#4A4A4A]">2 Adults</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#4A4A4A]/60 block">Arrival Transfer</span>
                    <strong className="text-[#4A4A4A]">Private Helipad Dispatch</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#4A4A4A]/60 block">Total Billed</span>
                    <strong className="text-[#4A4A4A] font-syne">$2,650.00</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PAGE 4: GUEST INQUIRIES & CONCIERGE */}
          {activeTab === "inquiries" && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#FFF5F5] border border-[#E2B4BD]/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="font-bold text-xs text-[#4A4A4A]">Inquiry from Julian Rhys</span>
                  </div>
                  <span className="text-[11px] text-[#4A4A4A]/60">24 mins ago</span>
                </div>
                <p className="text-xs text-[#4A4A4A]/80 leading-relaxed">
                  "Hello, we will be arriving via helicopter transfer around 16:30. Can we request private ski boot fitting in the chalet upon arrival?"
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => alert("Direct Concierge reply window opened.")}
                    className="px-3.5 py-1.5 rounded-full bg-[#4A4A4A] text-brand-white text-xs font-semibold hover:bg-[#2D2D2D] transition cursor-pointer"
                  >
                    Reply via Concierge Desk
                  </button>
                  <button
                    onClick={() => alert("Inquiry marked as fulfilled.")}
                    className="px-3.5 py-1.5 rounded-full border border-[#E2B4BD]/60 hover:bg-[#F7D6D0]/30 text-[#4A4A4A] text-xs font-semibold transition cursor-pointer"
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PAGE 5: PRICING & SEASONAL RATES */}
          {activeTab === "pricing" && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#FFF5F5] border border-[#E2B4BD]/40">
                <h4 className="font-bold text-sm text-[#4A4A4A] mb-1">Winter Ski Peak Season Surcharges</h4>
                <p className="text-xs text-[#4A4A4A]/70 mb-4">
                  Define automated multiplier rates applied during high alpine season (Dec 15 – Mar 30).
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-white border border-[#E2B4BD]/30">
                    <span className="text-[11px] text-[#4A4A4A]/70 block mb-1">Peak Season Multiplier</span>
                    <strong className="text-base font-syne text-[#4A4A4A]">1.35× Rate</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[#E2B4BD]/30">
                    <span className="text-[11px] text-[#4A4A4A]/70 block mb-1">Minimum Night Threshold</span>
                    <strong className="text-base font-syne text-[#4A4A4A]">3 Nights Min</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[#E2B4BD]/30">
                    <span className="text-[11px] text-[#4A4A4A]/70 block mb-1">Local Alpine Tax</span>
                    <strong className="text-base font-syne text-[#4A4A4A]">8.0% Inclusive</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PAGE 6: STAFF & ACCESS CONTROL */}
          {activeTab === "staff" && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#FFF5F5] border border-[#E2B4BD]/40">
                <h4 className="font-bold text-sm text-[#4A4A4A] mb-1">Authorized Management & Staff Roster</h4>
                <p className="text-xs text-[#4A4A4A]/70 mb-3">
                  Only users with MANAGER or STAFF security roles can access this dashboard.
                </p>
                <div className="space-y-2">
                  {[
                    { name: "Executive Sanctuary Lead", role: "MANAGER", email: "manager@craftershaven.com" },
                    { name: "Alpine Concierge Dispatcher", role: "STAFF", email: "concierge@craftershaven.com" },
                    { name: "Head of Chalet Operations", role: "STAFF", email: "operations@craftershaven.com" },
                  ].map((staff, i) => (
                    <div key={i} className="p-3 rounded-xl bg-white border border-[#E2B4BD]/30 flex items-center justify-between">
                      <div>
                        <strong className="text-xs text-[#4A4A4A] block">{staff.name}</strong>
                        <span className="text-[11px] text-[#4A4A4A]/60">{staff.email}</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#F7D6D0]/60 text-[#4A4A4A] text-[10px] font-bold">
                        {staff.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PAGE 7: SYSTEM & ANALYTICS SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#FFF5F5] border border-[#E2B4BD]/40 space-y-3">
                <h4 className="font-bold text-sm text-[#4A4A4A]">System Configuration & Audit Logs</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#E2B4BD]/30">
                    <div>
                      <strong className="text-[#4A4A4A] block">Express Direct Booking Engine</strong>
                      <span className="text-[#4A4A4A]/60 text-[11px]">Instant client checkout modal</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold text-[10px]">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#E2B4BD]/30">
                    <div>
                      <strong className="text-[#4A4A4A] block">Local Storage Reservation Mirror</strong>
                      <span className="text-[#4A4A4A]/60 text-[11px]">Syncs guest bookings to profile</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold text-[10px]">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
