import "dotenv/config";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.ts";
import { ROOMS_COLLECTION } from "../controller/Rooms.ts";

async function main() {
  console.log("Starting database seed with Jitendra's profile as host...");

  const adminEmail = "prajapatijitendra2848@gmail.com";
  const hashedPassword = await bcrypt.hash("123456", 10);

  // 1. Upsert Admin Profile
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "Jitendra Prajapati",
      password: hashedPassword,
      role: "MANAGER",
    },
    create: {
      name: "Jitendra Prajapati",
      email: adminEmail,
      password: hashedPassword,
      role: "MANAGER",
    },
  });

  console.log(`Host User active in DB: ${adminUser.email} (ID: ${adminUser.id}, Role: ${adminUser.role})`);

  // 2. Seed All Rooms with Host as Jitendra Prajapati
  let roomCount = 0;
  for (const r of ROOMS_COLLECTION) {
    await prisma.room.upsert({
      where: { id: r.id },
      update: {
        name: r.name,
        category: r.category,
        price: r.price,
        featuredImage: r.featuredImage,
        gallery: r.gallery,
        size: r.size,
        guests: r.guests,
        bedrooms: r.bedrooms,
        bathrooms: r.bathrooms,
        bed: r.bed,
        tagline: r.tagline,
        description: r.description,
        elevation: r.elevation || "",
        highlights: r.highlights || [],
        status: r.status || "active",
        rating: r.rating || 5.0,
        reviewsCount: r.reviewsCount || 1,
        amenities: r.amenities,
        policies: r.policies,
        hostEmail: adminEmail,
        hostName: "Jitendra Prajapati",
        userId: adminUser.id,
        reviews: (r.reviews as any) || [],
      },
      create: {
        id: r.id,
        name: r.name,
        category: r.category,
        price: r.price,
        featuredImage: r.featuredImage,
        gallery: r.gallery,
        size: r.size,
        guests: r.guests,
        bedrooms: r.bedrooms,
        bathrooms: r.bathrooms,
        bed: r.bed,
        tagline: r.tagline,
        description: r.description,
        elevation: r.elevation || "",
        highlights: r.highlights || [],
        status: r.status || "active",
        rating: r.rating || 5.0,
        reviewsCount: r.reviewsCount || 1,
        amenities: r.amenities,
        policies: r.policies,
        hostEmail: adminEmail,
        hostName: "Jitendra Prajapati",
        userId: adminUser.id,
        reviews: (r.reviews as any) || [],
      },
    });
    roomCount++;
  }

  console.log(`Successfully migrated and persisted ${roomCount} suites to PostgreSQL DB under ${adminEmail}`);

  // 3. Seed Initial Bookings
  const initialBookings = [
    {
      id: "BK-8821",
      roomId: "aframe",
      guestName: "Emma Watson",
      guestEmail: "emma.w@example.com",
      checkIn: "2026-10-12",
      checkOut: "2026-10-16",
      totalPrice: 1960,
      status: "confirmed",
      payoutStatus: "Paid",
      userId: adminUser.id,
    },
    {
      id: "BK-8822",
      roomId: "glacier",
      guestName: "Marcus Vance",
      guestEmail: "m.vance@venture.io",
      checkIn: "2026-10-14",
      checkOut: "2026-10-18",
      totalPrice: 2720,
      status: "confirmed",
      payoutStatus: "Processing",
      userId: adminUser.id,
    },
    {
      id: "BK-8823",
      roomId: "summit",
      guestName: "Elena Rostova",
      guestEmail: "elena@rostova.design",
      checkIn: "2026-10-18",
      checkOut: "2026-10-22",
      totalPrice: 2080,
      status: "confirmed",
      payoutStatus: "Paid",
      userId: adminUser.id,
    },
    {
      id: "BK-8824",
      roomId: "alpine",
      guestName: "David Sterling",
      guestEmail: "david.s@sterling.co",
      checkIn: "2026-10-20",
      checkOut: "2026-10-26",
      totalPrice: 5100,
      status: "confirmed",
      payoutStatus: "Pending",
      userId: adminUser.id,
    },
  ];

  for (const b of initialBookings) {
    await prisma.booking.upsert({
      where: { id: b.id },
      update: b,
      create: b,
    });
  }
  console.log(`Seeded ${initialBookings.length} bookings into DB.`);

  // 4. Seed Initial Operational Tasks
  const initialTasks = [
    {
      id: "tsk-1",
      title: "Inspect Cedar Hot Tub sanitization & heating unit",
      suite: "Architectural A-Frame",
      priority: "urgent",
      due: "Today, 4:00 PM",
      completed: false,
      hostEmail: adminEmail,
      userId: adminUser.id,
    },
    {
      id: "tsk-2",
      title: "Restock complimentary pinon firewood & artisan marshmallows",
      suite: "Nordic Haven Cabin",
      priority: "medium",
      due: "Tomorrow, 11:00 AM",
      completed: false,
      hostEmail: adminEmail,
      userId: adminUser.id,
    },
    {
      id: "tsk-3",
      title: "Confirm early baggage dropoff & VIP sommelier greeting",
      suite: "Glacier Ridge Panorama",
      priority: "urgent",
      due: "Oct 20, 2:00 PM",
      completed: false,
      hostEmail: adminEmail,
      userId: adminUser.id,
    },
    {
      id: "tsk-4",
      title: "Replace outdoor sauna stone elements & cedar towel warmer",
      suite: "Celestial Dome Sanctuary",
      priority: "low",
      due: "Oct 22, 6:00 PM",
      completed: true,
      hostEmail: adminEmail,
      userId: adminUser.id,
    },
  ];

  for (const t of initialTasks) {
    await prisma.task.upsert({
      where: { id: t.id },
      update: t,
      create: t,
    });
  }
  console.log(`Seeded ${initialTasks.length} operational tasks into DB.`);

  // 5. Seed Guest Inquiries
  const initialInquiries = [
    {
      id: "qry-1",
      guestName: "Claire Bennett",
      guestEmail: "claire.b@luxurytravel.com",
      roomName: "Architectural A-Frame Chalet",
      message: "Is early check-in at 1:00 PM possible for our anniversary stay?",
      date: "Oct 18, 2026",
      status: "pending",
      hostEmail: adminEmail,
    },
    {
      id: "qry-2",
      guestName: "Liam Hemsworth",
      guestEmail: "liam.h@hollywood.org",
      roomName: "Glacier Ridge Panorama Suite",
      message: "Can we request the private culinary chef experience on Friday evening?",
      date: "Oct 17, 2026",
      status: "pending",
      hostEmail: adminEmail,
    },
  ];

  for (const q of initialInquiries) {
    await prisma.inquiry.upsert({
      where: { id: q.id },
      update: q,
      create: q,
    });
  }
  console.log(`Seeded ${initialInquiries.length} inquiries into DB.`);
  console.log("Database successfully seeded!");
}

main()
  .catch((e) => {
    console.error("Error seeding DB:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
