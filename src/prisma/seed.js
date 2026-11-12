// import { db } from "./db.ts";
// import argon2 from "argon2";

// async function main() {
//   console.log(" Seed started...");

  
//   const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
//   const rawPassword = process.env.ADMIN_PASSWORD || "admin123";

//   console.log("Hashing admin password...");
//   const hashedPassword = await argon2.hash(rawPassword);

//   console.log(" Checking if Admin already exists...");
//   const existingAdmin = await db.orm.public.User.where({
//     email: adminEmail,
//   }).first();

//   if (!existingAdmin) {
//     await db.orm.public.User.create({
//       name: "System Admin",
//       email: adminEmail,
//       password: hashedPassword,
//       role: "ADMIN",
//     });
//     console.log("Admin user seeded successfully!");
//   } else {
//     console.log("ℹ Admin user already exists, skipping...");
//   }

//   // 2. Regular Users & 100 Tasks Seed
//   console.log(" Seeding regular users and 100 tasks...");

//   const userPassword = await argon2.hash("user123");
//   const totalTasks = 100;
//   const tasksPerUser = 10; // Splitting 100 tasks among 10 distinct users
//   const totalUsers = totalTasks / tasksPerUser;

//   for (let u = 1; u <= totalUsers; u++) {
//     const userEmail = `user${u}@example.com`;

//     // Check if user already exists or create them
//     let user = await db.orm.public.User.where({ email: userEmail }).first();

//     if (!user) {
//       user = await db.orm.public.User.create({
//         name: `Regular User ${u}`,
//         email: userEmail,
//         password: userPassword,
//         role: "USER", // Explicitly user, not admin
//       });
//       console.log(`👤 Created user: ${userEmail}`);
//     }

//     // Generate tasks for this user
//     console.log(` Creating ${tasksPerUser} tasks for ${userEmail}...`);
//     for (let t = 1; t <= tasksPerUser; t++) {
//       const globalTaskIndex = (u - 1) * tasksPerUser + t;

//       await db.orm.public.Task.create({
//         title: `Task Title ${globalTaskIndex}`,
//         description: `This is a description for task number ${globalTaskIndex} assigned to ${userEmail}`,
//         completed: globalTaskIndex % 2 === 0,
//         userId: user.id, // Foreign key link
//       });
//     }
//   }

//   console.log(` Successfully seeded admin, users, and ${totalTasks} tasks!`);
// }

// main()
//   .catch((e) => {
//     console.error(" Error during seeding:", e);
//     process.exitCode = 1;
//   })
//   .finally(async () => {
//     if (typeof db.close === "function") {
//       await db.close();
//     }
//   });



import { db } from "./db.ts";
import argon2 from "argon2";

const USER_COUNT = 60;
const TASK_COUNT = 120;
const COMMENTS_PER_TASK = 3;

const firstNames = [
  "Ava", "Noah", "Mila", "Liam", "Sophia", "Ethan", "Isla", "Lucas",
  "Emma", "Mason", "Olivia", "James", "Amelia", "Benjamin", "Charlotte",
  "Henry", "Harper", "Leo", "Evelyn", "Daniel", "Scarlett", "Jack", "Chloe",
  "Mateo", "Layla", "Owen", "Nora", "Gabriel", "Luna", "Wyatt", "Aria",
  "Julian", "Ella", "Leo", "Hazel", "Isaac", "Maya", "Nathan", "Stella",
  "Elijah", "Aurora", "Hudson", "Paisley", "Samuel", "Nova", "Adrian", "Ruby",
  "Thomas", "Ivy", "David", "Leah", "Joseph", "Ariana", "Carter", "Vivian",
  "John", "Claire", "Luke", "Savannah", "Ryan", "Skyler", "Anthony", "Penelope"
];

