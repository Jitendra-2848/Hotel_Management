import { z } from "zod";

export const createRoomSchema = z.object({
  name: z.string().trim().min(3, "Sanctuary name must be at least 3 characters long"),
  category: z.enum(["chalet", "villa", "penthouse", "loft", "dome"]),
  price: z.coerce.number().positive("Nightly price must be greater than 0"),
  size: z.string().trim().optional().default("1,200 sq ft"),
  guests: z.coerce.number().int().min(1, "Guests must be at least 1").default(2),
  bedrooms: z.coerce.number().int().min(1, "Bedrooms must be at least 1").default(1),
  bathrooms: z.coerce.number().int().min(1, "Bathrooms must be at least 1").default(1),
  bed: z.string().trim().optional().default("1 King Bed"),
  tagline: z.string().trim().min(5, "Tagline must be at least 5 characters long"),
  description: z.string().trim().min(10, "Description must be at least 10 characters long"),
  featuredImage: z
    .string()
    .trim()
    .url("Featured image must be a valid URL (e.g. from Unsplash)"),
  gallery: z.array(z.string().url("Gallery item must be a valid URL")).optional().default([]),
  amenities: z.any().optional(),
  policies: z.any().optional(),
  hostName: z.string().trim().optional(),
  hostEmail: z.string().trim().email().optional(),
});

export const toggleStatusSchema = z.object({
  status: z.enum(["active", "maintenance", "inactive"]).optional(),
});

export const createReviewSchema = z.object({
  author: z.string().trim().min(2, "Author name must be at least 2 characters"),
  rating: z.coerce.number().min(1).max(5, "Rating must be between 1 and 5"),
  comment: z.string().trim().min(5, "Comment must be at least 5 characters"),
});

export const createTaskSchema = z.object({
  title: z.string().trim().min(3, "Task title must be at least 3 characters"),
  suite: z.string().trim().optional().default("Concierge"),
  due: z.string().trim().optional().default("Today"),
  priority: z.enum(["urgent", "medium", "low"]).optional().default("medium"),
});

export const updateTaskSchema = z.object({
  completed: z.boolean(),
});

export const replyQuerySchema = z.object({
  reply: z.string().trim().min(1, "Reply message cannot be empty"),
});

export const createBookingSchema = z.object({
  guestName: z.string().trim().min(2, "Guest name is required"),
  guestEmail: z.string().trim().email("Valid guest email is required"),
  checkIn: z.string().trim().min(1, "Check-in date is required"),
  checkOut: z.string().trim().min(1, "Check-out date is required"),
  guests: z.coerce.number().int().min(1).default(1),
  totalPrice: z.coerce.number().positive("Total price must be greater than 0"),
  specialRequests: z.string().trim().optional(),
  addons: z.array(z.string()).optional().default([]),
});

export const reservationInquirySchema = z.object({
  guestName: z.string().trim().min(2, "Guest name is required"),
  guestEmail: z.string().trim().email("Valid guest email is required"),
  checkIn: z.string().trim().min(1, "Check-in date is required"),
  checkOut: z.string().trim().min(1, "Check-out date is required"),
  guests: z.coerce.number().int().min(1).default(1),
  specialRequests: z.string().trim().optional(),
  selectedAddons: z.array(z.string()).optional().default([]),
  totalAmount: z.coerce.number().optional(),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type ReservationInquiryInput = z.infer<typeof reservationInquirySchema>;
