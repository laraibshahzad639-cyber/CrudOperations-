import { db } from "../prisma/db.ts";
export const createTask = async (data) => {
  return db.orm.public.Task.create(data);
};
export const getTaskById = async (id) => {
  return db.orm.public.Task.where({ id }).first();
};
export const deleteTask = async (id) => {
  return db.orm.public.Task.where({ id }).delete();
};
export const updateTask = async (id, data) => {
  return db.orm.public.Task.where({ id }).update(data);
};
export const getAllTask = async (completedTask, pageNumber, limitNumber) => {
  const offset = (pageNumber - 1) * limitNumber;
  if (completedTask === undefined) {
    return db.orm.public.Task.limit(limitNumber).offset(offset).all();
  }

  return db.orm.public.Task.limit(limitNumber)
    .offset(offset)
    .where({ completed: completedTask })
    .all();
};
