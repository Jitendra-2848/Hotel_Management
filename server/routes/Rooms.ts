import { Router } from "express";
import {
  getAllRooms,
  getClassifications,
  getAddons,
  getHostMetrics,
  createHostListing,
  getRoomById,
  toggleRoomStatus,
  addRoomReview,
  createReservationInquiry,
} from "../controller/Rooms.ts";

const router = Router();

// GET /rooms - List all rooms with place, checkIn, checkOut, guests, category, sort
router.get("/", getAllRooms);

// GET /rooms/classifications - Get editorial classification taxonomy
router.get("/classifications", getClassifications);

// GET /rooms/addons - Get available chalet experience addons
router.get("/addons", getAddons);

// Host Management Endpoints (before /:id)
router.get("/host/metrics", getHostMetrics);
router.post("/host/new", createHostListing);

// Room Detail & Reviews
router.get("/:id", getRoomById);
router.patch("/:id/status", toggleRoomStatus);
router.post("/:id/reviews", addRoomReview);

// POST /rooms/:id/reserve - Submit reservation inquiry
router.post("/:id/reserve", createReservationInquiry);

export default router;
