import React, { useState, lazy, Suspense } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff, AlertCircle, User, Briefcase, ShieldCheck, Check } from "lucide-react";
import RegisterSkeleton from "./skeleton/Register_skeleton";

const RegisterImage = lazy(() => import("./components/RegisterImage"));

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, error: authError, clearError } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "GUEST" as "GUEST" | "STAFF" | "MANAGER",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setLocalError("Please fill in all fields.");
      return;
    }

    if (formData.name.trim().length < 2) {
      setLocalError("Name must be at least 2 characters.");
      return;
    }

    if (formData.password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      });
      navigate("/", { replace: true });
    } catch (err: any) {
      setLocalError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayError = localError || authError;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row">
        {/* Left Side: Form (Vice Versa) */}
        <div className="md:w-1/2 p-6 sm:p-10 flex flex-col justify-center order-2 md:order-1">
          <div className="mb-5">
            <h1 className="text-2xl font-semibold text-gray-900">Create an account</h1>
            <p className="text-sm text-gray-500 mt-1">
              Join us by selecting your role and details.
            </p>
          </div>

          {displayError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{displayError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Full name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Min 6 chars"
                    className="w-full px-3.5 py-2.5 pr-9 rounded-lg border border-gray-300 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Repeat"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-gray-700">
                  Select your role
                </label>
                <span className="text-[11px] text-gray-400">
                  Tailored experience
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    id: "GUEST" as const,
                    title: "Guest",
                    desc: "Bookings & stays",
                    icon: User,
                  },
                  {
                    id: "STAFF" as const,
                    title: "Staff",
                    desc: "Daily operations",
                    icon: Briefcase,
                  },
                  {
                    id: "MANAGER" as const,
                    title: "Manager",
                    desc: "Administration",
                    icon: ShieldCheck,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = formData.role === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, role: item.id }))
                      }
                      className={`relative p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50/70"
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-white text-gray-900 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      )}
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center mb-2 ${
                          isSelected
                            ? "bg-white/10 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p
                          className={`text-xs font-semibold leading-tight ${
                            isSelected ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {item.title}
                        </p>
                        <p
                          className={`text-[10px] mt-0.5 leading-tight truncate ${
                            isSelected ? "text-gray-300" : "text-gray-400"
                          }`}
                        >
                          {item.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-gray-900 hover:bg-black text-white text-sm font-medium rounded-lg transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? "Creating account..." : "Sign up"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-gray-900 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Right Side: Lazy Loaded Image with Skeleton Fallback (Vice Versa) */}
        <div className="md:w-1/2 relative bg-gray-900 min-h-[260px] md:min-h-[540px] order-1 md:order-2">
          <Suspense fallback={<RegisterSkeleton />}>
            <RegisterImage />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Register;
