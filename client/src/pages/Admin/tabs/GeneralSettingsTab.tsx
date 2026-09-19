import React, { useState } from "react";
import { ShieldCheck, FileText, Check } from "lucide-react";

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

  return (
    <div className="bg-white rounded-3xl border border-[#EBEBEB] p-6 shadow-xs space-y-6">
      <div className="pb-4 border-b border-[#F2F2F2]">
        <h2 className="text-base font-bold font-syne text-[#222222]">
          Host Sanctuary Governance & Policies
        </h2>
        <p className="text-xs text-[#717171]">
          Configure standard check-in hours, cancellation rules, and communication preferences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Check-in Policies */}
        <div className="p-5 bg-[#F7F7F8] rounded-2xl border border-[#EBEBEB] space-y-4">
          <div className="flex items-center gap-2 font-bold text-[#222222]">
            <FileText className="w-4 h-4 text-[#FF385C]" />
            <span>Check-in & Check-out Protocol</span>
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

          <div className="pt-2 text-[11px] text-[#717171]">
            Cancellation Rule: <strong>Full refund up to 7 days prior to check-in</strong>
          </div>
        </div>

        {/* Security & Badges */}
        <div className="p-5 bg-[#F7F7F8] rounded-2xl border border-[#EBEBEB] space-y-4">
          <div className="flex items-center gap-2 font-bold text-[#222222]">
            <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
            <span>Host Security & Identity</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[#4A4A4A]">Authenticated Host Profile</span>
              <span className="font-bold text-[#222222]">{hostName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#4A4A4A]">Primary Host Email</span>
              <span className="font-bold text-[#222222]">{hostEmail}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#4A4A4A]">Security Gateway</span>
              <span className="inline-flex items-center gap-1 font-bold text-[#16A34A]">
                <Check className="w-3.5 h-3.5" />
                <span>JWT Cookie + RBAC Guard Active</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettingsTab;
