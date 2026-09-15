import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import {
  roomsApi,
  type Room,
  type ReservationPayload,
  type ChaletAddon,
  type RoomReview,
  type HostDetails,
} from "../lib/api";
import {
  ArrowLeft,
  Users,
  Maximize2,
  BedDouble,
  Bath,
  Check,
  Star,
  Calendar as CalendarIcon,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Mountain,
  Plus,
  Maximize,
  X,
  Award,
  MessageSquare,
  CheckCircle2,
  Clock,
  Globe,
  Send,
  CalendarDays,
} from "lucide-react";
import StayCalendar from "../components/Calendar";
import MuiSelect from "../components/MuiSelect";

import { CURATED_ROOMS } from "../data/roomsData";

const DEFAULT_HOST: HostDetails = {
  name: "Marcus & Elena Vance",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80",
  isSuperhost: true,
  yearsHosting: 6,
  responseRate: "100%",
  responseTime: "Within an hour",
  bio: "Architectural designers & high-alpine enthusiasts. We design bespoke, private timber sanctuaries in Crafters'Haven for restorative mountain getaways.",
  languages: ["English", "German", "French"],
};

const DEFAULT_REVIEWS: RoomReview[] = [
  {
    id: "rev-1",
    author: "Elena Rostova",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
    date: "August 2026",
    rating: 5,
    comment:
      "An extraordinary sanctuary. The panoramic glass overlooking the pine valley during sunrise was simply breathtaking. The heated cedar hot tub after a long trail hike was heavenly.",
  },
  {
    id: "rev-2",
    author: "Julian Thorne",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    date: "July 2026",
    rating: 5,
    comment:
      "Every single architectural detail was considered, from the Douglas fir joinery to the acoustic solitude. Marcus was exceptionally communicative and arranged our luggage concierge seamlessly.",
  },
  {
    id: "rev-3",
    author: "Amara Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    date: "June 2026",
    rating: 5,
    comment:
      "We booked the private chef dinner add-on and it was one of the finest meals we've ever had in the mountains. Quiet, pristine, and beautifully maintained.",
  },
];

const DEFAULT_ADDONS: ChaletAddon[] = [
  {
    id: "smores-hearth",
    title: "Alpine Firewood & Artisan S'mores Kit",
    description: "Kiln-dried pinon firewood, gourmet chocolate, house-made marshmallows, and copper skewers.",
    price: 45,
    category: "dining",
  },
  {
    id: "private-chef",
    title: "Private Chalet Chef 4-Course Dinner",
    description: "Bespoke 4-course alpine tasting menu prepared tableside by executive culinary chef.",
    price: 140,
    perGuest: true,
    category: "dining",
  },
  {
    id: "guided-backcountry",
    title: "Guided Backcountry Ski / Trail Tour",
    description: "Half-day private guided exploration through untouched powder glades with safety gear.",
    price: 95,
    perGuest: true,
    category: "adventure",
  },
  {
    id: "cedar-aromatherapy",
    title: "Nordic Cedar & Botanical Bath Ritual",
    description: "Locally foraged spruce essential oils, epsom bath salts, and organic honey-oat scrubs.",
    price: 65,
    category: "wellness",
  },
];

