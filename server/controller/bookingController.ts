import { type Request, type Response } from "express";
import crypto from "crypto";
import prisma from "../lib/prisma.ts";
import { invalidateCachePattern } from "../lib/redis.ts";
import { razorpay } from "../util/PaymentGateway.ts";

/**
 * POST /rooms/:id/create-order - Initialize Razorpay Order
 */
export const createPaymentOrder = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { amount, currency = "INR" } = req.body;

    const room = await prisma.room.findUnique({ where: { id } });
    if (!room) {
      return res.status(404).json({ success: false, message: `Room with ID '${id}' was not found.` });
    }

    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      return res.status(400).json({ success: false, message: "Valid amount is required to create order." });
    }

    // Razorpay amount in smallest currency subunit (e.g. paise / cents)
    const amountInSubunits = Math.round(numericAmount * 100);

    const order = await razorpay.orders.create({
      amount: amountInSubunits,
      currency: currency || "INR",
      receipt: `chs_${Date.now().toString().slice(-8)}`,
      notes: {
        roomId: id,
        roomName: room.name,
      },
    });

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_API_KEY || "rzp_test_Tb88mvkOpORfnP",
    });
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create Razorpay order",
    });
  }
};

export const bookRoom = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const {
      guestName,
      guestEmail,
      checkIn,
      checkOut,
      guests,
      totalPrice,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = req.body;

    const room = await prisma.room.findUnique({ where: { id } });
    if (!room) {
      return res.status(404).json({ success: false, message: `Room with ID '${id}' was not found.` });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid check-in or check-out date format." });
    }
    if (checkOutDate <= checkInDate) {
      return res.status(400).json({ success: false, message: "Check-out date must be after check-in date." });
    }

    const conflict = await prisma.booking.findFirst({
      where: {
        roomId: id,
        status: { in: ["confirmed", "active", "CONFIRMED"] },
        AND: [
          { checkIn: { lt: checkOut } },
          { checkOut: { gt: checkIn } },
        ],
      },
    });

    if (conflict) {
      return res.status(409).json({
        success: false,
        message: `This suite is already reserved for dates overlapping ${conflict.checkIn} to ${conflict.checkOut}. Please select alternative dates.`,
      });
    }

    const userId = req.user?.id || null;

    const booking = await prisma.booking.create({
      data: {
        roomId: id,
        userId,
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim(),
        checkIn,
        checkOut,
        totalPrice: Number(totalPrice),
        status: "confirmed",
        payoutStatus: "Paid",
      },
      include: {
        room: {
          select: {
            name: true,
            featuredImage: true,
            category: true,
          },
        },
      },
    });

    await invalidateCachePattern("rooms:*");

    return res.status(201).json({
      success: true,
      message: "Reservation confirmed successfully.",
      data: {
        id: booking.id,
        confirmationNumber: booking.id,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        totalPrice: booking.totalPrice,
        status: booking.status,
        paymentId: razorpayPaymentId || `pay_${booking.id.replace(/-/g, "").slice(0, 14)}`,
        room: booking.room,
        guestName: booking.guestName,
        guestEmail: booking.guestEmail,
      },
    });
  } catch (error: any) {
    console.error("Error creating booking:", error);
    return res.status(500).json({ success: false, message: "Error confirming reservation in database" });
  }
};

export const getMyBookings = async (req: Request, res: Response) => {
  try {
    const userIdentifier = req.user?.id;
    const userEmail = req.user?.email;

    if (!userIdentifier && !userEmail) {
      return res.status(401).json({ success: false, message: "Authentication required to view reservations." });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        OR: [
          ...(userIdentifier ? [{ userId: userIdentifier }] : []),
          ...(userEmail ? [{ guestEmail: userEmail }] : []),
        ],
      },
      include: {
        room: {
          select: {
            id: true,
            name: true,
            featuredImage: true,
            category: true,
            price: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error: any) {
    console.error("Error fetching guest bookings:", error);
    return res.status(500).json({ success: false, message: "Error retrieving reservations" });
  }
};
