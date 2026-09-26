import { Router } from "express";
import {
  getAllRooms,
  getClassifications,
  getAddons,
  getRoomById,
} from "../controller/roomController.ts";
import {
  getHostMetrics,
  createHostListing,
  toggleRoomStatus,
  getHostTasks,
  createHostTask,
  updateHostTask,
  getHostQueries,
  replyHostQuery,
  getHostBookings,
} from "../controller/hostController.ts";
import { addRoomReview } from "../controller/reviewController.ts";
import { createReservationInquiry } from "../controller/inquiryController.ts";
import { bookRoom, getMyBookings } from "../controller/bookingController.ts";

import { ValidateToken, OptionalToken } from "../middlewares/TokenValidator.ts";
import { validate } from "../middlewares/validate.ts";
import { cacheMiddleware } from "../middlewares/cache.ts";
import {
  createRoomSchema,
  createBookingSchema,
  toggleStatusSchema,
  createReviewSchema,
  createTaskSchema,
  updateTaskSchema,
  replyQuerySchema,
  reservationInquirySchema,
} from "../validators/room.validator.ts";

const router = Router();

// Public routes
router.get("/", cacheMiddleware(120, "rooms"), getAllRooms);
router.get("/classifications", cacheMiddleware(3600, "taxonomy"), getClassifications);
router.get("/addons", cacheMiddleware(3600, "taxonomy"), getAddons);

// Host & Admin routes (any authenticated user can host sanctuaries)
router.get("/host/metrics", ValidateToken, getHostMetrics);
router.post(
  "/host/new",
  ValidateToken,
  validate(createRoomSchema),
  createHostListing
);
router.get("/host/tasks", ValidateToken, getHostTasks);
router.post(
  "/host/tasks",
  ValidateToken,
  validate(createTaskSchema),
  createHostTask
);
router.patch(
  "/host/tasks/:id",
  ValidateToken,
  validate(updateTaskSchema),
  updateHostTask
);
router.get("/host/queries", ValidateToken, getHostQueries);
router.post(
  "/host/queries/:id/reply",
  ValidateToken,
  validate(replyQuerySchema),
  replyHostQuery
);
router.get("/host/bookings", ValidateToken, getHostBookings);

// Guest bookings list (auth required)
router.get("/my-bookings", ValidateToken, getMyBookings);

// Room detail and interactions

// GET /rooms/:id - Detail view for single room (Cached 300s)
router.get("/:id", cacheMiddleware(300, "room"), getRoomById);

// POST /rooms/:id/book - Confirm a reservation in database with date conflict check (Auth required)
router.post("/:id/book", ValidateToken, validate(createBookingSchema), bookRoom);

// PATCH /rooms/:id/status - Toggle room between active and maintenance (Host only)
router.patch(
  "/:id/status",
  ValidateToken,
  validate(toggleStatusSchema),
  toggleRoomStatus
);

// POST /rooms/:id/reviews - Add verified guest review
router.post("/:id/reviews", validate(createReviewSchema), addRoomReview);

// POST /rooms/:id/reserve - Submit reservation inquiry
router.post("/:id/reserve", validate(reservationInquirySchema), createReservationInquiry);

export default router;
