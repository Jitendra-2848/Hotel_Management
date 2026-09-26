import React from "react";
import { Navigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldAlert, ArrowLeft } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF5F5]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#E2B4BD]/50 border-t-[#4A4A4A] rounded-full animate-spin"></div>
          <p className="text-[#4A4A4A]/70 text-xs font-medium animate-pulse">
            Verifying sanctuary access...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF5F5] px-4 text-[#4A4A4A]">
        <div className="max-w-md w-full bg-white border border-[#E2B4BD]/40 rounded-3xl p-8 text-center shadow-xl shadow-[#4A4A4A]/5">
          <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-200">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold font-syne text-[#4A4A4A] mb-2">Access Restricted</h2>
          <p className="text-xs text-[#4A4A4A]/70 mb-6 leading-relaxed">
            Your account does not have permission to view this section.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#4A4A4A] hover:bg-[#2D2D2D] text-brand-white font-semibold text-xs transition shadow-sm w-full cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
