import { db } from "../prisma/db.ts";
import express from "express";
import {
  //   createUserController,
  deleteUserController,
  getUserController,
  updateUserController,
} from "./user.controller.js";
const router = express.Router();
// router.post("/", createUserController);
router.get("/", getUserController);
router.delete("/", deleteUserController);
router.patch("/:id", updateUserController);
export { router };