const taskTitles = [
  "Set up project sprint board",
  "Fix login validation bug",
  "Prepare deployment checklist",
  "Review API performance",
  "Write unit tests for user service",
  "Update dashboard metrics",
  "Refactor user profile module",
  "Improve error logging",
  "Create onboarding flow",
  "Document API endpoints",
  "Add notifications for comments",
  "Optimize database queries",
  "Fix mobile layout issue",
  "Add search filters",
  "Create admin reporting page",
  "Migrate legacy data",
  "Review CI pipeline failures",
  "Add role-based access checks",
  "Resolve task assignment bug",
  "Update email templates",
  "Add task reminders",
  "Integrate payment webhook",
  "Improve accessibility labels",
  "Add bulk delete action",
  "Audit security headers",
  "Patch dependency vulnerabilities",
  "Design audit logs",
  "Refactor task cards",
  "Create release note draft",
  "Add sorting to task table",
  "Fix null pointer in dashboard",
  "Prepare QA test cases",
  "Improve cache invalidation",
  "Add project activity feed",
  "Create data export feature",
  "Review feature flag rollout",
  "Update user settings page",
  "Investigate slow report generation",
  "Add task status timeline",
  "Implement search indexing",
  "Improve dead-letter monitoring",
  "Tune query for high-volume data",
  "Create progress summary email",
  "Validate migration rollback plan",
  "Fix stale session handling",
  "Add support for markdown comments",
  "Review data retention policy",
  "Add new dashboard widgets",
  "Improve upload validation",
  "Refine analytics permissions",
  "Add workflow automation rules",
  "Reduce bundle size",
  "Update UI design tokens",
  "Resolve duplicate task creation",
  "Add API request tracing",
  "Prepare release candidate",
  "Coordinated bug triage session",
  "Fix cron job timeout",
  "Add backup verification check",
  "Implement data cleanup routine",
  "Monitor rate-limit usage"
];

const commentBodies = [
  "I reviewed this and the fix is aligned with the current workflow.",
  "Could we add a quick validation before moving this to done?",
  "This looks good. I would also consider improving the edge case coverage.",
  "Need a second opinion on the final implementation details.",
  "I’ve discussed this with the team and the approach looks solid.",
  "Please update the task notes with the latest status before closing.",
  "This is a good candidate for follow-up automation.",
  "The bug pattern is clear now; we should document it for future reference.",
  "I agree with the scope; we can keep it focused and low-risk.",
  "The implementation seems consistent with the design standards.",
  "I left a note in the ticket to track this until completion.",
  "This should be verified in staging before shipping to production.",
  "I think the solution is correct, but we need to confirm the edge case.",
  "The task is progressing well; we just need to finalize the QA pass.",
  "I’ve shared the latest update internally and the team is aligned."
];

function randomFrom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getRole(index) {
  return index % 5 === 0 ? "ADMIN" : "USER";
}

function getPriority(index) {
  const values = ["LOW", "MEDIUM", "HIGH"];
  return values[index % values.length];
}

function getStatus(index) {
  const values = ["TODO", "IN_PROGRESS", "COMPLETED"];
  return values[index % values.length];
}

async function main() {
  // Delete existing data in relationship order
  await db.orm.public.Comment.where({}).deleteAll();
  await db.orm.public.Task.where({}).deleteAll();
  await db.orm.public.User.where({}).deleteAll();

  const passwordHash = await argon2.hash("Password123");

  const users = [];

  for (let index = 0; index < USER_COUNT; index++) {
    const firstName = randomFrom(firstNames);
    const lastName = `User${index + 1}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;

    const user = await db.orm.public.User.create({
      name: `${firstName} ${lastName}`,
      email,
      password: passwordHash,
      role: getRole(index),
      isActive: index % 8 !== 0,
    });

    users.push(user);
  }

  const tasks = [];

  for (let index = 0; index < TASK_COUNT; index++) {
    const assignee = users[index % users.length];

    const task = await db.orm.public.Task.create({
      title: `${taskTitles[index % taskTitles.length]} #${index + 1}`,
      description: `This task is assigned to ${assignee.name}. It covers the current sprint item and should be completed within the planned delivery window.`,
      userId: assignee.id,
      priority: getPriority(index),
      status: getStatus(index),
      completed: index % 4 === 0,
    });

    tasks.push(task);
  }

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];

    for (let commentIndex = 0; commentIndex < COMMENTS_PER_TASK; commentIndex++) {
      const commenter = users[(i + commentIndex + 1) % users.length];

      await db.orm.public.Comment.create({
        content: `${commentBodies[(i + commentIndex) % commentBodies.length]} (Task ${i + 1}, comment ${commentIndex + 1})`,
        taskId: task.id,
        userId: commenter.id,
      });
    }
  }

  const totalUsers = (await db.orm.public.User.where({}).all()).length;
  const totalTasks = (await db.orm.public.Task.where({}).all()).length;
  const totalComments = (await db.orm.public.Comment.where({}).all()).length;

  console.log("Seed complete.");
  console.log(`Users: ${totalUsers}`);
  console.log(`Tasks: ${totalTasks}`);
  console.log(`Comments: ${totalComments}`);
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
