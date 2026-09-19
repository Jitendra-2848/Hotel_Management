import { RoomCategory } from "../../lib/api";

export type NavTab =
  | "overview"
  | "bookings"
  | "providers"
  | "services"
  | "customers"
  | "commissions"
  | "payouts"
  | "disputes"
  | "approvals"
  | "analytics"
  | "notifications"
  | "policies";

export interface ManagementTask {
  id: string;
  title: string;
  category: "Approval" | "Concierge" | "Housekeeping" | "Maintenance" | string;
  due: string;
  urgent?: boolean;
  completed: boolean;
}

export interface GuestQuery {
  id: string;
  guestName: string;
  roomName: string;
  avatar: string;
  message: string;
  timestamp: string;
  status: "pending" | "resolved";
  reply?: string;
}

export interface BookingRecord {
  id: string;
  roomId: string;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: string;
  payoutStatus: string;
  room?: {
    name: string;
    featuredImage: string;
  };
}

export interface NewRoomFormData {
  name: string;
  category: RoomCategory;
  price: number;
  size: string;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  bed: string;
  tagline: string;
  description: string;
  featuredImage: string;
  gallery?: string[];
}

export interface UnsplashPreset {
  id: string;
  title: string;
  category: RoomCategory;
  url: string;
}

export const CURATED_UNSPLASH_PRESETS: UnsplashPreset[] = [
  {
    id: "preset-aframe",
    title: "Alpine Timber A-Frame",
    category: "chalet",
    url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "preset-glacier",
    title: "Glacier Ridge Panorama",
    category: "chalet",
    url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "preset-summit",
    title: "Summit Glass Penthouse",
    category: "penthouse",
    url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "preset-nordic",
    title: "Nordic Haven Cabin",
    category: "chalet",
    url: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "preset-dome",
    title: "Stargazing Geodesic Dome",
    category: "dome",
    url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "preset-villa",
    title: "Forest & Riverfront Villa",
    category: "villa",
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  },
];
