import { type Request, type Response } from "express";
import prisma from "../lib/prisma.ts";
import { invalidateCachePattern } from "../lib/redis.ts";

/**
 * POST /rooms/host/new - Create a new luxury room listing associated directly with the authenticated Host ID
 */
export const createHostListing = async (req: Request, res: Response) => {
  try {
    const {
      name,
      category,
      price,
      size,
      guests,
      bedrooms,
      bathrooms,
      bed,
      tagline,
      description,
      featuredImage,
      gallery,
      amenities,
      policies,
    } = req.body;

    // Authenticated Host User ID from JWT Token
    const authenticatedUserId = req.user?.id;
    if (!authenticatedUserId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Host authentication token missing.",
      });
    }

    // Retrieve verified host details from PostgreSQL
    const hostUser = await prisma.user.findUnique({
      where: { id: authenticatedUserId },
    });

    if (!hostUser) {
      return res.status(404).json({
        success: false,
        message: "Host user account not found in database.",
      });
    }

    // Standardized slug ID
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const newId = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    // Persist room in PostgreSQL DB strictly using submitted data and authenticated host info
    const newRoom = await prisma.room.create({
      data: {
        id: newId,
        name: name.trim(),
        category: category,
        price: Number(price),
        featuredImage: featuredImage.trim(),
        gallery: gallery && Array.isArray(gallery) && gallery.length > 0 ? gallery : [featuredImage.trim()],
        size: size ? size.trim() : "",
        guests: Number(guests),
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        bed: bed ? bed.trim() : "",
        tagline: tagline ? tagline.trim() : "",
        description: description ? description.trim() : "",
        elevation: req.body.elevation || "",
        highlights: req.body.highlights || [],
        status: "active",
        amenities: amenities || [],
        policies: policies || {
          checkIn: "3:00 PM",
          checkOut: "11:00 AM",
          cancellation: "Standard cancellation policy applies.",
        },
        hostEmail: hostUser.email,
        hostName: hostUser.name,
        userId: hostUser.id,
        rating: 5.0,
        reviewsCount: 0,
        reviews: [],
      },
    });

    // Invalidate Redis cache for rooms so new listing shows up instantly
    await invalidateCachePattern("rooms:*");

    return res.status(201).json({
      success: true,
      message: "New sanctuary listing successfully published and linked to your Host ID.",
      data: newRoom,
    });
  } catch (error: any) {
    console.error("Error creating host listing in DB:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error creating listing in database.",
      error: error.message,
    });
  }
};

/**
 * PATCH /rooms/:id/status - Toggle room between active and maintenance status
 */
export const toggleRoomStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;

    const existing = await prisma.room.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: `Room '${id}' not found.` });
    }

    const nextStatus =
      status && ["active", "maintenance", "inactive"].includes(status)
        ? status
        : existing.status === "maintenance"
        ? "active"
        : "maintenance";

    const updated = await prisma.room.update({
      where: { id },
      data: { status: nextStatus },
    });

    // Invalidate Redis cache
    await invalidateCachePattern("rooms:*");

    return res.status(200).json({
      success: true,
      message: `Room status updated to ${updated.status}`,
      data: {
        id: updated.id,
        name: updated.name,
        status: updated.status,
      },
    });
  } catch (error: any) {
    console.error("Error toggling room status:", error);
    return res.status(500).json({ success: false, message: "Error updating room status in database" });
  }
};

/**
 * GET /rooms/host/metrics - Retrieve host analytics & financial KPI metrics
 */