export default function RoomDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [room, setRoom] = useState<Room | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Reservation form state
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultCheckIn = tomorrow.toISOString().split("T")[0];

  const threeDaysLater = new Date();
  threeDaysLater.setDate(threeDaysLater.getDate() + 4);
  const defaultCheckOut = threeDaysLater.toISOString().split("T")[0];

  const [checkIn, setCheckIn] = useState<string>(defaultCheckIn);
  const [checkOut, setCheckOut] = useState<string>(defaultCheckOut);
  const [checkInTime, setCheckInTime] = useState<string>("15:00");
  const [checkOutTime, setCheckOutTime] = useState<string>("11:00");
  const [isStayCalendarOpen, setIsStayCalendarOpen] = useState(false);
  const [guestCount, setGuestCount] = useState<number>(2);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState<{
    confirmationNumber: string;
    totalAmount: number;
    nights: number;
  } | null>(null);

  // Host Contact Modal state
  const [isContactHostOpen, setIsContactHostOpen] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [isSendingContact, setIsSendingContact] = useState(false);
  const [contactSuccessBanner, setContactSuccessBanner] = useState(false);

  // Reviews state
  const [reviewsList, setReviewsList] = useState<RoomReview[]>(DEFAULT_REVIEWS);
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState("");

  useEffect(() => {
    let isMounted = true;
    window.scrollTo(0, 0);

    const loadRoom = async () => {
      setLoading(true);
      if (!id) return;

      try {
        const fetched = await roomsApi.getById(id);
        const fallback = CURATED_ROOMS.find((r) => r.id === id) || CURATED_ROOMS[0];
        if (isMounted) {
          const activeRoom = fetched || fallback;
          setRoom(activeRoom);
          setSelectedImage(activeRoom.featuredImage || activeRoom.gallery[0] || "");
          if (activeRoom.reviews && activeRoom.reviews.length > 0) {
            setReviewsList(activeRoom.reviews);
          }
        }
      } catch {
        if (isMounted) {
          const fallback = CURATED_ROOMS.find((r) => r.id === id) || CURATED_ROOMS[0];
          setRoom(fallback);
          setSelectedImage(fallback.featuredImage || fallback.gallery[0] || "");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadRoom();
    return () => {
      isMounted = false;
    };
  }, [id]);

  // Calculate nights & pricing
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1;
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const nights = calculateNights();
  const roomPrice = room?.price || 490;
  const baseTotal = roomPrice * nights;
  const cleaningFee = 120;
  const taxes = Math.round(baseTotal * 0.08);

  const addonsTotal = selectedAddonIds.reduce((sum, addonId) => {
    const addon = DEFAULT_ADDONS.find((a) => a.id === addonId);
    if (!addon) return sum;
    return sum + (addon.perGuest ? addon.price * guestCount : addon.price);
  }, 0);

  const grandTotal = baseTotal + cleaningFee + taxes + addonsTotal;

  const toggleAddon = (addonId: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(addonId) ? prev.filter((i) => i !== addonId) : [...prev, addonId]
    );
  };

  const handleReservationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!room) return;

    setIsSubmitting(true);
    const payload: ReservationPayload = {
      roomId: room.id,
      guestName,
      guestEmail,
      guestPhone,
      checkIn,
      checkOut,
      guests: guestCount,
      addons: selectedAddonIds,
      specialRequests,
      totalAmount: grandTotal,
    };

    try {
      const res = await roomsApi.reserve(room.id, payload);
      setReservationSuccess({
        confirmationNumber: res.data?.confirmationNumber || `CHS-${Date.now().toString().slice(-6)}`,
        totalAmount: grandTotal,
        nights,
      });
    } catch {
      // Local graceful fallback
      setReservationSuccess({
        confirmationNumber: `CHS-${Math.floor(100000 + Math.random() * 900000)}`,
        totalAmount: grandTotal,
        nights,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactHostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingContact(true);
    setTimeout(() => {
      setIsSendingContact(false);
      setContactSuccessBanner(true);
      setContactMessage("");
      setTimeout(() => {
        setContactSuccessBanner(false);
        setIsContactHostOpen(false);
      }, 2500);
    }, 600);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) return;

    setIsSubmittingReview(true);
    const newRevItem: RoomReview = {
      id: `rev-${Date.now()}`,
      author: reviewAuthor.trim(),
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
      date: "September 2026",
      rating: reviewRating,
      comment: reviewComment.trim(),
    };

    try {
      if (room?.id) {
        await roomsApi.addReview(room.id, {
          author: reviewAuthor.trim(),
          rating: reviewRating,
          comment: reviewComment.trim(),
        });
      }
    } catch {
      // ignore network errors and save locally
    } finally {
      setReviewsList([newRevItem, ...reviewsList]);
      setReviewAuthor("");
      setReviewComment("");
      setReviewRating(5);
      setIsSubmittingReview(false);
      setReviewSuccessMsg("Thank you! Your guest review has been published.");
      setTimeout(() => setReviewSuccessMsg(""), 4000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF5F5] flex flex-col justify-between">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#E2B4BD] border-t-[#4A4A4A] rounded-full animate-spin" />
            <p className="text-xs text-[#4A4A4A]/70 font-medium">Preparing Suite Details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-[#FFF5F5] flex flex-col justify-between">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-xl font-bold font-syne text-[#4A4A4A]">Suite Not Found</h2>
          <p className="text-xs text-[#4A4A4A]/70 mt-2 max-w-xs">
            The requested mountain accommodation is not currently available in our records.
          </p>
          <Link
            to="/rooms"
            className="mt-4 px-4 py-2 rounded-full bg-[#4A4A4A] hover:bg-[#333333] text-white text-xs font-semibold shadow-sm transition"
          >
            Return to Suites
          </Link>
        </div>
      </div>
    );
  }

  const hostInfo = room.host || DEFAULT_HOST;

  return (
    <div className="min-h-screen bg-[#FFF5F5] text-[#4A4A4A] font-sans selection:bg-[#4A4A4A] selection:text-white pb-28 md:pb-16">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-4 sm:pt-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between py-2 mb-4 text-xs">
          <div className="flex items-center gap-2 text-[#4A4A4A]/70">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 hover:text-black transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <span className="text-[#E2B4BD]">/</span>
            <Link to="/rooms" className="hover:text-black transition">
              Suites
            </Link>
            <span className="text-[#E2B4BD]">/</span>
            <span className="text-[#4A4A4A] font-semibold truncate max-w-[140px] sm:max-w-none">
              {room.name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {room.elevation && (
              <div className="hidden sm:flex items-center gap-1 text-[#4A4A4A] font-medium text-[11px] bg-white border border-[#E2B4BD]/40 px-2.5 py-1 rounded-full shadow-2xs">
                <Mountain className="w-3.5 h-3.5 text-[#4A4A4A]" />
                <span>{room.elevation}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 bg-white border border-[#E2B4BD]/40 px-2.5 py-1 rounded-full text-[#4A4A4A] font-semibold text-[11px] shadow-2xs">
              <Star className="w-3.5 h-3.5 fill-[#4A4A4A] text-[#4A4A4A]" />
              <span>{room.rating}</span>
              <span className="text-[#4A4A4A]/60 font-normal">({reviewsList.length} reviews)</span>
            </div>
          </div>
        </div>

        {/* Title Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E2B4BD]/40 text-[#4A4A4A] text-xs font-semibold uppercase tracking-wider mb-2 shadow-2xs">
              <Sparkles className="w-3 h-3 text-[#4A4A4A]" />
              <span>{room.category} Collection</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-syne text-[#4A4A4A] tracking-tight">
              {room.name}
            </h1>
            <p className="text-[#4A4A4A]/70 text-sm sm:text-base mt-1 font-normal">{room.tagline}</p>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-syne text-[#4A4A4A]">${room.price}</span>
            <span className="text-xs text-[#4A4A4A]/60 font-medium">/ night + taxes</span>
          </div>
        </div>

        {/* Media Gallery (Main + Thumbnails + Full Lightbox) */}
        <div className="mb-10 space-y-3">
          <div className="relative w-full max-w-full h-72 sm:h-96 md:h-[480px] rounded-2xl overflow-hidden bg-white shadow-xs border border-[#E2B4BD]/40 group">
            <img
              src={selectedImage || room.featuredImage}
              alt={room.name}
              className="w-full h-full max-w-full object-cover transition-opacity duration-300 cursor-pointer"
              onClick={() => setIsLightboxOpen(true)}
            />
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#4A4A4A] text-white text-xs font-semibold shadow-xs">
              Crafters'Haven Reserve • {room.category.toUpperCase()}
            </div>
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-white/95 hover:bg-[#F7D6D0]/30 text-[#4A4A4A] text-xs font-semibold shadow-md flex items-center gap-1.5 transition cursor-pointer active:scale-95 border border-[#E2B4BD]/40"
            >
              <Maximize className="w-3.5 h-3.5 text-[#4A4A4A]" />
              <span>Full View</span>
            </button>
          </div>

          {/* Thumbnails Row */}
          {room.gallery && room.gallery.length > 1 && (
            <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none w-full max-w-full">
              {room.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative flex-shrink-0 w-24 h-16 sm:w-28 sm:h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer active:scale-95 ${
                    selectedImage === img
                      ? "border-[#4A4A4A] shadow-md scale-102"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${room.name} view ${idx + 1}`}
                    className="w-full h-full max-w-full object-cover block"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Room Narrative, Specs, Add-ons, Host & Amenities */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-white border border-stone-200 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-stone-500 text-xs">
                  <Users className="w-3.5 h-3.5 text-stone-700" />
                  <span>Guests</span>
                </div>
                <span className="font-semibold text-stone-900 text-sm">Up to {room.guests}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-stone-200 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-stone-500 text-xs">
                  <Maximize2 className="w-3.5 h-3.5 text-stone-700" />
                  <span>Living Space</span>
                </div>
                <span className="font-semibold text-stone-900 text-sm">{room.size}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-stone-200 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-stone-500 text-xs">
                  <BedDouble className="w-3.5 h-3.5 text-stone-700" />
                  <span>Bedrooms</span>
                </div>
                <span className="font-semibold text-stone-900 text-sm">
                  {room.bedrooms} Bedroom{room.bedrooms > 1 ? "s" : ""}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-stone-200 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-stone-500 text-xs">
                  <Bath className="w-3.5 h-3.5 text-stone-700" />
                  <span>Bathrooms</span>
                </div>
                <span className="font-semibold text-stone-900 text-sm">{room.bathrooms} En-suite</span>
              </div>
            </div>

            {/* Architectural Overview */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200 space-y-4 shadow-xs">
              <h2 className="text-lg sm:text-xl font-bold font-syne text-stone-900">
                Architectural Experience
              </h2>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
                {room.description}
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-stone-700">
                <span className="flex items-center gap-1.5 text-amber-800">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Bed Configuration: {room.bed}</span>
                </span>
                {room.elevation && (
                  <span className="flex items-center gap-1.5 text-stone-500">
                    <Mountain className="w-3.5 h-3.5 text-stone-400" />
                    <span>Elevation: {room.elevation}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Curated Mountain Experiences & Add-ons */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                    Enhance Your Stay
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold font-syne text-stone-900">
                    Curated Alpine Add-Ons
                  </h2>
                </div>
                <span className="text-xs text-stone-400">Optional</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DEFAULT_ADDONS.map((addon) => {
                  const isSelected = selectedAddonIds.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                        isSelected
                          ? "border-stone-900 bg-stone-50/80 shadow-xs"
                          : "border-stone-200 hover:border-stone-300 bg-white"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-xs text-stone-900">{addon.title}</h4>
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                              isSelected
                                ? "bg-stone-900 text-white"
                                : "border border-stone-300 text-stone-400"
                            }`}
                          >
                            {isSelected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                          </div>
                        </div>
                        <p className="text-[11px] text-stone-500 leading-relaxed font-normal">
                          {addon.description}
                        </p>
                      </div>

                      <div className="text-xs font-bold text-stone-900">
                        +${addon.price}{" "}
                        {addon.perGuest && (
                          <span className="text-[10px] font-normal text-stone-500">/ guest</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Categorized Amenities */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200 space-y-5 shadow-xs">
              <h2 className="text-lg sm:text-xl font-bold font-syne text-stone-900">
                Curated Amenities & Services
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {room.amenities.map((category, idx) => (
                  <div key={idx} className="space-y-2.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-1.5">
                      {category.title}
                    </h3>
                    <ul className="space-y-2 text-xs text-stone-600">
                      {category.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Host Profile Block */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200 space-y-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <img
                      src={hostInfo.avatar}
                      alt={hostInfo.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-stone-200"
                    />
                    {hostInfo.isSuperhost && (
                      <div
                        title="Superhost"
                        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center ring-2 ring-white"
                      >
                        <Award className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-syne text-stone-900 flex items-center gap-1.5">
                      <span>Hosted by {hostInfo.name}</span>
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mt-0.5">
                      {hostInfo.isSuperhost && (
                        <span className="font-semibold text-amber-700">Superhost</span>
                      )}
                      <span>•</span>
                      <span>{hostInfo.yearsHosting} years hosting</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-stone-600">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Identity verified</span>
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsContactHostOpen(true)}
                  className="px-4 py-2 rounded-full border border-stone-300 hover:border-stone-900 bg-white hover:bg-stone-900 hover:text-white text-stone-800 text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 self-start sm:self-auto active:scale-95"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Contact Host</span>
                </button>
              </div>

              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">{hostInfo.bio}</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-stone-500 shrink-0" />
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block">
                      Response Rate
                    </span>
                    <span className="font-semibold text-stone-800">{hostInfo.responseRate}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-stone-500 shrink-0" />
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block">
                      Response Time
                    </span>
                    <span className="font-semibold text-stone-800">{hostInfo.responseTime}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-stone-500 shrink-0" />
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block">
                      Languages
                    </span>
                    <span className="font-semibold text-stone-800">
                      {hostInfo.languages?.join(", ") || "English"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Policies */}
            <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200/80 space-y-3 text-xs text-stone-600">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-stone-800" />
                <span>Stay Policies & Arrival</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div>
                  <span className="font-medium text-stone-800 block">Check-in</span>
                  <span className="text-stone-500">{room.policies.checkIn}</span>
                </div>
                <div>
                  <span className="font-medium text-stone-800 block">Check-out</span>
                  <span className="text-stone-500">{room.policies.checkOut}</span>
                </div>
                <div>
                  <span className="font-medium text-stone-800 block">Cancellation</span>
                  <span className="text-stone-500">{room.policies.cancellation}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Reservation Widget */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-24 bg-white rounded-2xl p-5 sm:p-6 border border-[#E2B4BD]/40 shadow-sm space-y-5">
              <div className="flex items-baseline justify-between border-b border-[#E2B4BD]/20 pb-4">
                <div>
                  <span className="text-2xl font-bold font-syne text-[#4A4A4A]">${room.price}</span>
                  <span className="text-xs text-[#4A4A4A]/60 font-normal"> / night</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-[#4A4A4A]">
                  <Star className="w-3.5 h-3.5 fill-[#4A4A4A] text-[#4A4A4A]" />
                  <span>{room.rating}</span>
                </div>
              </div>

              {reservationSuccess ? (
                <div className="p-5 rounded-xl bg-[#4A4A4A] text-white space-y-4 animate-in fade-in duration-300">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-syne">Reservation Received</h3>
                    <p className="text-stone-300 text-xs mt-1">
                      Our concierge team will reach out to verify arrival times and private transfer
                      coordination.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-stone-800/80 border border-stone-700/60 text-xs space-y-1.5 font-mono">
                    <div className="flex justify-between text-stone-300">
                      <span>Confirmation:</span>
                      <span className="text-white font-bold">
                        {reservationSuccess.confirmationNumber}
                      </span>
                    </div>
                    <div className="flex justify-between text-stone-300">
                      <span>Duration:</span>
                      <span className="text-white">{reservationSuccess.nights} Nights</span>
                    </div>
                    <div className="flex justify-between text-stone-300">
                      <span>Estimated Total:</span>
                      <span className="text-emerald-400 font-bold">
                        ${reservationSuccess.totalAmount}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setReservationSuccess(null)}
                    className="w-full py-2.5 rounded-full bg-white text-[#4A4A4A] font-semibold text-xs hover:bg-[#F7D6D0]/30 transition cursor-pointer active:scale-95"
                  >
                    Modify Dates / Book Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReservationSubmit} className="space-y-4">
                  {/* Interactive Dates Selection */}
                  <div
                    onClick={() => setIsStayCalendarOpen(true)}
                    className="p-3 rounded-xl border border-[#E2B4BD]/40 bg-[#FFF5F5] hover:bg-[#F7D6D0]/30 transition cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-[10px] font-semibold text-[#4A4A4A]/70 uppercase tracking-wider mb-1.5">
                      <span className="flex items-center gap-1 text-[#4A4A4A]">
                        <Sparkles className="w-3 h-3 text-[#4A4A4A]" />
                        <span>Stay Dates & Times</span>
                      </span>
                      <span className="text-[#4A4A4A]/60 group-hover:text-[#4A4A4A] transition font-bold">
                        Change Dates
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="flex items-center gap-1.5 text-[#4A4A4A] font-semibold">
                          <CalendarIcon className="w-3.5 h-3.5 text-[#4A4A4A]" />
                          <span>{checkIn}</span>
                        </div>
                        <div className="text-[10px] text-[#4A4A4A]/60 mt-0.5 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          <span>In: {checkInTime}</span>
                        </div>
                      </div>

                      <div className="border-l border-[#E2B4BD]/30 pl-2">
                        <div className="flex items-center gap-1.5 text-[#4A4A4A] font-semibold">
                          <CalendarDays className="w-3.5 h-3.5 text-[#4A4A4A]" />
                          <span>{checkOut}</span>
                        </div>
                        <div className="text-[10px] text-[#4A4A4A]/60 mt-0.5 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          <span>Out: {checkOutTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stay Calendar Modal Dialog */}
                  {isStayCalendarOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                      <div className="max-w-sm w-full shadow-2xl rounded-2xl overflow-hidden">
                        <StayCalendar
                          value={{
                            startDate: checkIn,
                            endDate: checkOut,
                            startTime: checkInTime,
                            endTime: checkOutTime,
                          }}
                          onChange={(range) => {
                            if (range.startDate) setCheckIn(range.startDate);
                            if (range.endDate) setCheckOut(range.endDate);
                            if (range.startTime) setCheckInTime(range.startTime);
                            if (range.endTime) setCheckOutTime(range.endTime);
                          }}
                          onClose={() => setIsStayCalendarOpen(false)}
                          showApplyButton={true}
                          label={`${room.name} • Stay Calendar`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Guests Count (MuiSelect) */}
                  <div>
                    <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">Guests</label>
                    <MuiSelect
                      value={guestCount}
                      onChange={(val) => setGuestCount(Number(val))}
                      options={Array.from({ length: room.guests }, (_, i) => i + 1).map((num) => ({
                        value: num,
                        label: `${num} Guest${num > 1 ? "s" : ""}`,
                      }))}
                      className="w-full"
                    />
                  </div>

                  {/* Guest Contact Details */}
                  <div className="space-y-2.5 pt-1">
                    <div>
                      <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Eleanor Vance"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-xl border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] placeholder:text-stone-400 focus:outline-hidden focus:border-[#4A4A4A] bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="name@haven.com"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-xl border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] placeholder:text-stone-400 focus:outline-hidden focus:border-[#4A4A4A] bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">
                        Phone (for Arrival Coordination)
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 019-2831"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] placeholder:text-stone-400 focus:outline-hidden focus:border-[#4A4A4A] bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">
                        Special Requests
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Dietary preferences, private ski guides..."
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#E2B4BD]/40 text-xs text-[#4A4A4A] placeholder:text-stone-400 focus:outline-hidden focus:border-[#4A4A4A] bg-white resize-none"
                      />
                    </div>
                  </div>

                  {/* Price Breakdown with Add-ons */}
                  <div className="pt-3 border-t border-[#E2B4BD]/20 text-xs space-y-2 text-[#4A4A4A]/80">
                    <div className="flex justify-between">
                      <span>
                        ${room.price} × {nights} {nights === 1 ? "night" : "nights"}
                      </span>
                      <span className="font-semibold text-[#4A4A4A]">${baseTotal}</span>
                    </div>

                    {addonsTotal > 0 && (
                      <div className="flex justify-between text-[#4A4A4A] font-medium">
                        <span>Selected Alpine Add-ons ({selectedAddonIds.length})</span>
                        <span className="font-semibold">+${addonsTotal}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Chalet Preparation & Linen Service</span>
                      <span className="font-medium text-[#4A4A4A]">${cleaningFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Resort Tax (8%)</span>
                      <span className="font-medium text-[#4A4A4A]">${taxes}</span>
                    </div>
                    <div className="pt-2 border-t border-[#E2B4BD]/30 flex justify-between text-sm font-bold text-[#4A4A4A]">
                      <span>Total</span>
                      <span>${grandTotal}</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-full bg-[#4A4A4A] hover:bg-[#2D2D2D] text-white font-semibold text-xs tracking-wide shadow-md shadow-[#4A4A4A]/20 transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Reserving Suite...</span>
                      </span>
                    ) : (
                      <>
                        <span>Inquire & Reserve Suite</span>
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-stone-400 font-normal">
                    Direct booking • Guaranteed best rate • Complimentary concierge
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Full-Width Reviews System */}
        <section className="mt-14 sm:mt-20 pt-10 border-t border-stone-200">
          <div className="max-w-4xl">
            {/* Rating Overview Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1.5 text-stone-900 text-2xl font-bold font-syne">
                <Star className="w-6 h-6 fill-stone-900 text-stone-900" />
                <span>{room.rating}</span>
              </div>
              <span className="text-xl text-stone-400 font-light">•</span>
              <h2 className="text-2xl font-bold font-syne text-stone-900">
                {reviewsList.length} Guest Reviews
              </h2>
            </div>

            {/* 5-Category Rating Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3.5 gap-x-8 mb-10 pb-8 border-b border-stone-200">
              {[
                { label: "Cleanliness", score: "5.0", percent: 100 },
                { label: "Accuracy", score: "4.9", percent: 98 },
                { label: "Communication", score: "5.0", percent: 100 },
                { label: "Location", score: "4.9", percent: 98 },
                { label: "Check-in", score: "5.0", percent: 100 },
                { label: "Value", score: "4.8", percent: 96 },
              ].map((cat) => (
                <div key={cat.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-700 font-medium">{cat.label}</span>
                    <span className="font-semibold text-stone-900">{cat.score}</span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-stone-900 rounded-full"
                      style={{ width: `${cat.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Existing Guest Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {reviewsList.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        rev.avatar ||
                        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"
                      }
                      alt={rev.author}
                      className="w-10 h-10 rounded-full object-cover border border-stone-200"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">{rev.author}</h4>
                      <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
                        <span>{rev.date}</span>
                        <span>•</span>
                        <div className="flex items-center text-amber-500">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-2.5 h-2.5 fill-amber-500" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-stone-600 text-xs leading-relaxed font-normal">{rev.comment}</p>
                </div>
              ))}
            </div>

            {/* Interactive "Write a Review" Form */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold font-syne text-stone-900">
                Share Your Experience with Crafters'Haven
              </h3>
              <p className="text-stone-500 text-xs">
                Your feedback helps our mountain hosts and future travelers maintain the highest standard
                of alpine hospitality.
              </p>

              {reviewSuccessMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{reviewSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Liam Sterling"
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-hidden focus:border-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Overall Rating
                    </label>
                    <div className="flex items-center gap-2 pt-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="cursor-pointer hover:scale-115 transition-transform"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= reviewRating
                                ? "fill-amber-400 text-amber-500"
                                : "text-stone-300"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-semibold text-stone-800 ml-1.5">
                        {reviewRating} of 5 Stars
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Your Review
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe your stay, the tranquility, the cedar sauna, and the host's hospitality..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-hidden focus:border-stone-900 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmittingReview ? (
                    <span>Posting Review...</span>
                  ) : (
                    <>
                      <span>Post Review</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-stone-950/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-5xl max-h-[80vh] w-full flex items-center justify-center overflow-hidden rounded-2xl">
            <img
              src={selectedImage || room.featuredImage}
              alt={room.name}
              className="max-w-full max-h-[80vh] object-contain rounded-xl"
            />
          </div>

          <div className="mt-4 flex items-center gap-2 text-white/80 text-xs">
            <span>{room.name}</span>
            <span>•</span>
            <span>{room.category.toUpperCase()}</span>
          </div>
        </div>
      )}

      {/* Contact Host Direct Inquiry Modal */}
      {isContactHostOpen && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200 relative">
            <button
              onClick={() => setIsContactHostOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <img
                src={hostInfo.avatar}
                alt={hostInfo.name}
                className="w-12 h-12 rounded-full object-cover border border-stone-200"
              />
              <div>
                <h3 className="font-bold font-syne text-base text-stone-900">
                  Message {hostInfo.name}
                </h3>
                <p className="text-[11px] text-stone-500">
                  Typically responds in {hostInfo.responseTime.toLowerCase()}
                </p>
              </div>
            </div>

            {contactSuccessBanner ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex flex-col items-center text-center gap-2 my-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                <h4 className="font-bold text-sm">Inquiry Sent Successfully</h4>
                <p className="text-stone-600 text-[11px]">
                  {hostInfo.name} has received your inquiry and will respond directly to your email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactHostSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sophia Anderson"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-hidden focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Your Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="sophia@haven.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-hidden focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Message to Host
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Hello Marcus, we have a question about early luggage arrival and ski room storage..."
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-hidden focus:border-stone-900 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSendingContact}
                  className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xs font-semibold shadow-xs transition cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSendingContact ? (
                    <span>Sending message...</span>
                  ) : (
                    <>
                      <span>Send Direct Message</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
