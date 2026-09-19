import React from "react";
import {
  LayoutGrid,
  Calendar,
  Bed,
  Users,
  DollarSign,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  FileText,
  Sparkles,
  ExternalLink,
  UserCheck,
  PieChart,
  AlertTriangle,
} from "lucide-react";
import { NavTab } from "../types";

interface AdminSidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  suitesCount: number;
  bookingsCount: number;
  pendingTasksCount: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  suitesCount,
  bookingsCount,
  pendingTasksCount,
}) => {
  return (
    <aside className="w-full md:w-60 lg:w-64 bg-white border-r border-[#EBEBEB] p-4 flex flex-col justify-between shrink-0">
      {/* Navigation Groups */}
      <div className="space-y-6">
        <div>
          <span className="px-3 text-[10px] uppercase font-bold tracking-wider text-[#999999] block mb-2">
            Main Management
          </span>
          <nav className="space-y-1">
            <button
              type="button"
              onClick={() => onSelectTab("overview")}
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
              onClick={() => onSelectTab("services")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === "services"
                  ? "bg-[#FF385C] text-white shadow-xs"
                  : "text-[#4A4A4A] hover:bg-[#F7F7F8]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bed className="w-4 h-4" />
                <span>My Sanctuaries</span>
              </div>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === "services" ? "bg-white/25 text-white" : "bg-[#F7F7F8] text-[#717171]"
                }`}
              >
                {suitesCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab("bookings")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === "bookings"
                  ? "bg-[#FF385C] text-white shadow-xs"
                  : "text-[#4A4A4A] hover:bg-[#F7F7F8]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4" />
                <span>Reservations</span>
              </div>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === "bookings" ? "bg-white/25 text-white" : "bg-[#F7F7F8] text-[#717171]"
                }`}
              >
                {bookingsCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab("providers")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === "providers"
                  ? "bg-[#FF385C] text-white shadow-xs"
                  : "text-[#4A4A4A] hover:bg-[#F7F7F8]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4" />
                <span>Hosts & Staff</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab("customers")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === "customers"
                  ? "bg-[#FF385C] text-white shadow-xs"
                  : "text-[#4A4A4A] hover:bg-[#F7F7F8]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-4 h-4" />
                <span>Guests Directory</span>
              </div>
            </button>
          </nav>
        </div>

        <div>
          <span className="px-3 text-[10px] uppercase font-bold tracking-wider text-[#999999] block mb-2">
            Operations
          </span>
          <nav className="space-y-1">
            <button
              type="button"
              onClick={() => onSelectTab("notifications")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === "notifications"
                  ? "bg-[#FF385C] text-white shadow-xs"
                  : "text-[#4A4A4A] hover:bg-[#F7F7F8]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4" />
                <span>Tasks & Queries</span>
              </div>
              {pendingTasksCount > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    activeTab === "notifications" ? "bg-white/25 text-white" : "bg-[#FFEBEF] text-[#FF385C] font-bold"
                  }`}
                >
                  {pendingTasksCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        <div>
          <span className="px-3 text-[10px] uppercase font-bold tracking-wider text-[#999999] block mb-2">
            Finance
          </span>
          <nav className="space-y-1">
            <button
              type="button"
              onClick={() => onSelectTab("commissions")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === "commissions"
                  ? "bg-[#FF385C] text-white shadow-xs"
                  : "text-[#4A4A4A] hover:bg-[#F7F7F8]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <PieChart className="w-4 h-4" />
                <span>Revenue Share</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab("payouts")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === "payouts"
                  ? "bg-[#FF385C] text-white shadow-xs"
                  : "text-[#4A4A4A] hover:bg-[#F7F7F8]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <DollarSign className="w-4 h-4" />
                <span>Payouts</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab("disputes")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === "disputes"
                  ? "bg-[#FF385C] text-white shadow-xs"
                  : "text-[#4A4A4A] hover:bg-[#F7F7F8]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Disputes</span>
              </div>
            </button>
          </nav>
        </div>

        <div>
          <span className="px-3 text-[10px] uppercase font-bold tracking-wider text-[#999999] block mb-2">
            Insights & Settings
          </span>
          <nav className="space-y-1">
            <button
              type="button"
              onClick={() => onSelectTab("analytics")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === "analytics"
                  ? "bg-[#FF385C] text-white shadow-xs"
                  : "text-[#4A4A4A] hover:bg-[#F7F7F8]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <TrendingUp className="w-4 h-4" />
                <span>Analytics</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab("approvals")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === "approvals"
                  ? "bg-[#FF385C] text-white shadow-xs"
                  : "text-[#4A4A4A] hover:bg-[#F7F7F8]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Approvals</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab("policies")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === "policies"
                  ? "bg-[#FF385C] text-white shadow-xs"
                  : "text-[#4A4A4A] hover:bg-[#F7F7F8]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4" />
                <span>Policies</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-[#EBEBEB]">
        <div className="p-3 bg-gradient-to-br from-[#FFF5F7] to-[#FDF2F4] border border-[#FFE0E6] rounded-2xl">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FF385C]" />
            <span className="text-[11px] font-bold text-[#222222]">Verified Host Status</span>
          </div>
          <p className="text-[10px] text-[#717171] leading-relaxed mb-2.5">
            Your sanctuary inventory and host identity verification are active.
          </p>
          <a
            href="/rooms"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[10px] font-bold text-[#FF385C] hover:underline"
          >
            <span>Preview Public View</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
