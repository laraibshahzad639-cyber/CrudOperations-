import express from "express";
import { createTaskController, deleteTaskController, getAllTasksController, getTaskByIdController, updateTaskController } from "./task.controller.js";
const routes = express.Router();
routes.post("/",createTaskController )

routes.get("/:id", getTaskByIdController)
routes.get("/", getAllTasksController)

routes.patch("/:id",updateTaskController)

routes.delete("/:id", deleteTaskController) 
export  {routes}