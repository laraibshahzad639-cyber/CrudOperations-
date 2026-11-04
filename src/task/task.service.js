import { db } from "../prisma/db.ts";
export const createTask = async (data) => {
  return db.orm.public.Task.create(data);
};

export const getTaskById = async (id,  userId  ) => {
  return db.orm.public.Task.where({id,userId:userId}).first();
};
export const deleteTask = async (id) => {
  return db.orm.public.Task.where({ id }).delete();
};
export const updateTask = async (id, userId,data) => {
  return db.orm.public.Task.where({ id ,userId:userId}).update(data);
};
export const getAllTask = async ( role,userId,completed,page1 = 1,limit1 = 10,order) => {

  if (order !== undefined || completed !== undefined || page1 || limit1) {

    const skip = (page1 - 1) * limit1;

    let task = db.orm.public.Task.limit(limit1).offset(skip)
if (role !== "ADMIN") {
  task = task.where({ userId: userId });
}

    if (completed !== undefined) {
      task = task.where({ completed: completed });
    }

    if (order !== undefined) {
      task = task.orderBy({ createdAt: order });
    }

    return await task
      .include("user", (user) => user.select("name", "role", "email"))
      .all();
  }
};