import { db } from "../prisma/db.ts";
export const createTask = async (data) => {
  return db.orm.public.Task.create(data);
};
// export const getAllTask = async (
//   completedTask,
//   pageNumber,
//   limitNumber,
//   userId
// ) => {
//   const offset = (pageNumber - 1) * limitNumber;
//   const query = {};

//   console.log("hello from task service");

//   // if (userId) query.userId = userId;
//   // if (completedTask !== undefined) query.completed = completedTask;

//   return db.orm.public.Task.all();
// };
// export const getTaskById = async (id) => {
//   return db.orm.public.Task.where({ id }).first();
// };
// export const deleteTask = async (id) => {
//   return db.orm.public.Task.where({ id }).delete();
// };
// export const updateTask = async (id, data) => {
//   return db.orm.public.Task.where({ id }).update(data);
// };
export const getAllTask = async (page1 = 1, limit1 = 10) => {
  // if (completed === undefined) {
  if(page1&limit1){

  
  const skip = (page1 - 1) * limit1;
  return await db.orm.public.Task.limit(limit1).offset(skip).all();
  }


  return await db.orm.public.Task.all();
};
