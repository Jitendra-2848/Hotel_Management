import React, { useState } from "react";
import {
  ShieldCheck,
  FileText,
  Check,
  Bell,
  Clock,
  Sparkles,
  CalendarCheck,
  DollarSign,
  AlertCircle,
  Save,
} from "lucide-react";

interface GeneralSettingsTabProps {
  hostEmail: string;
  hostName: string;
}

export const GeneralSettingsTab: React.FC<GeneralSettingsTabProps> = ({
  hostEmail,
  hostName,
}) => {
  const [checkInTime, setCheckInTime] = useState("3:00 PM");
  const [checkOutTime, setCheckOutTime] = useState("11:00 AM");
  const [instantBooking, setInstantBooking] = useState(true);
  const [minNights, setMinNights] = useState("2");
  const [turnaroundGap, setTurnaroundGap] = useState("0");
  const [quietHoursStart, setQuietHoursStart] = useState("22:00");
  const [quietHoursEnd, setQuietHoursEnd] = useState("07:00");
  const [payoutCurrency, setPayoutCurrency] = useState("USD");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [autoInvoicing, setAutoInvoicing] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="bg-white rounded-3xl border border-[#EBEBEB] p-5 sm:p-7 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F2F2F2]">
          <div>
            <h2 className="text-base font-bold font-syne text-[#222222]">
              Host Sanctuary Governance & Operations
            </h2>
            <p className="text-xs text-[#717171] mt-0.5">
              Configure reservation policies, turnaround schedules, notification channels, and payouts.
            </p>
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#222222] hover:bg-black text-white text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer self-start sm:self-auto shrink-0"
          >
            {isSaved ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Settings Saved</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Governance</span>
              </>
            )}
          </button>
        </div>

        {isSaved && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Sanctuary operational policies and preferences have been updated.</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 text-xs">
          {/* Check-in & Stay Rules */}
          <div className="p-4 sm:p-5 bg-[#F7F7F8] rounded-2xl border border-[#EBEBEB] space-y-4">
            <div className="flex items-center gap-2 font-bold text-[#222222]">
              <Clock className="w-4 h-4 text-[#FF385C]" />
              <span>Arrival & Length of Stay</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#717171] mb-1">
                  Standard Check-In
                </label>
                <input
                  type="text"
                  value={checkInTime}
                  onChange={(e) => setCheckInTime(e.target.value)}
                  className="w-full p-2 bg-white rounded-xl border border-[#E5E5E5] font-semibold text-[#222222]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#717171] mb-1">
                  Standard Check-Out
                </label>
                <input
                  type="text"
                  value={checkOutTime}
                  onChange={(e) => setCheckOutTime(e.target.value)}
                  className="w-full p-2 bg-white rounded-xl border border-[#E5E5E5] font-semibold text-[#222222]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#717171] mb-1">
                  Minimum Stay
                </label>
                <select
                  value={minNights}
                  onChange={(e) => setMinNights(e.target.value)}
                  className="w-full p-2 bg-white rounded-xl border border-[#E5E5E5] font-semibold text-[#222222] cursor-pointer"
                >
                  <option value="1">1 Night</option>
                  <option value="2">2 Nights</option>
                  <option value="3">3 Nights</option>
                  <option value="5">5 Nights</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#717171] mb-1">
                  Turnaround Buffer
                </label>
                <select
                  value={turnaroundGap}
                  onChange={(e) => setTurnaroundGap(e.target.value)}
                  className="w-full p-2 bg-white rounded-xl border border-[#E5E5E5] font-semibold text-[#222222] cursor-pointer"
                >
                  <option value="0">Same Day (0 Days Gap)</option>
                  <option value="1">1 Day Deep Clean Gap</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#EBEBEB]">
              <div>
                <span className="font-semibold text-[#222222] block">Instant Reservation Mode</span>
                <span className="text-[10px] text-[#717171]">Guests can book confirmed dates instantly</span>
              </div>
              <input
                type="checkbox"
                checked={instantBooking}
                onChange={(e) => setInstantBooking(e.target.checked)}
                className="w-4 h-4 accent-[#222222] cursor-pointer"
              />
            </div>
          </div>

          {/* Quiet Hours & Guest Conduct */}
          <div className="p-4 sm:p-5 bg-[#F7F7F8] rounded-2xl border border-[#EBEBEB] space-y-4">
            <div className="flex items-center gap-2 font-bold text-[#222222]">
              <FileText className="w-4 h-4 text-[#FF385C]" />
              <span>Quiet Hours & Sanctuary Protocol</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#717171] mb-1">
                  Quiet Hours Begin
                </label>
                <input
                  type="text"
                  value={quietHoursStart}
                  onChange={(e) => setQuietHoursStart(e.target.value)}
                  className="w-full p-2 bg-white rounded-xl border border-[#E5E5E5] font-semibold text-[#222222]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#717171] mb-1">
                  Quiet Hours End
                </label>
                <input
                  type="text"
                  value={quietHoursEnd}
                  onChange={(e) => setQuietHoursEnd(e.target.value)}
                  className="w-full p-2 bg-white rounded-xl border border-[#E5E5E5] font-semibold text-[#222222]"
                />
              </div>
            </div>

            <div className="space-y-2 text-[11px] text-[#717171] pt-1">
              <div className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Wood-burning cedar tubs pre-heated to 104°F automatically upon arrival window</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Strict acoustic solitude standard enforced (&lt; 28 dB interior noise floor)</span>
              </div>
            </div>
          </div>

          {/* Notifications & Alert Channels */}
          <div className="p-4 sm:p-5 bg-[#F7F7F8] rounded-2xl border border-[#EBEBEB] space-y-4">
            <div className="flex items-center gap-2 font-bold text-[#222222]">
              <Bell className="w-4 h-4 text-[#FF385C]" />
              <span>Host Activity Alerts</span>
            </div>

            <div className="space-y-2.5">
              <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#EBEBEB] cursor-pointer">
                <div>
                  <span className="font-semibold text-[#222222] block">Instant Email Alerts</span>
                  <span className="text-[10px] text-[#717171]">Receive reservation alerts & guest inquiries</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 accent-[#222222] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#EBEBEB] cursor-pointer">
                <div>
                  <span className="font-semibold text-[#222222] block">SMS Urgent Notifications</span>
                  <span className="text-[10px] text-[#717171]">SMS alerts for check-in delays or emergency queries</span>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="w-4 h-4 accent-[#222222] cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Financials & Payouts */}
          <div className="p-4 sm:p-5 bg-[#F7F7F8] rounded-2xl border border-[#EBEBEB] space-y-4">
            <div className="flex items-center gap-2 font-bold text-[#222222]">
              <DollarSign className="w-4 h-4 text-[#FF385C]" />
              <span>Payouts & Currency Configuration</span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#717171] mb-1">
                Settlement & Payout Currency
              </label>
              <select
                value={payoutCurrency}
                onChange={(e) => setPayoutCurrency(e.target.value)}
                className="w-full p-2 bg-white rounded-xl border border-[#E5E5E5] font-semibold text-[#222222] cursor-pointer"
              >
                <option value="USD">USD ($) — United States Dollar</option>
                <option value="EUR">EUR (€) — Euro</option>
                <option value="CHF">CHF (Fr) — Swiss Franc</option>
                <option value="INR">INR (₹) — Indian Rupee</option>
                <option value="GBP">GBP (£) — British Pound</option>
              </select>
            </div>

            <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#EBEBEB] cursor-pointer">
              <div>
                <span className="font-semibold text-[#222222] block">Automated Guest Invoicing</span>
                <span className="text-[10px] text-[#717171]">Dispatch branded tax PDF invoice on payment capture</span>
              </div>
              <input
                type="checkbox"
                checked={autoInvoicing}
                onChange={(e) => setAutoInvoicing(e.target.checked)}
                className="w-4 h-4 accent-[#222222] cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Security & Badges */}
        <div className="p-4 sm:p-5 bg-[#F7F7F8] rounded-2xl border border-[#EBEBEB] space-y-3 text-xs">
          <div className="flex items-center gap-2 font-bold text-[#222222]">
            <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
            <span>Host Security & Identity Verification</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-white rounded-xl border border-[#EBEBEB]">
              <span className="text-[10px] text-[#717171] uppercase font-bold block mb-0.5">
                Host Profile
              </span>
              <span className="font-bold text-[#222222] truncate block">{hostName}</span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#EBEBEB]">
              <span className="text-[10px] text-[#717171] uppercase font-bold block mb-0.5">
                Host Email
              </span>
              <span className="font-bold text-[#222222] truncate block">{hostEmail}</span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#EBEBEB]">
              <span className="text-[10px] text-[#717171] uppercase font-bold block mb-0.5">
                Security Gateway
              </span>
              <span className="inline-flex items-center gap-1 font-bold text-[#16A34A]">
                <Check className="w-3.5 h-3.5" />
                <span>JWT Cookies Active</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default GeneralSettingsTab;
