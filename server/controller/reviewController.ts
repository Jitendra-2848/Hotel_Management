import { type Request, type Response } from "express";
import prisma from "../lib/prisma.ts";
import { invalidateCachePattern } from "../lib/redis.ts";

/**
 * POST /rooms/:id/reviews - Add a guest review for a sanctuary room
 */
export const addRoomReview = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { author, rating, comment } = req.body;

    const room = await prisma.room.findUnique({ where: { id } });
    if (!room) {
      return res.status(404).json({ success: false, message: `Room with ID '${id}' not found.` });
    }

    const newReview = {
      id: `rev-${Date.now()}`,
      author,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      rating: Number(rating) || 5,
      comment,
    };

    const currentReviews = (room.reviews as any[]) || [];
    const updatedReviews = [newReview, ...currentReviews];
    const totalRating = updatedReviews.reduce((sum, r) => sum + (r.rating || 5), 0);
    const newAverageRating = Number((totalRating / updatedReviews.length).toFixed(2));

    const updatedRoom = await prisma.room.update({
      where: { id },
      data: {
        reviews: updatedReviews,
        rating: newAverageRating,
        reviewsCount: updatedReviews.length,
      },
    });

    // Invalidate Redis cache for room
    await invalidateCachePattern("rooms:*");

    return res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: {
        reviews: updatedRoom.reviews,
        rating: updatedRoom.rating,
        reviewsCount: updatedRoom.reviewsCount,
      },
    });
  } catch (error: any) {
    console.error("Error adding room review:", error);
    return res.status(500).json({ success: false, message: "Error submitting review to database" });
  }
};
