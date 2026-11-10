import { db } from "./db.ts";

async function seedCommentsOnly() {
  console.log("🚀 Starting authorization-compliant comments seeding...");

  // 1. Fetch all tasks, users, and find the admin account
  const allTasks = await db.orm.public.Task.all();
  const allUsers = await db.orm.public.User.all();
  const adminUser = await db.orm.public.User.where({ role: "ADMIN" }).first();

  if (allTasks.length === 0 || allUsers.length === 0) {
    console.error("❌ Error: Seeding failed! Tasks or Users table is empty.");
    return;
  }

  // 2. Clear out any existing comments using a clean workaround
  console.log("🧹 Cleaning up existing comments...");
  try {
    const oldComments = await db.orm.public.Comment.all();
    for (const comment of oldComments) {
      // Agar delete implementation strict instance parameter manti hai toh poora object pass karein
      await db.orm.public.Comment.delete(comment); 
    }
  } catch (deleteError) {
    console.log("ℹ Fallback batch delete strategy configuration running...");
    // Alternate strategy: condition apply karke filter clean karein
    await db.orm.public.Comment.where({}).delete();
  }

  let totalCommentsCreated = 0;
  console.log(`📝 Total Tasks Found: ${allTasks.length}. Seeding rule-accurate comments...`);

  for (const task of allTasks) {
    const taskOwner = allUsers.find((u) => u.id === task.userId);

    if (!taskOwner) {
      console.warn(`⚠️ Warning: Task ID ${task.id} has no valid owner user. Skipping...`);
      continue;
    }

    const taskComments = [];

    // RULE 1: User can only add & view comments on their OWN tasks
    taskComments.push({
      content: `I am working on my assigned task: "${task.title}". Requirements look clear.`,
      taskId: task.id,
      userId: taskOwner.id, 
    });

    taskComments.push({
      content: `Update: Making great progress here. Ready for review soon.`,
      taskId: task.id,
      userId: taskOwner.id, 
    });

    // RULE 2: ADMIN can view, add, and delete comments on ANY task
    if (adminUser) {
      taskComments.push({
        content: `[Admin Review] Looks well tracked. Please complete this on time.`,
        taskId: task.id,
        userId: adminUser.id, 
      });
    }

    // Insert all structured valid comments for this task into the DB
    for (const commentData of taskComments) {
      await db.orm.public.Comment.create(commentData);
      totalCommentsCreated++;
    }
  }

  console.log(
    `✅ Success! Total ${totalCommentsCreated} comments generated successfully following exact business logic routing.`
  );
}

seedCommentsOnly()
  .catch((e) => {
    console.error("❌ Error during comments seeding:", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (typeof db.close === "function") {
      await db.close();
    }
  });
