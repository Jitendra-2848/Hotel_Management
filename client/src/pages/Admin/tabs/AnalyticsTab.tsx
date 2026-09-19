import React from "react";
import { HostMetrics } from "../../../lib/api";

interface AnalyticsTabProps {
  metrics: HostMetrics | null;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ metrics }) => {
  const gross = metrics?.totalEarnings ?? 0;
  const platformFee = Math.round(gross * 0.12);
  const netEarnings = gross - platformFee;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-[#EBEBEB] p-6 shadow-xs space-y-6">
        <div>
          <h2 className="text-base font-bold font-syne text-[#222222]">
            Financial Analytics & Host Revenue Share
          </h2>
          <p className="text-xs text-[#717171]">
            Transparent fee breakdowns, seasonal occupancy velocities, and verified payout schedule
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-[#F7F7F8] rounded-2xl border border-[#EBEBEB]">
            <span className="text-[11px] font-bold text-[#717171] uppercase">Total Gross Receipts</span>
            <div className="text-2xl font-black font-syne text-[#222222] mt-1">
              ${gross.toLocaleString()}
            </div>
            <span className="text-[10px] text-[#008A05] font-semibold mt-1 block">
              100% collected via Razorpay & Stripe
            </span>
          </div>

          <div className="p-4 bg-[#F7F7F8] rounded-2xl border border-[#EBEBEB]">
            <span className="text-[11px] font-bold text-[#717171] uppercase">Platform & Insurance Fee</span>
            <div className="text-2xl font-black font-syne text-[#717171] mt-1">
              -${platformFee.toLocaleString()}
            </div>
            <span className="text-[10px] text-[#717171] mt-1 block">
              Standard 12% luxury host commission
            </span>
          </div>

          <div className="p-4 bg-[#FFF5F7] rounded-2xl border border-[#FFE0E6]">
            <span className="text-[11px] font-bold text-[#FF385C] uppercase">Net Host Disbursed</span>
            <div className="text-2xl font-black font-syne text-[#FF385C] mt-1">
              ${netEarnings.toLocaleString()}
            </div>
            <span className="text-[10px] text-[#FF385C] font-semibold mt-1 block">
              Direct bank deposit scheduled
            </span>
          </div>
        </div>

        <div className="p-5 border border-[#EBEBEB] rounded-2xl bg-white space-y-3">
          <h3 className="text-xs font-bold text-[#222222] uppercase tracking-wider">
            Payout Execution Schedule
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-[#F7F7F8]">
              <span className="text-[#4A4A4A]">Payout Status</span>
              <span className="font-bold text-[#222222]">{netEarnings > 0 ? "Pending scheduled cycle" : "No pending disbursements"}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[#F7F7F8]">
              <span className="text-[#4A4A4A]">Estimated Net Transfer</span>
              <span className="font-bold text-[#008A05]">${netEarnings.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-[#4A4A4A]">Payout Method</span>
              <span className="font-bold text-[#222222]">Direct Host Bank Transfer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