export const getHostMetrics = async (req: Request, res: Response) => {
  try {
    const hostEmail = (req.query.hostEmail as string) || req.user?.email;
    const roomWhere: any = hostEmail ? { hostEmail } : {};
    const inquiryWhere: any = hostEmail ? { hostEmail, status: "pending" } : { status: "pending" };

    const [rooms, bookings, inquiries] = await Promise.all([
      prisma.room.findMany({ where: roomWhere }).catch(() => []),
      prisma.booking.findMany().catch(() => []),
      prisma.inquiry.findMany({ where: inquiryWhere }).catch(() => []),
    ]);

    const activeListings = rooms.filter((r) => r.status === "active").length;
    const totalEarnings = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const totalReviews = rooms.reduce((sum, r) => sum + (r.reviewsCount || 0), 0);
    const avgRating =
      rooms.length > 0
        ? Number((rooms.reduce((sum, r) => sum + (r.rating || 5.0), 0) / rooms.length).toFixed(2))
        : 5.0;
    const occupancyRate =
      rooms.length > 0
        ? Number(Math.min(100, (bookings.length / rooms.length) * 100).toFixed(1))
        : 0;

    return res.status(200).json({
      success: true,
      data: {
        totalEarnings,
        occupancyRate,
        totalListings: rooms.length,
        activeListings,
        totalReviews,
        averageRating: avgRating,
        pendingInquiries: inquiries.length,
      },
    });
  } catch (error: any) {
    console.error("Error fetching host metrics:", error);
    return res.status(500).json({ success: false, message: "Error calculating host metrics" });
  }
};

/**
 * GET /rooms/host/tasks - Get operational management tasks
 */
export const getHostTasks = async (req: Request, res: Response) => {
  try {
    const hostEmail = (req.query.hostEmail as string) || req.user?.email;
    const tasks = await prisma.task.findMany({
      where: hostEmail ? { hostEmail } : {},
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({ success: true, data: tasks });
  } catch (error: any) {
    console.error("Error fetching host tasks:", error);
    return res.status(500).json({ success: false, message: "Error retrieving operational tasks" });
  }
};

/**
 * POST /rooms/host/tasks - Create a new operational management task
 */
export const createHostTask = async (req: Request, res: Response) => {
  try {
    const { title, suite, due, priority } = req.body;
    const hostEmail = req.user?.email || (req.body.hostEmail as string) || "";
    const userId = req.user?.id || null;

    const task = await prisma.task.create({
      data: {
        title,
        suite: suite || "Concierge",
        due: due || "Today",
        priority: priority || "medium",
        completed: false,
        hostEmail,
        userId,
      },
    });

    return res.status(201).json({ success: true, data: task });
  } catch (error: any) {
    console.error("Error creating host task:", error);
    return res.status(500).json({ success: false, message: "Error creating task in database" });
  }
};

/**
 * PATCH /rooms/host/tasks/:id - Update operational task completion status
 */
export const updateHostTask = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { completed } = req.body;

    const updated = await prisma.task.update({
      where: { id },
      data: { completed: Boolean(completed) },
    });

    return res.status(200).json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Error updating host task:", error);
    return res.status(500).json({ success: false, message: "Error updating task status" });
  }
};

/**
 * GET /rooms/host/queries - Retrieve guest inquiries
 */
export const getHostQueries = async (req: Request, res: Response) => {
  try {
    const hostEmail = (req.query.hostEmail as string) || req.user?.email;
    const queries = await prisma.inquiry.findMany({
      where: hostEmail ? { hostEmail } : {},
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({ success: true, data: queries });
  } catch (error: any) {
    console.error("Error fetching guest inquiries:", error);
    return res.status(500).json({ success: false, message: "Error fetching guest inquiries" });
  }
};

/**
 * POST /rooms/host/queries/:id/reply - Send reply to a guest inquiry
 */
export const replyHostQuery = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { reply } = req.body;

    const updated = await prisma.inquiry.update({
      where: { id },
      data: {
        reply,
        status: "resolved",
      },
    });

    return res.status(200).json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Error replying to inquiry:", error);
    return res.status(500).json({ success: false, message: "Error replying to guest inquiry" });
  }
};

/**
 * GET /rooms/host/bookings - Retrieve bookings for the host
 */
export const getHostBookings = async (_req: Request, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        room: {
          select: {
            name: true,
            featuredImage: true,
          },
        },
      },
    });
    return res.status(200).json({ success: true, data: bookings });
  } catch (error: any) {
    console.error("Error fetching bookings:", error);
    return res.status(500).json({ success: false, message: "Error retrieving host bookings" });
  }
};
