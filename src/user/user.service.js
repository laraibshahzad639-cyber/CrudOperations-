import { db } from "../prisma/db.ts";
import argon2 from "argon2";

export const getUsers = async (limitNumber, pageNumber) => {
  //Issue 12 remove comments and tasks fromm service add pagination (solution remove sensitive data like comments and tasks from service layer and add pagination to get all users service)
  const offset = (pageNumber - 1) * limitNumber;

  return await db.orm.public.User.select(
    "id",
    "name",
    "email",
    "role",
    "isActive",
    "createdAt"
  )
    .limit(limitNumber)
    .offset(offset)
    .all();
};

export const getUserById = async (id) => {
  return await db.orm.public.User.where({ id }).first();
};
export const updateUsers = async (id, data) => {
  return await db.orm.public.User.where({ id })
    .select("id", "email", "name", "role", "createdAt", "updatedAt")
    .update(data);
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
export const getUserCredentialsById = async (id) => {
  return db.orm.public.User.where({ id }).first();
};
export const countActiveAdmins = async () => {
  return await db.orm.public.User.where({
    role: "ADMIN",
    isActive: true,
  }).count();
};
