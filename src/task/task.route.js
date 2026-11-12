import express from "express";
import * as TaskController from "./task.controller.js";
import { authenticationMiddleware } from "../middleware/auth.middleware.js";
const routes = express.Router();
routes.post("/", authenticationMiddleware, TaskController.createTaskController);
routes.get("/status-summary", authenticationMiddleware, TaskController.checkStatusController)
routes.get(
  "/:id",
  authenticationMiddleware,
  TaskController.getTaskByIdController
);
routes.patch(
  "/:id/status",
  authenticationMiddleware,
  TaskController.updateTaskController
);
routes.delete("/:id", TaskController.deleteTaskController);
routes.get("/", authenticationMiddleware, TaskController.getAllTaskController);



export { routes };
