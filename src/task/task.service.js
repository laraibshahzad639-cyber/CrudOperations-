import { db } from "../prisma/db.ts";
export const createTask = async (data) => {
  return db.orm.public.Task.create(data);
};

export const getTaskById = async (id, userId) => {
  return db.orm.public.Task.where({ id, userId: userId }).first();
};
export const deleteTask = async (id) => {
  return db.orm.public.Task.where({ id }).delete();
};
export const updateTask = async (id, userId, data) => {
  return db.orm.public.Task.where({ id, userId: userId }).update(data);
};

export const getAllTask = async (
  role,
  userId,
  completed,
  priority,
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

  if (order !== undefined) {
    console.log("Test service");
    task = task.orderBy((t) =>
      order === "desc" ? t.priority.desc() : t.priority.asc()
    );

    console.log("Test service");
  }

  return await task
    .limit(limit1)
    .offset(skip)
    .include("user", (user) => user.select("name", "role", "email"))
    .all();
};
