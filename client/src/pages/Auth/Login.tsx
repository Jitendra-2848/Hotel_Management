import React, { useState, lazy, Suspense } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import LoginSkeleton from "./skeleton/Login_skeleton";

const LoginImage = lazy(() => import("./components/LoginImage"));

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error: authError, clearError } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (location.state as any)?.from?.pathname || "/";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (localError) setLocalError(null);
    if (authError) clearError();
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!formData.email.trim() || !formData.password.trim()) {
      setLocalError("Please fill in all fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      await login({
        email: formData.email.trim(),
        password: formData.password,
      });
      navigate(from, { replace: true });
    } catch (err: any) {
      setLocalError(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayError = localError || authError;

  return (
    <div className="min-h-screen bg-[#FFF5F5] flex items-center justify-center p-4 sm:p-6 text-[#4A4A4A]">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl shadow-[#4A4A4A]/5 border border-[#E2B4BD]/40 overflow-hidden flex flex-col md:flex-row">
        {/* Left Side: Lazy Loaded Image with Skeleton Fallback */}
        <div className="md:w-1/2 relative bg-[#2D2D2D] min-h-[260px] md:min-h-[520px]">
          <Suspense fallback={<LoginSkeleton />}>
            <LoginImage />
          </Suspense>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-1/2 p-6 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h1 className="text-2xl font-bold font-syne text-[#4A4A4A]">Sign in</h1>
            <p className="text-xs text-[#4A4A4A]/70 mt-1">
              Welcome back to your Crafters'Haven mountain portal.
            </p>
          </div>

          {displayError && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{displayError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2B4BD]/60 text-[#4A4A4A] text-xs placeholder-[#4A4A4A]/40 focus:outline-hidden focus:border-[#4A4A4A] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-[#E2B4BD]/60 text-[#4A4A4A] text-xs placeholder-[#4A4A4A]/40 focus:outline-hidden focus:border-[#4A4A4A] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#4A4A4A]/40 hover:text-[#4A4A4A] focus:outline-none cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-[#4A4A4A] hover:bg-[#2D2D2D] text-brand-white text-xs font-semibold rounded-full transition shadow-sm shadow-[#4A4A4A]/20 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-center text-xs text-[#4A4A4A]/70 mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-[#4A4A4A] hover:underline decoration-[#E2B4BD]"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;