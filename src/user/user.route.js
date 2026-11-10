import { db } from "../prisma/db.ts";
import express from "express";
import {
  changePasswordController,
  createUserController,
  deleteUserController,
  getUserByIdController,
  getUserController,
  updateUserController,
  updateUserRoleController,
  updateUserstatusController,
} from "./user.controller.js";
import { isAdmin } from "../middleware/role.middleware.js";
import { authenticationMiddleware } from "../middleware/auth.middleware.js";
const router = express.Router();
router.post("/", createUserController);
router.get("/", getUserController);
router.get("/:id", authenticationMiddleware, isAdmin, getUserByIdController);

router.delete("/", deleteUserController);
router.patch("/:id", authenticationMiddleware, isAdmin, updateUserController);
router.patch(
  "/:id/role",
  authenticationMiddleware,
  isAdmin,
  updateUserRoleController
);
router.patch(
  "/:id/deactive",
  authenticationMiddleware,
  isAdmin,
  updateUserstatusController
);
router.patch("/:id/password", changePasswordController);
export { router };
