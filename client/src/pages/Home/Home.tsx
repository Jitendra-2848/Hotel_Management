import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Crown, Briefcase, UserCheck, LogOut } from "lucide-react";

export const Home: React.FC = () => {
  const { user, logout } = useAuth();

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case "MANAGER":
        return {
          icon: Crown,
          label: "Hotel Manager",
          color: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        };
      case "STAFF":
        return {
          icon: Briefcase,
          label: "Operations Staff",
          color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        };
      case "GUEST":
      default:
        return {
          icon: UserCheck,
          label: "Registered Guest",
          color: "bg-blue-500/10 text-blue-400 border-blue-500/30",
        };
    }
  };

  const badge = getRoleBadge(user?.role);
  const BadgeIcon = badge.icon;
  const label = badge.label;
  // console.log(getRoleBadge(user?.role));
  return (
    <div className="flex items-center justify-between p-6 bg-white border-b border-gray-200">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-gray-100 text-gray-800">
          <BadgeIcon className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{user?.name || "User"}</h2>
          <p className="text-xs text-gray-500">{label} • {user?.email}</p>
        </div>
      </div>
      <button
        onClick={() => logout()}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Home;