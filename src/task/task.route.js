import express from "express";
import * as TaskController from "./task.controller.js";
import { authenticationMiddleware } from "../middleware/auth.middleware.js";
const routes = express.Router();
routes.post("/", authenticationMiddleware, TaskController.createTaskController);
routes.get("/status-summary", authenticationMiddleware, TaskController.checkStatusController)
routes.get("/upcomming",authenticationMiddleware,TaskController.upcommingTasksController)
routes.get(
  "/overdue",
  authenticationMiddleware,
  TaskController.getOverDueTasksController
);
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
routes.patch(
  "/:id/extend-deadline",
  authenticationMiddleware,
  TaskController.extendDueDateController
);
routes.delete("/:id", authenticationMiddleware, TaskController.deleteTaskController);//add Athentication middleware to delete route
routes.get("/", authenticationMiddleware, TaskController.getAllTaskController);



export { routes };
