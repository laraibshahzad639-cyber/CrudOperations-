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
router.get("/", authenticationMiddleware, isAdmin,getUserController);// issue 12 add authentication middleware and isAdmin middleware to get all users route
router.patch("/me/password", authenticationMiddleware, changePasswordController);
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
router.patch("/me/password", authenticationMiddleware, changePasswordController);
export { router };
