import { db } from "./db.ts";
import argon2 from "argon2";

async function main() {
  console.log("🌱 Admin seed started...");

  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const rawPassword = process.env.ADMIN_PASSWORD || "admin123";

  console.log("🔐 Hashing admin password...");
  const hashedPassword = await argon2.hash(rawPassword);

  console.log("💾 Checking if Admin already exists...");

  // Sahi field mapping (username remove kar diya)
  const existingAdmin = await db.orm.public.User.where({
    email: adminEmail,
  }).first();

  if (!existingAdmin) {
    await db.orm.public.User.create({
      name: "System Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN", // Schema ka Enum value completely match karega
    });
    console.log(`✨ Admin account created successfully: ${adminEmail}`);
  } else {
    console.log("ℹ️ Admin account already exists. Skipping creation.");
  }
}

main()
  .catch((e) => {
    console.error("❌ Error during admin seeding:", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (typeof db.close === "function") {
      await db.close();
    }
    console.log("🏁 Admin seeding finished.");
  });
