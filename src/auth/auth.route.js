import express from "express";
import {
  loginController,
  logoutController,
  myUserController,
  registerUserController,
} from "./auth.controller.js";
import { authenticationMiddleware } from "../middleware/auth.middleware.js";
const route = express.Router();
route.post("/", registerUserController);
route.post("/login", loginController);
route.post("/logout", logoutController);
route.get("/me", authenticationMiddleware, myUserController);
export { route };
