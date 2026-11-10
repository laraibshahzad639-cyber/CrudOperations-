import { db } from "../prisma/db.ts";
import argon2 from "argon2";

export const getUsers = async (limitNumber, pageNumber) => {
  const offset = (pageNumber - 1) * limitNumber;

  return await db.orm.public.User.include("tasks", (task) =>
    task
      .select("title", "description")
      .include("comments", (comment) => comment.select("content"))
  )
    .offset(offset)
    .all();
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

export const createUser = async (data) => {
  return await db.orm.public.User.create(data);
};
export const updatedUserRole = async (id, role) => {
  return await db.orm.public.User.where({ id }).update({
    role: role,
  });
};
export const updateUserstatus = async (id, data) => {
  return db.orm.public.User.where({ id }).update(data);
};
export const changePassword = async (id, newpassword) => {
  const hashedPassword = await argon2.hash(newpassword);

  return db.orm.public.User.where({ id }).update({
    password: hashedPassword,
  });
};
