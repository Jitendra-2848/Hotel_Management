import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import MuiSelect from "../../components/MuiSelect";
import { roomsApi, type Room, type HostMetrics } from "../../lib/api";
import { CURATED_ROOMS } from "../../data/roomsData";
import {
  Hotel,
  DollarSign,
  Users,
  Star,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Eye,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowUpRight,
  X,
} from "lucide-react";

export const HostDashboard: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>(CURATED_ROOMS);
  const [metrics, setMetrics] = useState<HostMetrics>({
    totalEarnings: 48920,
    occupancyRate: 88,
    totalListings: CURATED_ROOMS.length,
    activeListings: CURATED_ROOMS.length,
    totalReviews: 384,
    averageRating: 4.97,
    pendingInquiries: 5,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isNewListingModalOpen, setIsNewListingModalOpen] = useState(false);

  // New listing form state
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomCategory, setNewRoomCategory] = useState<"chalet" | "villa" | "penthouse" | "loft" | "dome">("chalet");
  const [newRoomPrice, setNewRoomPrice] = useState("450");
  const [newRoomSize, setNewRoomSize] = useState("1,200 sq ft");
  const [newRoomGuests, setNewRoomGuests] = useState("4");
  const [newRoomTagline, setNewRoomTagline] = useState("");
  const [newRoomImage, setNewRoomImage] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadData = async () => {
      try {
        const fetchedRooms = await roomsApi.getAll();
        if (fetchedRooms && fetchedRooms.length > 0) {
          setRooms(fetchedRooms);
        }
        const fetchedMetrics = await roomsApi.getHostMetrics();
        if (fetchedMetrics) {
          setMetrics(fetchedMetrics);
        }
      } catch {
        // Fallback to local state
      }
    };

    loadData();
  }, []);

  const handleToggleStatus = async (id: string) => {
    try {
      await roomsApi.toggleRoomStatus(id);
      setRooms((prev) =>
        prev.map((r) => {
          if (r.id === id) {
            const nextStatus = r.status === "maintenance" ? "active" : "maintenance";
            return { ...r, status: nextStatus };
          }
          return r;
        })
      );
    } catch {
      setRooms((prev) =>
        prev.map((r) => {
          if (r.id === id) {
            const nextStatus = r.status === "maintenance" ? "active" : "maintenance";
            return { ...r, status: nextStatus };
          }
          return r;
        })
      );
    }
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    const newEntry: Partial<Room> = {
      id: newRoomName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name: newRoomName.trim(),
      category: newRoomCategory,
      price: Number(newRoomPrice) || 450,
      size: newRoomSize.trim() || "1,200 sq ft",
      guests: Number(newRoomGuests) || 4,
      tagline: newRoomTagline.trim() || "Hosted mountain retreat in Crafters'Haven",
      featuredImage:
        newRoomImage.trim() ||
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        newRoomImage.trim() ||
          "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
      ],
      status: "active",
      rating: 5.0,
      reviewsCount: 1,
    };

    try {
      const res = await roomsApi.createHostListing(newEntry);
      if (res && res.data) {
        setRooms((prev) => [res.data, ...prev]);
      } else {
        setRooms((prev) => [newEntry as Room, ...prev]);
      }
    } catch {
      setRooms((prev) => [newEntry as Room, ...prev]);
    }

    // Reset and close
    setNewRoomName("");
    setNewRoomTagline("");
    setNewRoomImage("");
    setIsNewListingModalOpen(false);
  };

  const filteredListings = rooms.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || r.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#FFF5F5] text-[#4A4A4A] font-sans selection:bg-[#4A4A4A] selection:text-white flex flex-col justify-between pb-24 md:pb-12">
      <Header />

      <main className="w-full px-4 sm:px-8 lg:px-12 py-6 sm:py-10 max-w-7xl mx-auto flex-1 space-y-8">
        {/* Host Profile Header & Overview */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2B4BD]/40 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-stone-900 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                alt="Host Marcus & Elena"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-stone-900/90 text-white text-[8px] font-bold text-center py-0.5 tracking-wider uppercase">
                Host
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider">
                  <Award className="w-3 h-3 text-amber-700" />
                  <span>Superhost</span>
                </span>
                <span className="inline-flex items-center gap-1 text-stone-500 text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified Identity</span>
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold font-syne text-stone-900">
                Marcus & Elena Vance
              </h1>
              <p className="text-stone-500 text-xs mt-0.5">
                Hosting 24 chalets & panoramic suites in Crafters'Haven Reserve • 100% response rate
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsNewListingModalOpen(true)}
              className="w-full md:w-auto px-4 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs transition cursor-pointer active:scale-95 flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Listing</span>
            </button>
            <Link
              to="/rooms"
              className="px-4 py-2.5 rounded-full border border-stone-300 bg-white hover:bg-stone-100 text-stone-800 font-semibold text-xs transition flex items-center justify-center gap-1 whitespace-nowrap"
            >
              <span>Guest View</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 4 Host Metric Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-stone-500 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Gross Earnings</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <span className="font-syne text-2xl sm:text-3xl font-bold text-stone-900">
                ${metrics.totalEarnings.toLocaleString()}
              </span>
              <span className="text-[11px] text-emerald-600 block mt-0.5 font-medium">+12% vs last month</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-stone-500 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Active Suites</span>
              <Hotel className="w-4 h-4 text-stone-700" />
            </div>
            <div>
              <span className="font-syne text-2xl sm:text-3xl font-bold text-stone-900">
                {rooms.filter((r) => r.status !== "maintenance").length} / {rooms.length}
              </span>
              <span className="text-[11px] text-stone-500 block mt-0.5">All 5 collections managed</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-stone-500 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Occupancy Rate</span>
              <Users className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <span className="font-syne text-2xl sm:text-3xl font-bold text-stone-900">
                {metrics.occupancyRate}%
              </span>
              <span className="text-[11px] text-stone-500 block mt-0.5">Peak autumn season</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-stone-500 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Guest Rating</span>
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            </div>
            <div>
              <span className="font-syne text-2xl sm:text-3xl font-bold text-stone-900">
                {metrics.averageRating} ★
              </span>
              <span className="text-[11px] text-stone-500 block mt-0.5">Across {metrics.totalReviews} reviews</span>
            </div>
          </div>
        </div>

        {/* Listings Management Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <h2 className="font-syne text-lg sm:text-xl font-bold text-stone-900">
                Hosted Listings Inventory
              </h2>
              <p className="text-stone-500 text-xs mt-0.5">
                Manage room rates, toggle maintenance holds, and inspect performance.
              </p>
            </div>

            {/* Search & Category Filter */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search listings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-full border border-stone-200 text-xs focus:outline-hidden focus:border-stone-900"
                />
              </div>

              <div className="min-w-[150px]">
                <MuiSelect
                  value={selectedCategory}
                  onChange={(val) => setSelectedCategory(val)}
                  options={[
                    { value: "all", label: "All Categories" },
                    { value: "chalet", label: "Chalets" },
                    { value: "penthouse", label: "Penthouses" },
                    { value: "villa", label: "Villas" },
                    { value: "loft", label: "Lofts" },
                    { value: "dome", label: "Domes" },
                  ]}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Listings Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 text-[10px] uppercase font-bold text-stone-500 border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Listing</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Nightly Rate</th>
                  <th className="py-3 px-4">Capacity</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredListings.map((room) => {
                  const isMaintenance = room.status === "maintenance";
                  return (
                    <tr key={room.id} className="hover:bg-stone-50/50 transition">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={room.featuredImage}
                          alt={room.name}
                          className="w-12 h-10 rounded-lg object-cover bg-stone-100 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-semibold text-stone-900 block truncate max-w-[200px] sm:max-w-none">
                            {room.name}
                          </span>
                          <span className="text-[10px] text-stone-400">{room.size}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-bold uppercase">
                          {room.category}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-bold text-stone-900">
                        ${room.price} <span className="text-[10px] font-normal text-stone-400">/nt</span>
                      </td>

                      <td className="py-3 px-4">
                        <span>{room.guests} Guests</span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 font-semibold text-stone-900">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                          <span>{room.rating}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            isMaintenance
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {isMaintenance ? (
                            <>
                              <AlertCircle className="w-3 h-3" />
                              <span>Maintenance</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Active</span>
                            </>
                          )}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleStatus(room.id)}
                            className="px-2.5 py-1 rounded-lg border border-stone-200 hover:bg-stone-100 text-[11px] font-medium text-stone-700 transition cursor-pointer"
                          >
                            {isMaintenance ? "Activate" : "Pause"}
                          </button>
                          <Link
                            to={`/rooms/${room.id}`}
                            className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition"
                            title="View suite"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Create Listing Modal */}
      {isNewListingModalOpen && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Host Portal</span>
                <h3 className="text-lg font-bold font-syne text-stone-900">Add New Hosted Suite</h3>
              </div>
              <button
                onClick={() => setIsNewListingModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Suite Title</label>
                <input
                  type="text"
                  placeholder="e.g. Whispering Fir Ridge Chalet"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-stone-900 focus:outline-hidden focus:border-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1 text-xs">Category</label>
                  <MuiSelect
                    value={newRoomCategory}
                    onChange={(val) => setNewRoomCategory(val)}
                    options={[
                      { value: "chalet", label: "Alpine Chalet" },
                      { value: "penthouse", label: "Summit Penthouse" },
                      { value: "villa", label: "Forest Villa" },
                      { value: "loft", label: "Artisan Loft" },
                      { value: "dome", label: "Celestial Eco-Dome" },
                    ]}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Nightly Rate ($)</label>
                  <input
                    type="number"
                    value={newRoomPrice}
                    onChange={(e) => setNewRoomPrice(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-stone-900 focus:outline-hidden focus:border-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Living Area</label>
                  <input
                    type="text"
                    placeholder="e.g. 1,450 sq ft"
                    value={newRoomSize}
                    onChange={(e) => setNewRoomSize(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-stone-900 focus:outline-hidden focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Max Guests</label>
                  <input
                    type="number"
                    value={newRoomGuests}
                    onChange={(e) => setNewRoomGuests(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-stone-900 focus:outline-hidden focus:border-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Tagline & Key Highlights</label>
                <input
                  type="text"
                  placeholder="e.g. Private cedar tub overlooking glacial ridge"
                  value={newRoomTagline}
                  onChange={(e) => setNewRoomTagline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-stone-900 focus:outline-hidden focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Image URL (Unsplash or CDN)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newRoomImage}
                  onChange={(e) => setNewRoomImage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-stone-900 focus:outline-hidden focus:border-stone-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsNewListingModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-100 font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-semibold transition cursor-pointer active:scale-95 shadow-sm"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostDashboard;
