import { db } from "./db.ts";

async function main() {
  console.log("Seed started");

  for (let i = 1; i <= 50; i++) {
    const data = {
      title: `Task Title ${i}`,
      description: `This is a description for task number ${i}`,
      completed: i % 2 === 0,
    };

    await db.orm.public.Task.create(data);
    console.log(`Data inserted successfully ${i}`);
  }
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (typeof db.close === "function") {
      await db.close();
    }
  });
