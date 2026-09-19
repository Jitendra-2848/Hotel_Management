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

// Public routes
router.get("/", cacheMiddleware(120, "rooms"), getAllRooms);
router.get("/classifications", cacheMiddleware(3600, "taxonomy"), getClassifications);
router.get("/addons", cacheMiddleware(3600, "taxonomy"), getAddons);

// Host routes (auth required)
router.get("/host/metrics", ValidateToken, requireRole(["MANAGER", "STAFF"]), getHostMetrics);
router.post(
  "/host/new",
  ValidateToken,
  requireRole(["MANAGER", "STAFF"]),
  validate(createRoomSchema),
  createHostListing
);
router.get("/host/tasks", ValidateToken, requireRole(["MANAGER", "STAFF"]), getHostTasks);
router.post(
  "/host/tasks",
  ValidateToken,
  requireRole(["MANAGER", "STAFF"]),
  validate(createTaskSchema),
  createHostTask
);
router.patch(
  "/host/tasks/:id",
  ValidateToken,
  requireRole(["MANAGER", "STAFF"]),
  validate(updateTaskSchema),
  updateHostTask
);
router.get("/host/queries", ValidateToken, requireRole(["MANAGER", "STAFF"]), getHostQueries);
router.post(
  "/host/queries/:id/reply",
  ValidateToken,
  requireRole(["MANAGER", "STAFF"]),
  validate(replyQuerySchema),
  replyHostQuery
);
router.get("/host/bookings", ValidateToken, requireRole(["MANAGER", "STAFF"]), getHostBookings);

// Room detail and interactions

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
