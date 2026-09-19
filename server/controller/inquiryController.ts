import { type Request, type Response } from "express";
import prisma from "../lib/prisma.ts";

/**
 * POST /rooms/:id/reserve - Create a reservation inquiry for a room
 */
export const createReservationInquiry = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const {
      guestName,
      name,
      guestEmail,
      email,
      checkIn,
      checkOut,
      guests,
      specialRequests,
      selectedAddons,
      totalAmount,
    } = req.body;

    const room = await prisma.room.findUnique({ where: { id } });
    if (!room) {
      return res.status(404).json({ success: false, message: `Room with ID '${id}' not found.` });
    }

    const effectiveGuestName = guestName || name || "Valued Guest";
    const effectiveGuestEmail = guestEmail || email || "guest@example.com";

    const inquiry = await prisma.inquiry.create({
      data: {
        guestName: effectiveGuestName,
        guestEmail: effectiveGuestEmail,
        roomName: room.name,
        message: `Reservation Inquiry for ${room.name} from ${checkIn} to ${checkOut} (${guests} guests). ${
          selectedAddons?.length ? "Addons: " + selectedAddons.join(", ") + ". " : ""
        }${specialRequests ? "Special Requests: " + specialRequests : ""}`.trim(),
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        status: "pending",
        hostEmail: room.hostEmail,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Reservation inquiry submitted successfully. The host has been notified.",
      data: {
        inquiryId: inquiry.id,
        roomName: room.name,
        totalAmount,
      },
    });
  } catch (error: any) {
    console.error("Error creating reservation inquiry:", error);
    return res.status(500).json({ success: false, message: "Error submitting reservation inquiry" });
  }
};
