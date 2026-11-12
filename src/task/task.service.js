import { db } from "../prisma/db.ts";
export const createTask = async (data) => {
  return db.orm.public.Task.create(data);
};

export const getTaskById = async (id, userId) => {
  // console.log("Service Task ID:", id);

  const task = await db.orm.public.Task.where({ id }).first();

  // console.log("Database Result:", task);

  return task;
};
export const deleteTask = async (id) => {
  return await db.orm.public.Task.where({ id }).delete();
};


export const updateTask = async (id, userId, data, role) => {
  console.log("Data sent to DB:", data);

  if (role === "ADMIN") {
    await db.orm.public.Task.where({ id }).update(data);
  } else {
    await db.orm.public.Task.where({ id, userId }).update(data);
  }

  return await getTaskById(id, userId);
};



export const getAllTask = async (
  role,
  userId,
  completed,
  priority,
  status,
  page1 = 1,
  limit1 = 10,
  order
) => {
  const skip = (page1 - 1) * limit1;

  let task = db.orm.public.Task.include("comments", (comments) =>
    comments.select("content")
  );

  if (role !== "ADMIN") {
    task = task.where({ userId: userId });
  }

  if (completed !== undefined) {
    task = task.where({ completed: completed });
  }

  if (priority !== undefined) {
    task = task.where({ priority: priority });
  }
  if (status !== undefined) {
    // console.log("Test status")
    task = task.where({ status: status });
    // console.log("test status")
  }

  if (order !== undefined) {
    console.log("Test service");
    task = task.orderBy((t) =>
      order === "desc" ? t.priority.desc() : t.priority.asc()
    );

    // console.log("Test service");
  }

  return await task
    .limit(limit1)
    .offset(skip)
    .include("user", (user) => user.select("name", "role", "email"))
    .all();
};

export const checkStatusSummary = async (role, userId) => {
  // console.log("test service ");

  const summary = {
    TODO: 0,
    IN_PROGRESS: 0,
    COMPLETED: 0,
  };

  // console.log("test object");

  let tasks;

  if (role === "ADMIN") {
    tasks = await db.orm.public.Task.all();
  } else {
    tasks = await db.orm.public.Task.where({ userId: userId }).all();
  }

  // console.log("test query ");

  for (let task of tasks) {
    if (task.status == "TODO") {
      summary.TODO++;
    } else if (task.status == "IN_PROGRESS") {
      summary.IN_PROGRESS++;
    } else if (task.status == "COMPLETED") {
      summary.COMPLETED++;
    }
  }

  return summary;
};
