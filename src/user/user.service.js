import { db } from "../prisma/db.ts";
export const createUser = async (data) => {
  return await db.orm.public.User.create(data);
};
export const getUsers = async () => {
  return await db.orm.public.User.all();
};
export const getUserById = async (id) => {
  return await db.orm.public.User.where({ id }).first();
};
export const updateUsers = async (id, data) => {
  return await db.orm.public.User.where({ id }).update(data);
};
export const deleteUsers = async (id) => {
  return await db.orm.public.User.where({ id }).delete();
};
