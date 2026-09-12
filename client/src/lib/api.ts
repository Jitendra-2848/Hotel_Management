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

export default api;
