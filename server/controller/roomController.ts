import { type Request, type Response } from "express";
import prisma from "../lib/prisma.ts";
import {
  ROOMS_COLLECTION,
  CLASSIFICATIONS_META,
  CHALET_ADDONS,
  type RoomRecord,
} from "../data/defaultRooms.ts";
import { setCache } from "../lib/redis.ts";

/**
 * GET /rooms - Fetch all rooms from database with filtering, search, and dynamic pricing
 */
export const getAllRooms = async (req: Request, res: Response) => {
  try {
    const { category, maxPrice, guests, sort, place, checkIn, checkOut, hostEmail } = req.query;

    const whereClause: any = {};

    if (hostEmail && typeof hostEmail === "string") {
      whereClause.hostEmail = hostEmail;
    }

    if (category && category !== "all" && typeof category === "string") {
      whereClause.category = category;
    }

    if (maxPrice) {
      whereClause.price = {
        lte: Number(maxPrice),
      };
    }

    if (guests) {
      whereClause.guests = {
        gte: Number(guests),
      };
    }

    let orderByClause: any = { createdAt: "desc" };
    if (sort === "price-asc") {
      orderByClause = { price: "asc" };
    } else if (sort === "price-desc") {
      orderByClause = { price: "desc" };
    } else if (sort === "rating") {
      orderByClause = { rating: "desc" };
    }

    // Query rooms from PostgreSQL
    let dbRooms: any[] = [];
    try {
      dbRooms = await prisma.room.findMany({
        where: whereClause,
        orderBy: orderByClause,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });
    } catch (dbErr: any) {
      console.warn("[Rooms] Database query notice:", dbErr.message);
    }

    let results: RoomRecord[] = [];
    if (dbRooms && dbRooms.length > 0) {
      results = dbRooms.map((r: any) => ({
        id: r.id,
        name: r.name,
        category: r.category as any,
        price: r.price,
        featuredImage: r.featuredImage,
        gallery: r.gallery && r.gallery.length > 0 ? r.gallery : [r.featuredImage],
        size: r.size,
        guests: r.guests,
        bedrooms: r.bedrooms,
        bathrooms: r.bathrooms,
        bed: r.bed,
        tagline: r.tagline,
        description: r.description,
        elevation: r.elevation || "",
        highlights: r.highlights || [],
        status: (r.status as any) || "active",
        rating: r.rating || 5.0,
        reviewsCount: r.reviewsCount || 0,
        amenities: (r.amenities as any) || [],
        policies: (r.policies as any) || { checkIn: "3:00 PM", checkOut: "11:00 AM", cancellation: "Standard cancellation" },
        hostEmail: r.hostEmail,
        hostName: r.hostName,
        reviews: (r.reviews as any) || [],
      }));
    }

    // Filter by destination / search keyword if provided
    if (place && place !== "all" && typeof place === "string") {
      const q = place.toLowerCase().trim();
      results = results.filter((r) => {
        const nameMatch = r.name.toLowerCase().includes(q);
        const taglineMatch = r.tagline.toLowerCase().includes(q);
        const descMatch = r.description.toLowerCase().includes(q);
        const catMatch = r.category.toLowerCase().includes(q);
        return nameMatch || taglineMatch || descMatch || catMatch;
      });
    }

    // Dynamic price calculation based on check-in and check-out dates
    let calculatedNights = 1;
    if (checkIn && checkOut && typeof checkIn === "string" && typeof checkOut === "string") {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      calculatedNights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }

    const payload = results.map((room) => ({
      ...room,
      calculatedNights,
      calculatedTotalPrice: room.price * calculatedNights,
      isAvailable: room.status !== "maintenance",
    }));

    const responseData = {
      success: true,
      count: payload.length,
      nights: calculatedNights,
      data: payload,
    };

    // Cache the result in Redis with 120s TTL
    const cacheKey = `rooms:list:${req.originalUrl || req.url}`;
    setCache(cacheKey, responseData, 120).catch(() => {});

    return res.status(200).json(responseData);
  } catch (error: any) {
    console.error("Error fetching rooms:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching room listings",
      error: error.message,
    });
  }
};

/**
 * GET /rooms/classifications - Get editorial classification taxonomy
 */
export const getClassifications = (_req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    data: Object.values(CLASSIFICATIONS_META),
  });
};

/**
 * GET /rooms/addons - Get available experience addons
 */
export const getAddons = (_req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    data: CHALET_ADDONS,
  });
};

/**
 * GET /rooms/:id - Fetch single room detail by ID
 */
export const getRoomById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    let room: any = null;
    try {
      room = await prisma.room.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });
    } catch {
      // Fall through to memory
    }

    if (!room) {
      return res.status(404).json({
        success: false,
        message: `Sanctuary room with ID '${id}' was not found in the database.`,
      });
    }

    const hostDetails = {
      name: room.hostName || room.user?.name || "Sanctuary Host",
      email: room.hostEmail || room.user?.email || "",
      avatar: "",
      isSuperhost: false,
      verified: true,
      responseRate: "100%",
      responseTime: "Within an hour",
      bio: "Dedicated host providing authentic mountain hospitality, pristine cleanliness, and personalized guest support.",
      languages: ["English"],
    };

    const responseData = {
      success: true,
      data: {
        ...room,
        host: hostDetails,
      },
    };

    // Cache room detail for 300 seconds
    setCache(`rooms:detail:${id}`, responseData, 300).catch(() => {});

    return res.status(200).json(responseData);
  } catch (error: any) {
    console.error("Error fetching room details:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error fetching room details",
    });
  }
};
