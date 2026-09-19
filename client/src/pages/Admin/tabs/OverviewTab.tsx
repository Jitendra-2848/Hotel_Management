import React, { useState } from "react";
import {
  DollarSign,
  CreditCard,
  Bed,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  ChevronRight,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Room, HostMetrics } from "../../../lib/api";
import { ManagementTask, GuestQuery } from "../types";

interface OverviewTabProps {
  metrics: HostMetrics | null;
  rooms: Room[];
  tasks: ManagementTask[];
  queries: GuestQuery[];
  onNavigateToTab: (tab: any) => void;
  onOpenAddRoomModal: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  metrics,
  rooms,
  tasks,
  queries,
  onNavigateToTab,
  onOpenAddRoomModal,
}) => {
  const [trendMode, setTrendMode] = useState<"weekly" | "monthly">("monthly");

  const totalEarnings = metrics?.totalEarnings ?? 0;
  const activeRoomsCount = rooms.filter((r) => r.status === "active").length;
  const avgRating = metrics?.averageRating ?? 5.0;
  const pendingTasks = tasks.filter((t) => !t.completed);
  const pendingQueries = queries.filter((q) => q.status === "pending");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#EBEBEB] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#717171]">Gross Revenue</span>
            <div className="w-8 h-8 rounded-full bg-[#EBF3FF] text-[#0066FF] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-syne text-[#222222] tracking-tight mb-1">
            ${totalEarnings.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#008A05] font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{totalEarnings > 0 ? "Active revenue stream" : "Awaiting initial bookings"}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EBEBEB] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#717171]">Net Host Payouts</span>
            <div className="w-8 h-8 rounded-full bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-syne text-[#222222] tracking-tight mb-1">
            ${(totalEarnings * 0.85).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#717171]">
            <Clock className="w-3.5 h-3.5" />
            <span>Next automatic payout on Friday</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EBEBEB] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#717171]">Active Sanctuaries</span>
            <div className="w-8 h-8 rounded-full bg-[#FFF0F2] text-[#FF385C] flex items-center justify-center">
              <Bed className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-syne text-[#222222] tracking-tight mb-1">
            {activeRoomsCount} Suites
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#008A05] font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% operational readiness</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EBEBEB] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#717171]">Guest Rating</span>
            <div className="w-8 h-8 rounded-full bg-[#FFFBEB] text-[#D97706] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-syne text-[#222222] tracking-tight mb-1">
            {avgRating} ★
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#D97706] font-semibold">
            <span>Verified Sanctuary Host</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-[#EBEBEB] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold font-syne text-[#222222]">
                Financial Velocity & Booking Volume
              </h3>
              <p className="text-xs text-[#717171]">
                Gross reservation receipts across Crafters' Haven luxury inventory
              </p>
            </div>
            <div className="flex items-center gap-1 bg-[#F7F7F8] p-1 rounded-xl border border-[#EBEBEB] text-xs font-medium">
              <button
                type="button"
                onClick={() => setTrendMode("weekly")}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  trendMode === "weekly" ? "bg-white font-bold text-[#222222] shadow-xs" : "text-[#717171]"
                }`}
              >
                Weekly
              </button>
              <button
                type="button"
                onClick={() => setTrendMode("monthly")}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  trendMode === "monthly" ? "bg-white font-bold text-[#222222] shadow-xs" : "text-[#717171]"
                }`}
              >
                Monthly
              </button>
            </div>
          </div>

          {totalEarnings === 0 ? (
            <div className="h-48 flex items-center justify-center text-xs text-[#717171] border-b border-[#F2F2F2]">
              No revenue transactions recorded yet for this billing cycle.
            </div>
          ) : (
            <div className="pt-4 grid grid-cols-6 gap-3 items-end h-48 border-b border-[#F2F2F2] pb-2">
              {[
                { label: "P-5", height: "35%", val: `$${Math.round(totalEarnings * 0.15).toLocaleString()}` },
                { label: "P-4", height: "50%", val: `$${Math.round(totalEarnings * 0.25).toLocaleString()}` },
                { label: "P-3", height: "65%", val: `$${Math.round(totalEarnings * 0.45).toLocaleString()}` },
                { label: "P-2", height: "80%", val: `$${Math.round(totalEarnings * 0.7).toLocaleString()}` },
                { label: "P-1", height: "90%", val: `$${Math.round(totalEarnings * 0.85).toLocaleString()}` },
                { label: "Current", height: "100%", val: `$${totalEarnings.toLocaleString()}`, active: true },
              ].map((bar, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-bold text-[#717171] opacity-0 group-hover:opacity-100 transition">
                    {bar.val}
                  </span>
                  <div
                    style={{ height: bar.height }}
                    className={`w-full max-w-[42px] rounded-t-xl transition-all duration-300 ${
                      bar.active ? "bg-[#FF385C]" : "bg-[#E5E5E5] group-hover:bg-[#D4D4D4]"
                    }`}
                  />
                  <span className="text-[11px] font-bold text-[#717171]">{bar.label}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between text-xs pt-2">
            <span className="text-[#717171]">Current Cycle: <strong>October Peak Autumn</strong></span>
            <button
              type="button"
              onClick={() => onNavigateToTab("analytics")}
              className="text-[#FF385C] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View In-depth Financial Breakdown</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#EBEBEB] shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold font-syne text-[#222222]">
                Action Required
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-[#FFEBEF] text-[#FF385C] text-[10px] font-bold">
                {pendingTasks.length + pendingQueries.length} items
              </span>
            </div>

            <div className="space-y-3">
              {pendingQueries.length > 0 && (
                <div className="p-3 bg-[#FFF9FA] border border-[#FFE0E6] rounded-2xl">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF385C] mb-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Pending Guest Inquiries ({pendingQueries.length})</span>
                  </div>
                  <p className="text-[11px] text-[#717171] line-clamp-2">
                    "{pendingQueries[0].message}"
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigateToTab("notifications")}
                    className="mt-2 text-[10px] font-bold text-[#FF385C] hover:underline block cursor-pointer"
                  >
                    Reply directly &rarr;
                  </button>
                </div>
              )}

              {pendingTasks.slice(0, 2).map((t) => (
                <div key={t.id} className="p-3 bg-[#F7F7F8] rounded-2xl border border-[#EBEBEB] text-xs">
                  <div className="flex items-center justify-between font-semibold text-[#222222] mb-1">
                    <span className="line-clamp-1">{t.title}</span>
                    {t.urgent && (
                      <span className="px-1.5 py-0.2 bg-[#FF385C] text-white text-[9px] rounded-full uppercase font-bold">
                        Urgent
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#717171]">Due: {t.due} • {t.category}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenAddRoomModal}
            className="w-full py-2.5 rounded-xl bg-[#222222] hover:bg-black text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>List Another Alpine Suite</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
