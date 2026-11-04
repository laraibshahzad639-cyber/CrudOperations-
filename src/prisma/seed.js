import { db } from "./db.ts";
import argon2 from "argon2";

async function main() {
  console.log(" Seed started...");

  // 1. Admin Seed
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const rawPassword = process.env.ADMIN_PASSWORD || "admin123";

  console.log("Hashing admin password...");
  const hashedPassword = await argon2.hash(rawPassword);

  console.log(" Checking if Admin already exists...");
  const existingAdmin = await db.orm.public.User.where({
    email: adminEmail,
  }).first();

  if (!existingAdmin) {
    await db.orm.public.User.create({
      name: "System Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
    });
    console.log("Admin user seeded successfully!");
  } else {
    console.log("ℹ Admin user already exists, skipping...");
  }

  // 2. Regular Users & 100 Tasks Seed
  console.log(" Seeding regular users and 100 tasks...");

  const userPassword = await argon2.hash("user123");
  const totalTasks = 100;
  const tasksPerUser = 10; // Splitting 100 tasks among 10 distinct users
  const totalUsers = totalTasks / tasksPerUser;

  for (let u = 1; u <= totalUsers; u++) {
    const userEmail = `user${u}@example.com`;

    // Check if user already exists or create them
    let user = await db.orm.public.User.where({ email: userEmail }).first();

    if (!user) {
      user = await db.orm.public.User.create({
        name: `Regular User ${u}`,
        email: userEmail,
        password: userPassword,
        role: "USER", // Explicitly user, not admin
      });
      console.log(`👤 Created user: ${userEmail}`);
    }

    // Generate tasks for this user
    console.log(` Creating ${tasksPerUser} tasks for ${userEmail}...`);
    for (let t = 1; t <= tasksPerUser; t++) {
      const globalTaskIndex = (u - 1) * tasksPerUser + t;

      await db.orm.public.Task.create({
        title: `Task Title ${globalTaskIndex}`,
        description: `This is a description for task number ${globalTaskIndex} assigned to ${userEmail}`,
        completed: globalTaskIndex % 2 === 0,
        userId: user.id, // Foreign key link
      });
    }
  }

  console.log(` Successfully seeded admin, users, and ${totalTasks} tasks!`);
}

main()
  .catch((e) => {
    console.error(" Error during seeding:", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (typeof db.close === "function") {
      await db.close();
    }
  });
