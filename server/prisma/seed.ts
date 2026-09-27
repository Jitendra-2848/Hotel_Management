import "dotenv/config";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.ts";
import { ALL_58_ROOMS as ROOMS_COLLECTION } from "./seed58Rooms.ts";

async function main() {
  console.log("Seeding database with rooms under host Jitendra Prajapati...");

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

  console.log(`Host User active in DB: ${adminUser.email} (ID: ${adminUser.id})`);

  // 2. Seed All Rooms to PostgreSQL Database
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

  console.log(`Successfully seeded ${roomCount} rooms to PostgreSQL database.`);
}

main()
  .catch((e) => {
    console.error("Error seeding DB:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
