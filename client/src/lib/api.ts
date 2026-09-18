import axios from "axios";

export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Always send and receive HTTP-only cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor: handle global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.message ||
      error.message ||
      "An unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);

export interface User {
  id: string;
  name: string;
  email: string;
  role: "GUEST" | "STAFF" | "MANAGER";
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token?: string;
}

export interface ProfileResponse {
  message: string;
  data: User;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: "GUEST" | "STAFF" | "MANAGER";
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  register: async (data: RegisterPayload): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/auth/register", data);
    return res.data;
  },

  login: async (data: LoginPayload): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/auth/login", data);
    return res.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const res = await api.post<{ message: string }>("/auth/logout");
    return res.data;
  },

  getProfile: async (): Promise<User> => {
    const res = await api.get<ProfileResponse>("/auth/me");
    return res.data.data;
  },
};

export type RoomCategory = "chalet" | "villa" | "penthouse" | "loft" | "dome";

export interface HostDetails {
  name: string;
  avatar: string;
  isSuperhost: boolean;
  yearsHosting: number;
  responseRate: string;
  responseTime: string;
  bio: string;
  languages: string[];
}

export interface RoomReview {
  id: string;
  author: string;
  avatar: string;
  date: string;
  rating: number;
  comment: string;
}

export interface ReviewSubmission {
  author: string;
  rating: number;
  comment: string;
}

export interface HostMetrics {
  totalEarnings: number;
  occupancyRate: number;
  totalListings: number;
  activeListings: number;
  totalReviews: number;
  averageRating: number;
  pendingInquiries: number;
}

export interface Room {
  id: string;
  name: string;
  category: RoomCategory;
  price: number;
  featuredImage: string;
  gallery: string[];
  size: string;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  bed: string;
  tagline: string;
  description: string;
  elevation?: string;
  highlights?: string[];
  status?: "active" | "maintenance" | "inactive";
  host?: HostDetails;
  hostEmail?: string;
  hostName?: string;
  reviews?: RoomReview[];
  calculatedNights?: number;
  calculatedTotalPrice?: number;
  isAvailable?: boolean;
  amenities: {
    title: string;
    items: string[];
  }[];
  rating: number;
  reviewsCount: number;
  policies: {
    checkIn: string;
    checkOut: string;
    cancellation: string;
  };
}

export interface ClassificationMeta {
  id: RoomCategory;
  label: string;
  tagline: string;
  elevation: string;
  architecture: string;
  signatureFeature: string;
  idealFor: string;
  count?: number;
}

export interface ChaletAddon {
  id: string;
  title: string;
  description: string;
  price: number;
  perGuest?: boolean;
  category: "dining" | "wellness" | "adventure" | "concierge";
}

export interface RoomsListResponse {
  success: boolean;
  count: number;
  nights?: number;
  data: Room[];
}

export interface RoomDetailResponse {
  success: boolean;
  data: Room;
}

export interface ReservationPayload {
  checkIn: string;
  checkOut: string;
  guests: number;
  name?: string;
  guestName?: string;
  email?: string;
  guestEmail?: string;
  phone?: string;
  guestPhone?: string;
  specialRequests?: string;
  selectedAddons?: string[];
  addons?: string[];
  roomId?: string;
  totalAmount?: number;
}

export type RoomItem = Room;

export interface RoomsQueryParams {
  category?: string;
  sort?: string;
  guests?: number;
  maxPrice?: number;
  place?: string;
  checkIn?: string;
  checkOut?: string;
}

export const roomsApi = {
  getAll: async (params?: RoomsQueryParams | string): Promise<Room[]> => {
    try {
      let query = "";
      if (typeof params === "string") {
        query = params && params !== "all" ? `?category=${params}` : "";
      } else if (params) {
        const search = new URLSearchParams();
        if (params.category && params.category !== "all") search.set("category", params.category);
        if (params.sort) search.set("sort", params.sort);
        if (params.guests) search.set("guests", String(params.guests));
        if (params.maxPrice) search.set("maxPrice", String(params.maxPrice));
        if (params.place && params.place !== "all") search.set("place", params.place);
        if (params.checkIn) search.set("checkIn", params.checkIn);
        if (params.checkOut) search.set("checkOut", params.checkOut);
        const qs = search.toString();
        query = qs ? `?${qs}` : "";
      }
      const res = await api.get<RoomsListResponse>(`/rooms${query}`);
      return res.data.data;
    } catch {
      return [];
    }
  },

  getClassifications: async (): Promise<ClassificationMeta[]> => {
    try {
      const res = await api.get<{ success: boolean; data: ClassificationMeta[] }>("/rooms/classifications");
      return res.data.data;
    } catch {
      return [];
    }
  },

  getAddons: async (): Promise<ChaletAddon[]> => {
    try {
      const res = await api.get<{ success: boolean; data: ChaletAddon[] }>("/rooms/addons");
      return res.data.data;
    } catch {
      return [];
    }
  },

  getById: async (id: string): Promise<Room | null> => {
    try {
      const res = await api.get<RoomDetailResponse>(`/rooms/${id}`);
      return res.data.data;
    } catch {
      return null;
    }
  },

  addReview: async (id: string, review: ReviewSubmission) => {
    const res = await api.post(`/rooms/${id}/reviews`, review);
    return res.data;
  },

  getHostMetrics: async (): Promise<HostMetrics | null> => {
    try {
      const res = await api.get<{ success: boolean; data: HostMetrics }>("/rooms/host/metrics");
      return res.data.data;
    } catch {
      return null;
    }
  },

  toggleRoomStatus: async (id: string, status?: string) => {
    const res = await api.patch(`/rooms/${id}/status`, { status });
    return res.data;
  },

  createHostListing: async (roomData: Partial<Room>) => {
    const res = await api.post("/rooms/host/new", roomData);
    return res.data;
  },

  reserve: async (id: string, payload: ReservationPayload) => {
    const res = await api.post(`/rooms/${id}/reserve`, payload);
    return res.data;
  },
};

export default api;
