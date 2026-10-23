import express from "express";
import * as TaskController from "./task.controller.js";
const routes = express.Router();
routes.post("/", TaskController.createTaskController);

routes.get("/:id", TaskController.getTaskByIdController);
routes.get("/", TaskController.getAllTasksController);
routes.patch("/:id", TaskController.updateTaskController);
routes.delete("/:id", TaskController.deleteTaskController);
export { routes };
