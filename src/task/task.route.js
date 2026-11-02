import express from "express";
import * as TaskController from "./task.controller.js";
import { authenticationMiddleware } from "../middleware/auth.middleware.js";
// import { authorize } from "../middleware/role.middleware.js";
const routes = express.Router();
// routes.use(authorize)
routes.post("/", TaskController.createTaskController);
// routes.get("/get", TaskController.check);

routes.get("/:id", TaskController.getTaskByIdController);
// routes.get("/", authenticationMiddleware, TaskController.getTask);
routes.patch("/:id", TaskController.updateTaskController);
routes.delete("/:id", TaskController.deleteTaskController);
routes.get("/",authenticationMiddleware,TaskController.getAllTaskController)

export {routes}
