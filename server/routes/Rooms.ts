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

import { ValidateToken, requireRole } from "../middlewares/TokenValidator.ts";
import { validate } from "../middlewares/validate.ts";
import { cacheMiddleware } from "../middlewares/cache.ts";
import {
  createRoomSchema,
  toggleStatusSchema,
  createReviewSchema,
  createTaskSchema,
  updateTaskSchema,
  replyQuerySchema,
  reservationInquirySchema,
} from "../validators/room.validator.ts";

const router = Router();

// ==========================================
// PUBLIC ROOM BROWSING ENDPOINTS (WITH REDIS CACHING)
// ==========================================

// GET /rooms - List all rooms with search & filter (Cached 120s)
router.get("/", cacheMiddleware(120, "rooms"), getAllRooms);

// GET /rooms/classifications - Get editorial classification taxonomy (Cached 1 hour)
router.get("/classifications", cacheMiddleware(3600, "taxonomy"), getClassifications);

// GET /rooms/addons - Get available chalet experience addons (Cached 1 hour)
router.get("/addons", cacheMiddleware(3600, "taxonomy"), getAddons);

// ==========================================
// HOST MANAGEMENT ENDPOINTS (PROTECTED VIA JWT + ROLE GUARD)
// ==========================================

// GET /rooms/host/metrics - Aggregate earnings, occupancy, listings
router.get("/host/metrics", ValidateToken, requireRole(["MANAGER", "STAFF"]), getHostMetrics);

// POST /rooms/host/new - Create new suite associated directly to authenticated Host ID
router.post(
  "/host/new",
  ValidateToken,
  requireRole(["MANAGER", "STAFF"]),
  validate(createRoomSchema),
  createHostListing
);

// GET /rooms/host/tasks - Operations checklist
router.get("/host/tasks", ValidateToken, requireRole(["MANAGER", "STAFF"]), getHostTasks);

// POST /rooms/host/tasks - Create operational task
router.post(
  "/host/tasks",
  ValidateToken,
  requireRole(["MANAGER", "STAFF"]),
  validate(createTaskSchema),
  createHostTask
);

// PATCH /rooms/host/tasks/:id - Update task completion status
router.patch(
  "/host/tasks/:id",
  ValidateToken,
  requireRole(["MANAGER", "STAFF"]),
  validate(updateTaskSchema),
  updateHostTask
);

// GET /rooms/host/queries - Guest inquiries list
router.get("/host/queries", ValidateToken, requireRole(["MANAGER", "STAFF"]), getHostQueries);

// POST /rooms/host/queries/:id/reply - Send reply to guest inquiry
router.post(
  "/host/queries/:id/reply",
  ValidateToken,
  requireRole(["MANAGER", "STAFF"]),
  validate(replyQuerySchema),
  replyHostQuery
);

// GET /rooms/host/bookings - Host reservations ledger
router.get("/host/bookings", ValidateToken, requireRole(["MANAGER", "STAFF"]), getHostBookings);

// ==========================================
// ROOM DETAIL & INTERACTION ENDPOINTS
// ==========================================

// GET /rooms/:id - Detail view for single room (Cached 300s)
router.get("/:id", cacheMiddleware(300, "room"), getRoomById);

// PATCH /rooms/:id/status - Toggle room between active and maintenance (Host only)
router.patch(
  "/:id/status",
  ValidateToken,
  requireRole(["MANAGER", "STAFF"]),
  validate(toggleStatusSchema),
  toggleRoomStatus
);

// POST /rooms/:id/reviews - Add verified guest review
router.post("/:id/reviews", validate(createReviewSchema), addRoomReview);

// POST /rooms/:id/reserve - Submit reservation inquiry
router.post("/:id/reserve", validate(reservationInquirySchema), createReservationInquiry);

export default router;
