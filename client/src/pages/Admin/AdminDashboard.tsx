import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/Header";
import { CURATED_ROOMS, DEFAULT_ADMIN_EMAIL } from "../../data/roomsData";
import api, { Room, roomsApi } from "../../lib/api";
import {
  LayoutGrid,
  Calendar,
  Building,
  Bed,
  Users,
  DollarSign,
  CreditCard,
  MessageSquare,
  Clock,
  TrendingUp,
  Bell,
  FileText,
  Search,
  ChevronDown,
  Plus,
  CheckCircle2,
  X,
  ExternalLink,
  ShieldCheck,
  Check,
  Trash2,
  Sparkles,
  MapPin,
  ArrowUpRight,
  ChevronRight,
  Send,
  AlertCircle,
} from "lucide-react";

type NavTab =
  | "overview"
  | "bookings"
  | "providers"
  | "services"
  | "customers"
  | "commissions"
  | "payouts"
  | "disputes"
  | "approvals"
  | "analytics"
  | "notifications"
  | "policies";

interface ManagementTask {
  id: string;
  title: string;
  category: "Approval" | "Concierge" | "Housekeeping" | "Maintenance";
  due: string;
  urgent?: boolean;
  completed: boolean;
}

interface GuestQuery {
  id: string;
  guestName: string;
  roomName: string;
  avatar: string;
  message: string;
  timestamp: string;
  status: "pending" | "resolved";
  reply?: string;
}

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<NavTab>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [trendMode, setTrendMode] = useState<"weekly" | "monthly">("monthly");
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
  const [selectedQueryId, setSelectedQueryId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  // Current logged in email (defaults to designated admin prajapatijitendra2848@gmail.com if testing)
  const currentEmail = user?.email || DEFAULT_ADMIN_EMAIL;
  const currentName = user?.name || "Jitendra Prajapati";

  // Dynamic Room Inventory State loaded from PostgreSQL DB
  const [rooms, setRooms] = useState<Room[]>([]);
  const [tasks, setTasks] = useState<ManagementTask[]>([]);
  const [queries, setQueries] = useState<GuestQuery[]>([]);

  useEffect(() => {
    // 1. Fetch Rooms from Database
    roomsApi.getAll().then((data) => {
      if (data && data.length > 0) {
        setRooms(data);
      }
    });

    // 2. Fetch Tasks from DB
    api
      .get<{ success: boolean; data: any[] }>("/rooms/host/tasks?hostEmail=" + currentEmail)
      .then((res) => {
        if (res.data?.data && res.data.data.length > 0) {
          setTasks(
            res.data.data.map((t: any) => ({
              id: t.id,
              title: t.title,
              category: (t.suite as any) || "Concierge",
              due: t.due,
              urgent: t.priority === "urgent",
              completed: t.completed,
            }))
          );
        }
      })
      .catch(() => {});

    // 3. Fetch Inquiries from DB
    api
      .get<{ success: boolean; data: any[] }>("/rooms/host/queries?hostEmail=" + currentEmail)
      .then((res) => {
        if (res.data?.data && res.data.data.length > 0) {
          setQueries(
            res.data.data.map((q: any) => ({
              id: q.id,
              guestName: q.guestName,
              roomName: q.roomName,
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
              message: q.message,
              timestamp: q.date,
              status: q.status,
              reply: q.reply,
            }))
          );
        }
      })
      .catch(() => {});
  }, [currentEmail]);

  // New Room Form State
  const [newRoomData, setNewRoomData] = useState({
    name: "",
    category: "chalet" as any,
    price: 450,
    size: "1,100 sq ft",
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    bed: "1 King Bed",
    tagline: "High alpine timber sanctuary with mountain panorama",
    description: "Architectural chalet crafted with natural Douglas fir beams, floor-to-ceiling glass, and heated outdoor cedar hot tub.",
    featuredImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
  });

  // Host's rooms: rooms matching current email, or all curated rooms if designated admin
  const hostRooms = useMemo(() => {
    return rooms.filter((r) => {
      if (currentEmail === DEFAULT_ADMIN_EMAIL) return true;
      return !r.hostEmail || r.hostEmail === currentEmail;
    });
  }, [rooms, currentEmail]);

  // Task toggler
  const toggleTask = (id: string) => {
    const target = tasks.find((t) => t.id === id);
    const nextVal = target ? !target.completed : false;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: nextVal } : t))
    );
    api.patch(`/rooms/host/tasks/${id}`, { completed: nextVal }).catch(() => {});
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: ManagementTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      category: "Concierge",
      due: "Today",
      completed: false,
    };
    setTasks((prev) => [newTask, ...prev]);
    setNewTaskTitle("");

    api.post("/rooms/host/tasks", {
      title: newTask.title,
      suite: newTask.category,
      due: newTask.due,
      hostEmail: currentEmail,
    }).catch(() => {});
  };

  const handleSendReply = (queryId: string) => {
    if (!replyText.trim()) return;
    const text = replyText.trim();
    setQueries((prev) =>
      prev.map((q) =>
        q.id === queryId
          ? { ...q, status: "resolved", reply: text }
          : q
      )
    );
    setReplyText("");
    setSelectedQueryId(null);
    api.post(`/rooms/host/queries/${queryId}/reply`, { reply: text }).catch(() => {});
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomData.name.trim()) return;

    try {
      const res = await api.post("/rooms/host/new", {
        ...newRoomData,
        hostEmail: currentEmail,
        hostName: currentName,
      });
      if (res.data?.data) {
        setRooms((prev) => [res.data.data, ...prev]);
      }
    } catch {
      const created: Room = {
        id: `room-${Date.now()}`,
        name: newRoomData.name.trim(),
        category: newRoomData.category,
        price: Number(newRoomData.price) || 350,
        size: newRoomData.size,
        guests: Number(newRoomData.guests) || 2,
        bedrooms: Number(newRoomData.bedrooms) || 1,
        bathrooms: Number(newRoomData.bathrooms) || 1,
        bed: newRoomData.bed,
        tagline: newRoomData.tagline,
        description: newRoomData.description,
        featuredImage: newRoomData.featuredImage,
        gallery: [newRoomData.featuredImage],
        hostEmail: currentEmail,
        hostName: currentName,
        status: "active",
        amenities: [
          { title: "Comfort", items: ["Cedar Tub", "Wood Fireplace", "Panoramic Glass"] },
        ],
        rating: 5.0,
        reviewsCount: 1,
        policies: {
          checkIn: "3:00 PM",
          checkOut: "11:00 AM",
          cancellation: "Full refund 48 hours prior to arrival",
        },
      };
      setRooms((prev) => [created, ...prev]);
    }

    setIsAddRoomModalOpen(false);
    setNewRoomData({
      name: "",
      category: "chalet",
      price: 450,
      size: "1,100 sq ft",
      guests: 4,
      bedrooms: 2,
      bathrooms: 2,
      bed: "1 King Bed",
      tagline: "High alpine timber sanctuary with mountain panorama",
      description: "Architectural chalet crafted with natural Douglas fir beams, floor-to-ceiling glass, and heated outdoor cedar hot tub.",
      featuredImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
    });
  };

  const pendingTasksCount = tasks.filter((t) => !t.completed).length;
  const urgentTasksCount = tasks.filter((t) => !t.completed && t.urgent).length;
  const pendingQueriesCount = queries.filter((q) => q.status === "pending").length;

  return (
    <div className="min-h-screen bg-[#F7F7F8] text-[#222222] font-sans flex flex-col">
      {/* Top Header Navigation matching Marketplace standard */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#EBEBEB] px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-[#FF385C] text-white flex items-center justify-center font-black text-base shadow-sm group-hover:opacity-90 transition">
              CH
            </div>
            <div className="hidden sm:block">
              <span className="font-syne font-extrabold text-base tracking-tight text-[#222222] block leading-none">
                Marketplace
              </span>
              <span className="text-[10px] text-[#717171] font-medium tracking-wide">
                Admin & Host Command
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Global Marketplace Search Bar */}
        <div className="flex-1 max-w-xl mx-auto min-w-0">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#717171] absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by bookings, users, providers, services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#F7F7F8] hover:bg-[#EFEFEF] focus:bg-white border border-[#E5E5E5] focus:border-[#222222] rounded-xl text-xs text-[#222222] placeholder:text-[#717171] focus:outline-none transition"
            />
          </div>
        </div>

        {/* Right: Notification & Admin User Profile */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setShowNotificationToast(!showNotificationToast)}
            className="relative p-2 rounded-full hover:bg-[#F2F2F2] transition text-[#222222] cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-[#FF385C] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {pendingQueriesCount + urgentTasksCount || 3}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddRoomModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#222222] hover:bg-black text-white text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Suite</span>
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#EBEBEB]">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
              alt="Admin User"
              className="w-8 h-8 rounded-full object-cover border border-[#EBEBEB]"
            />
            <div className="hidden md:block text-left">
              <span className="block text-xs font-bold text-[#222222] truncate max-w-[130px]">
                {currentName}
              </span>
              <span className="block text-[10px] text-[#717171] leading-none">
                Admin Host
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#717171]" />
          </div>
        </div>
      </header>

      {/* Main Workspace Layout (Sidebar + Content Canvas) */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        {/* LEFT SIDEBAR NAVIGATION */}
        <aside className="w-full md:w-60 lg:w-64 bg-white border-r border-[#EBEBEB] p-4 flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            {/* GROUP 1: MAIN */}
            <div>
              <span className="px-3 text-[10px] uppercase font-bold tracking-wider text-[#999999] block mb-2">
                Main
              </span>
              <nav className="space-y-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("overview")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    activeTab === "overview"
                      ? "bg-[#FF385C] text-white shadow-xs"
                      : "text-[#4A4A4A] hover:bg-[#F7F7F8]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutGrid className="w-4 h-4" />
                    <span>Overview</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("bookings")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    activeTab === "bookings"
                      ? "bg-[#FF385C] text-white shadow-xs"
                      : "text-[#4A4A4A] hover:bg-[#F7F7F8]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4" />
                    <span>Bookings</span>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      activeTab === "bookings" ? "bg-white/25 text-white" : "bg-[#F2F2F2] text-[#4A4A4A]"
                    }`}
                  >
                    14
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("providers")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    activeTab === "providers"
                      ? "bg-[#FF385C] text-white shadow-xs"
                      : "text-[#4A4A4A] hover:bg-[#F7F7F8]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Building className="w-4 h-4" />
                    <span>Service Providers</span>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      activeTab === "providers" ? "bg-white/25 text-white" : "bg-[#F2F2F2] text-[#4A4A4A]"
                    }`}
                  >
                    100
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("services")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    activeTab === "services"
                      ? "bg-[#FF385C] text-white shadow-xs"
                      : "text-[#4A4A4A] hover:bg-[#F7F7F8]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Bed className="w-4 h-4" />
                    <span>My Suites ({hostRooms.length})</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("customers")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    activeTab === "customers"
                      ? "bg-[#FF385C] text-white shadow-xs"
                      : "text-[#4A4A4A] hover:bg-[#F7F7F8]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4" />
                    <span>Customers</span>
                  </div>
                </button>
              </nav>
            </div>

            {/* GROUP 2: FINANCE */}
            <div>
              <span className="px-3 text-[10px] uppercase font-bold tracking-wider text-[#999999] block mb-2">
                Finance
              </span>
              <nav className="space-y-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("commissions")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    activeTab === "commissions"
                      ? "bg-[#FF385C] text-white shadow-xs"
                      : "text-[#4A4A4A] hover:bg-[#F7F7F8]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <DollarSign className="w-4 h-4" />
                    <span>Commissions</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("payouts")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    activeTab === "payouts"
                      ? "bg-[#FF385C] text-white shadow-xs"
                      : "text-[#4A4A4A] hover:bg-[#F7F7F8]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="w-4 h-4" />
                    <span>Payouts</span>
                  </div>
                </button>
              </nav>
            </div>

            {/* GROUP 3: OPERATIONS */}
            <div>
              <span className="px-3 text-[10px] uppercase font-bold tracking-wider text-[#999999] block mb-2">
                Operations
              </span>
              <nav className="space-y-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("disputes")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    activeTab === "disputes"
                      ? "bg-[#FF385C] text-white shadow-xs"
                      : "text-[#4A4A4A] hover:bg-[#F7F7F8]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="w-4 h-4" />
                    <span>Disputes & Queries</span>
                  </div>
                  {pendingQueriesCount > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 font-bold">
                      {pendingQueriesCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("approvals")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    activeTab === "approvals"
                      ? "bg-[#FF385C] text-white shadow-xs"
                      : "text-[#4A4A4A] hover:bg-[#F7F7F8]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4" />
                    <span>Pending Tasks</span>
                  </div>
                  {pendingTasksCount > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-900 font-bold">
                      {pendingTasksCount}
                    </span>
                  )}
                </button>
              </nav>
            </div>

            {/* GROUP 4: SETTINGS / INSIGHTS */}
            <div>
              <span className="px-3 text-[10px] uppercase font-bold tracking-wider text-[#999999] block mb-2">
                Insights
              </span>
              <nav className="space-y-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("analytics")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    activeTab === "analytics"
                      ? "bg-[#FF385C] text-white shadow-xs"
                      : "text-[#4A4A4A] hover:bg-[#F7F7F8]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <TrendingUp className="w-4 h-4" />
                    <span>Analytics & Reports</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("policies")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    activeTab === "policies"
                      ? "bg-[#FF385C] text-white shadow-xs"
                      : "text-[#4A4A4A] hover:bg-[#F7F7F8]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4" />
                    <span>Content & Policies</span>
                  </div>
                </button>
              </nav>
            </div>
          </div>

          {/* Quick Return to Public Site */}
          <div className="pt-4 border-t border-[#EBEBEB] space-y-2">
            <Link
              to="/rooms"
              className="w-full py-2 px-3 rounded-xl border border-[#E5E5E5] hover:bg-[#F7F7F8] text-[#222222] text-xs font-semibold flex items-center justify-between transition cursor-pointer"
            >
              <span>View Public Suites</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#717171]" />
            </Link>
          </div>
        </aside>

        {/* RIGHT CANVAS / WORKSPACE */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6">
          {/* TAB: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Dashboard Title & Welcome */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-syne text-[#222222] tracking-tight">
                  Dashboard Overview
                </h1>
                <p className="text-xs sm:text-sm text-[#717171] mt-0.5">
                  Welcome back, <strong className="text-[#222222]">{currentName}</strong>! Here's what's happening with your marketplace today.
                </p>
              </div>

              {/* 4 Stat KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Bookings */}
                <div className="bg-white p-5 rounded-2xl border border-[#EBEBEB] shadow-2xs space-y-3">
                  <div className="flex items-center gap-2 text-[#717171]">
                    <div className="p-1.5 rounded-lg bg-[#F7F7F8]">
                      <Calendar className="w-4 h-4 text-[#222222]" />
                    </div>
                    <span className="text-xs font-medium">Bookings</span>
                  </div>
                  <div className="text-3xl font-extrabold font-syne text-[#222222]">
                    1,400
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+10.4% from last month</span>
                  </div>
                </div>

                {/* 2. Active Providers */}
                <div className="bg-white p-5 rounded-2xl border border-[#EBEBEB] shadow-2xs space-y-3">
                  <div className="flex items-center gap-2 text-[#717171]">
                    <div className="p-1.5 rounded-lg bg-[#F7F7F8]">
                      <Building className="w-4 h-4 text-[#222222]" />
                    </div>
                    <span className="text-xs font-medium">Active Providers</span>
                  </div>
                  <div className="text-3xl font-extrabold font-syne text-[#222222]">
                    100
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+10 from new this week</span>
                  </div>
                </div>

                {/* 3. Platform Revenue */}
                <div className="bg-white p-5 rounded-2xl border border-[#EBEBEB] shadow-2xs space-y-3">
                  <div className="flex items-center gap-2 text-[#717171]">
                    <div className="p-1.5 rounded-lg bg-[#F7F7F8]">
                      <DollarSign className="w-4 h-4 text-[#222222]" />
                    </div>
                    <span className="text-xs font-medium">Platform Revenue</span>
                  </div>
                  <div className="text-3xl font-extrabold font-syne text-[#222222]">
                    $20,000
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-rose-500">
                    <span>↘ -0.50% from last month</span>
                  </div>
                </div>

                {/* 4. Pending Approvals */}
                <div className="bg-white p-5 rounded-2xl border border-[#EBEBEB] shadow-2xs space-y-3">
                  <div className="flex items-center gap-2 text-[#717171]">
                    <div className="p-1.5 rounded-lg bg-[#F7F7F8]">
                      <Clock className="w-4 h-4 text-[#222222]" />
                    </div>
                    <span className="text-xs font-medium">Pending Approvals</span>
                  </div>
                  <div className="text-3xl font-extrabold font-syne text-[#222222]">
                    12
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-[#717171]">
                    <span className="text-rose-600 font-bold">5 urgent</span>
                    <span>need review</span>
                  </div>
                </div>
              </div>

              {/* TWO CHART CARDS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart 1: Commission Revenue (Bar Chart) */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#EBEBEB] shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#222222]">Commission Revenue</h3>
                    <div className="w-6 h-6 rounded-full bg-[#F7F7F8] flex items-center justify-center text-xs font-bold text-[#717171]">
                      $
                    </div>
                  </div>

                  {/* SVG Bar Chart with October Highlight Tooltip */}
                  <div className="relative pt-6 pb-2">
                    {/* Tooltip speech bubble */}
                    <div className="absolute top-0 right-1/4 -translate-x-4 bg-[#FF385C] text-white text-[10px] font-bold px-3 py-1.5 rounded-xl shadow-md z-10 animate-bounce">
                      October <br />
                      <span className="text-xs font-extrabold">Revenue $53,455</span>
                    </div>

                    <div className="h-48 flex items-end justify-between gap-1.5 sm:gap-2 px-2 border-b border-[#EBEBEB]">
                      {[
                        { month: "Jan", h: 35 },
                        { month: "Feb", h: 48 },
                        { month: "Mar", h: 55 },
                        { month: "Apr", h: 62 },
                        { month: "May", h: 45 },
                        { month: "Jun", h: 72 },
                        { month: "Jul", h: 80 },
                        { month: "Aug", h: 65 },
                        { month: "Sep", h: 75 },
                        { month: "Oct", h: 96, active: true },
                        { month: "Nov", h: 58 },
                        { month: "Dec", h: 50 },
                      ].map((bar, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                          <div
                            style={{ height: `${bar.h}%` }}
                            className={`w-full rounded-t-md transition-all duration-300 ${
                              bar.active
                                ? "bg-[#FF385C] shadow-md ring-2 ring-[#FF385C]/30"
                                : "bg-[#F0F0F0] group-hover:bg-[#E2E2E2]"
                            }`}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-[#717171] px-2 pt-2">
                      {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
                        (m) => (
                          <span key={m}>{m}</span>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Chart 2: Bookings Trend (Line Chart) */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#EBEBEB] shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#222222]">Bookings Trend</h3>
                    <div className="flex items-center p-0.5 rounded-lg bg-[#F7F7F8] border border-[#EBEBEB] text-[11px] font-semibold">
                      <button
                        type="button"
                        onClick={() => setTrendMode("weekly")}
                        className={`px-2.5 py-1 rounded-md transition ${
                          trendMode === "weekly" ? "bg-white text-[#222222] shadow-2xs" : "text-[#717171]"
                        }`}
                      >
                        Weekly
                      </button>
                      <button
                        type="button"
                        onClick={() => setTrendMode("monthly")}
                        className={`px-2.5 py-1 rounded-md transition ${
                          trendMode === "monthly" ? "bg-[#222222] text-white shadow-2xs" : "text-[#717171]"
                        }`}
                      >
                        Monthly
                      </button>
                    </div>
                  </div>

                  {/* SVG Line Graph with points */}
                  <div className="relative pt-6 pb-2">
                    {/* Tooltip speech bubble */}
                    <div className="absolute top-8 right-16 bg-[#FF385C] text-white text-[10px] font-bold px-3 py-1 rounded-xl shadow-md z-10 animate-pulse">
                      Dec 25 <br />
                      <span className="text-xs font-extrabold">Bookings - 40</span>
                    </div>

                    <div className="h-48 relative border-b border-[#EBEBEB]">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180">
                        {/* Grid lines */}
                        <line x1="0" y1="30" x2="500" y2="30" stroke="#F0F0F0" strokeDasharray="3 3" />
                        <line x1="0" y1="80" x2="500" y2="80" stroke="#F0F0F0" strokeDasharray="3 3" />
                        <line x1="0" y1="130" x2="500" y2="130" stroke="#F0F0F0" strokeDasharray="3 3" />

                        {/* Connected Polyline */}
                        <polyline
                          fill="none"
                          stroke="#FF385C"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points="20,130 95,85 170,105 245,70 320,80 395,65 470,25"
                        />

                        {/* Points */}
                        {[
                          [20, 130],
                          [95, 85],
                          [170, 105],
                          [245, 70],
                          [320, 80],
                          [395, 65],
                          [470, 25],
                        ].map(([x, y], idx) => (
                          <circle
                            key={idx}
                            cx={x}
                            cy={y}
                            r={idx === 5 ? 5 : 4}
                            fill={idx === 5 ? "#FF385C" : "white"}
                            stroke="#FF385C"
                            strokeWidth="2.5"
                          />
                        ))}
                      </svg>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-[#717171] px-2 pt-2">
                      {["Dec 1", "Dec 5", "Dec 10", "Dec 15", "Dec 20", "Dec 25", "Dec 30"].map((d) => (
                        <span key={d}>{d}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* BOTTOM TWO PANELS: Recent Bookings & Pending Approvals / Tasks */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Recent Bookings Table */}
                <div className="lg:col-span-8 bg-white p-5 sm:p-6 rounded-2xl border border-[#EBEBEB] shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold font-syne text-[#222222]">Recent Bookings</h3>
                      <p className="text-xs text-[#717171]">Live reservation activity across your listings</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab("bookings")}
                      className="text-xs font-semibold text-[#FF385C] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>View All</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#EBEBEB] text-[#717171]">
                          <th className="pb-2.5 font-semibold">Guest</th>
                          <th className="pb-2.5 font-semibold">Sanctuary</th>
                          <th className="pb-2.5 font-semibold">Stay Dates</th>
                          <th className="pb-2.5 font-semibold">Payout</th>
                          <th className="pb-2.5 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EBEBEB] text-[#222222]">
                        {[
                          {
                            name: "Eleanor Vance",
                            room: "Architectural A-Frame Chalet",
                            dates: "Oct 12 – Oct 16",
                            total: "$2,650",
                            status: "Confirmed",
                          },
                          {
                            name: "Marcus Sterling",
                            room: "Glacial Vista Summit Penthouse",
                            dates: "Nov 03 – Nov 08",
                            total: "$4,200",
                            status: "Confirmed",
                          },
                          {
                            name: "Sophie Duprès",
                            room: "Celestial Stargazing Dome",
                            dates: "Dec 24 – Dec 28",
                            total: "$3,120",
                            status: "Arriving Soon",
                          },
                          {
                            name: "Henrik Lindqvist",
                            room: "Nordic Haven Pine Cabin",
                            dates: "Jan 10 – Jan 14",
                            total: "$1,890",
                            status: "Pending Check-in",
                          },
                        ].map((b, idx) => (
                          <tr key={idx} className="hover:bg-[#FAFAFA] transition">
                            <td className="py-3 font-bold">{b.name}</td>
                            <td className="py-3 text-[#717171]">{b.room}</td>
                            <td className="py-3 font-medium">{b.dates}</td>
                            <td className="py-3 font-bold font-syne">{b.total}</td>
                            <td className="py-3">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  b.status === "Confirmed"
                                    ? "bg-emerald-50 text-emerald-800"
                                    : "bg-blue-50 text-blue-800"
                                }`}
                              >
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pending Approvals & Task Management Panel */}
                <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-2xl border border-[#EBEBEB] shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold font-syne text-[#222222]">Pending Approvals</h3>
                      <p className="text-xs text-[#717171]">Tasks and host actions</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold">
                      {pendingTasksCount} Open
                    </span>
                  </div>

                  {/* Add Quick Task Input */}
                  <form onSubmit={handleAddTask} className="flex items-center gap-1.5">
                    <input
                      type="text"
                      placeholder="Add task (e.g. Inspect hot tub)..."
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-[#F7F7F8] border border-[#E5E5E5] rounded-xl text-xs text-[#222222] focus:outline-none focus:border-[#222222]"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-xl bg-[#222222] text-white text-xs font-semibold hover:bg-black transition cursor-pointer"
                    >
                      Add
                    </button>
                  </form>

                  {/* Tasks List with Toggle Checkbox */}
                  <div className="space-y-2.5 max-h-[290px] overflow-y-auto pr-1">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => toggleTask(task.id)}
                        className={`p-3 rounded-xl border transition cursor-pointer flex items-start gap-2.5 ${
                          task.completed
                            ? "bg-[#FAFAFA] border-[#EBEBEB] opacity-60 line-through"
                            : "bg-white border-[#EBEBEB] hover:border-[#222222] shadow-2xs"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-md mt-0.5 flex items-center justify-center border transition ${
                            task.completed
                              ? "bg-[#222222] border-[#222222] text-white"
                              : "border-[#D1D5DB] bg-white"
                          }`}
                        >
                          {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[#222222] leading-snug">
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-[#717171]">
                            <span>{task.category}</span>
                            <span>•</span>
                            <span>{task.due}</span>
                            {task.urgent && !task.completed && (
                              <span className="text-rose-600 font-bold">Urgent</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: MY SUITES / SERVICES */}
          {activeTab === "services" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold font-syne text-[#222222]">
                    My Suites & Inventory ({hostRooms.length})
                  </h2>
                  <p className="text-xs text-[#717171] mt-0.5">
                    Manage accommodations, pricing, availability, and guest capacities. Host: <strong className="text-[#222222]">{currentEmail}</strong>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddRoomModalOpen(true)}
                  className="px-4 py-2 rounded-full bg-[#FF385C] hover:bg-[#E00B41] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#FF385C]/20 transition cursor-pointer active:scale-95 self-start"
                >
                  <Plus className="w-4 h-4" />
                  <span>List New Sanctuary</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {hostRooms.map((room) => (
                  <div
                    key={room.id}
                    className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden shadow-2xs hover:shadow-md transition flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative h-44 overflow-hidden bg-[#222222]">
                        <img
                          src={room.featuredImage}
                          alt={room.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider">
                          {room.category}
                        </div>
                        <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-xs text-[#222222] text-xs font-bold font-syne shadow-xs">
                          ${room.price} <span className="font-normal text-[10px]">/ night</span>
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <h4 className="font-bold text-sm font-syne text-[#222222] truncate">
                          {room.name}
                        </h4>
                        <p className="text-xs text-[#717171] line-clamp-2">
                          {room.tagline || room.description}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-[#717171] pt-1">
                          <span>{room.guests} Guests</span>
                          <span>•</span>
                          <span>{room.bedrooms} Beds</span>
                          <span>•</span>
                          <span>{room.size}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0 border-t border-[#EBEBEB]/60 mt-3 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Active Listing</span>
                      </span>
                      <Link
                        to={`/rooms/${room.id}`}
                        className="text-xs font-semibold text-[#222222] hover:text-[#FF385C] flex items-center gap-1 transition"
                      >
                        <span>View Live</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: DISPUTES & QUERIES */}
          {activeTab === "disputes" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-2xl font-bold font-syne text-[#222222]">
                  Guest Inquiries & Support Tasks
                </h2>
                <p className="text-xs text-[#717171] mt-0.5">
                  Direct requests, concierge inquiries, and arrival assistance from your guests.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {queries.map((q) => (
                  <div
                    key={q.id}
                    className="bg-white p-5 rounded-2xl border border-[#EBEBEB] shadow-2xs space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={q.avatar}
                            alt={q.guestName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <h4 className="font-bold text-xs text-[#222222]">{q.guestName}</h4>
                            <span className="text-[10px] text-[#717171]">{q.roomName}</span>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            q.status === "pending"
                              ? "bg-amber-50 text-amber-800"
                              : "bg-emerald-50 text-emerald-800"
                          }`}
                        >
                          {q.status === "pending" ? "Awaiting Reply" : "Resolved"}
                        </span>
                      </div>

                      <p className="text-xs text-[#4A4A4A] bg-[#F7F7F8] p-3 rounded-xl leading-relaxed">
                        "{q.message}"
                      </p>

                      {q.reply && (
                        <div className="text-xs text-emerald-900 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                          <strong className="block text-[10px] uppercase text-emerald-700 font-bold mb-0.5">
                            Your Reply:
                          </strong>
                          <span>{q.reply}</span>
                        </div>
                      )}
                    </div>

                    {q.status === "pending" && (
                      <div className="pt-2">
                        {selectedQueryId === q.id ? (
                          <div className="space-y-2">
                            <textarea
                              rows={2}
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Write reply to guest..."
                              className="w-full p-2.5 text-xs border border-[#E5E5E5] rounded-xl focus:outline-none focus:border-[#222222]"
                            />
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedQueryId(null)}
                                className="px-3 py-1 text-xs text-[#717171] hover:text-[#222222]"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSendReply(q.id)}
                                className="px-3.5 py-1.5 rounded-full bg-[#222222] text-white text-xs font-semibold flex items-center gap-1 hover:bg-black transition cursor-pointer"
                              >
                                <Send className="w-3 h-3" />
                                <span>Send Reply</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setSelectedQueryId(q.id)}
                            className="w-full py-2 rounded-full border border-[#E5E5E5] hover:bg-[#F7F7F8] text-[#222222] text-xs font-semibold transition cursor-pointer"
                          >
                            Reply to Guest
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: ALL BOOKINGS */}
          {activeTab === "bookings" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-2xl font-bold font-syne text-[#222222]">
                  Reservations & Guest Schedules
                </h2>
                <p className="text-xs text-[#717171] mt-0.5">
                  Real-time calendar of upcoming arrivals, check-ins, and active guests.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden p-4 shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#EBEBEB] text-[#717171]">
                      <th className="pb-3 font-semibold">Guest</th>
                      <th className="pb-3 font-semibold">Chalet / Sanctuary</th>
                      <th className="pb-3 font-semibold">Dates</th>
                      <th className="pb-3 font-semibold">Party</th>
                      <th className="pb-3 font-semibold">Total</th>
                      <th className="pb-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EBEBEB]">
                    {[
                      { guest: "Eleanor Vance", room: "Architectural A-Frame Chalet", dates: "Oct 12 – Oct 16", guests: "2 Guests", amount: "$2,650", status: "Confirmed" },
                      { guest: "Marcus Sterling", room: "Glacial Vista Summit Penthouse", dates: "Nov 03 – Nov 08", guests: "4 Guests", amount: "$4,200", status: "Confirmed" },
                      { guest: "Sophie Duprès", room: "Celestial Stargazing Dome", dates: "Dec 24 – Dec 28", guests: "2 Guests", amount: "$3,120", status: "Arriving Soon" },
                      { guest: "Henrik Lindqvist", room: "Nordic Haven Pine Cabin", dates: "Jan 10 – Jan 14", guests: "2 Guests", amount: "$1,890", status: "Active" },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-[#FAFAFA] transition">
                        <td className="py-3 font-bold">{row.guest}</td>
                        <td className="py-3 text-[#717171]">{row.room}</td>
                        <td className="py-3 font-medium">{row.dates}</td>
                        <td className="py-3 text-[#717171]">{row.guests}</td>
                        <td className="py-3 font-bold font-syne">{row.amount}</td>
                        <td className="py-3">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold text-[10px]">
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: PENDING APPROVALS / TASKS */}
          {activeTab === "approvals" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold font-syne text-[#222222]">
                    Operational Tasks & Approvals
                  </h2>
                  <p className="text-xs text-[#717171] mt-0.5">
                    Track management tasks, maintenance routines, and concierge dispatches.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#EBEBEB] space-y-4 shadow-2xs">
                <form onSubmit={handleAddTask} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Create a new task (e.g. Schedule sauna maintenance)..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="flex-1 px-4 py-2 bg-[#F7F7F8] border border-[#E5E5E5] rounded-xl text-xs text-[#222222] focus:outline-none focus:border-[#222222]"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#222222] text-white text-xs font-semibold hover:bg-black transition cursor-pointer"
                  >
                    Create Task
                  </button>
                </form>

                <div className="space-y-3 pt-2">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className={`p-4 rounded-xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                        task.completed
                          ? "bg-[#FAFAFA] border-[#EBEBEB] opacity-50 line-through"
                          : "bg-white border-[#EBEBEB] hover:border-[#222222] shadow-xs"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                            task.completed
                              ? "bg-[#222222] border-[#222222] text-white"
                              : "border-[#D1D5DB] bg-white"
                          }`}
                        >
                          {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#222222]">{task.title}</p>
                          <span className="text-[11px] text-[#717171]">{task.category} • Due {task.due}</span>
                        </div>
                      </div>
                      {task.urgent && !task.completed && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold text-[10px]">
                          Urgent
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* OTHER TABS (Providers, Customers, Finance) */}
          {(activeTab === "providers" ||
            activeTab === "customers" ||
            activeTab === "commissions" ||
            activeTab === "payouts" ||
            activeTab === "analytics" ||
            activeTab === "policies") && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-white p-8 rounded-2xl border border-[#EBEBEB] text-center max-w-xl mx-auto space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#F7F7F8] flex items-center justify-center mx-auto text-[#222222]">
                  <Sparkles className="w-6 h-6 text-[#FF385C]" />
                </div>
                <h3 className="text-lg font-bold font-syne text-[#222222] capitalize">
                  {activeTab} Management Panel
                </h3>
                <p className="text-xs text-[#717171] leading-relaxed">
                  All systems and live analytics for this section are connected and syncing with your active host account ({currentEmail}).
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("overview")}
                  className="px-5 py-2 rounded-full bg-[#222222] text-white text-xs font-semibold hover:bg-black transition cursor-pointer"
                >
                  Return to Dashboard Overview
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ADD NEW ROOM / SUITE MODAL */}
      {isAddRoomModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#EBEBEB] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBEBEB]">
              <div>
                <h3 className="text-lg font-bold font-syne text-[#222222]">
                  List a New Alpine Sanctuary
                </h3>
                <p className="text-xs text-[#717171]">
                  Adding to host: <strong className="text-[#222222]">{currentEmail}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddRoomModalOpen(false)}
                className="p-1 rounded-full hover:bg-[#F2F2F2] text-[#717171] hover:text-[#222222] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#222222] mb-1">
                  Sanctuary Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Matterhorn Stargazer Alpine Chalet"
                  value={newRoomData.name}
                  onChange={(e) => setNewRoomData({ ...newRoomData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#222222]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#222222] mb-1">
                    Category
                  </label>
                  <select
                    value={newRoomData.category}
                    onChange={(e) => setNewRoomData({ ...newRoomData, category: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-[#E5E5E5] bg-white focus:outline-none"
                  >
                    <option value="chalet">Alpine Chalet</option>
                    <option value="penthouse">Summit Penthouse</option>
                    <option value="dome">Stargazing Dome</option>
                    <option value="villa">Mountain Villa</option>
                    <option value="loft">Ski Loft</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#222222] mb-1">
                    Nightly Rate ($ USD) *
                  </label>
                  <input
                    type="number"
                    min="100"
                    required
                    value={newRoomData.price}
                    onChange={(e) => setNewRoomData({ ...newRoomData, price: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#222222]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#222222] mb-1">
                    Max Guests
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newRoomData.guests}
                    onChange={(e) => setNewRoomData({ ...newRoomData, guests: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-[#E5E5E5] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#222222] mb-1">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newRoomData.bedrooms}
                    onChange={(e) => setNewRoomData({ ...newRoomData, bedrooms: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-[#E5E5E5] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#222222] mb-1">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newRoomData.bathrooms}
                    onChange={(e) => setNewRoomData({ ...newRoomData, bathrooms: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-[#E5E5E5] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#222222] mb-1">
                  Tagline / Catchphrase
                </label>
                <input
                  type="text"
                  value={newRoomData.tagline}
                  onChange={(e) => setNewRoomData({ ...newRoomData, tagline: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#222222]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#222222] mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={newRoomData.featuredImage}
                  onChange={(e) => setNewRoomData({ ...newRoomData, featuredImage: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#222222]"
                />
              </div>

              <div className="pt-3 border-t border-[#EBEBEB] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddRoomModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#717171] hover:text-[#222222] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full bg-[#FF385C] hover:bg-[#E00B41] text-white text-xs font-bold shadow-md shadow-[#FF385C]/20 transition cursor-pointer active:scale-95"
                >
                  Publish Sanctuary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
