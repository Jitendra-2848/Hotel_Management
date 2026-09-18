import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./lib/ProtectedRoute";
import GuestRoute from "./lib/GuestRoute";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";

// Lazy-loaded components
const Home = lazy(() => import("./pages/Home/Home"));
const Login = lazy(() => import("./pages/Auth/Login"));
const Register = lazy(() => import("./pages/Auth/Register"));
const Rooms = lazy(() => import("./pages/Rooms"));
const RoomDetail = lazy(() => import("./pages/RoomDetail"));
const Profile = lazy(() => import("./pages/Profile/Profile"));
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));
const About = lazy(() => import("./pages/About/About"));
const FAQs = lazy(() => import("./pages/FAQs/FAQs"));

export default function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-[#FFF5F5]">
            <div className="w-8 h-8 border-2 border-[#E2B4BD]/50 border-t-[#4A4A4A] rounded-full animate-spin" />
          </div>
        }
      >
        <Routes>
          {/* Protected Main & Profile Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Public / Guest-only Routes */}
          <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            }
          />

          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/faqs" element={<FAQs />} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <Footer />
    </AuthProvider>
  );
}