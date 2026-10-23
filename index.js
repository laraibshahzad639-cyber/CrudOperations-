import express from "express";
import dotenv from "dotenv";

import { title } from "node:process";
import { createTaskController,getAllTasksController,getTaskByIdController,deleteTaskController,updateTaskController } from "./src/task/task.controller.js";

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 4000;

// app.use("/tasks", router)

app.post("/tasks",createTaskController )

app.get("/tasks/:id", getTaskByIdController)
app.get("/tasks", getAllTasksController)

app.patch("/tasks/:id",updateTaskController)

app.delete("/tasks/:id", deleteTaskController)

app.listen(PORT, () => {
  console.log(`Server is listening on Port ${PORT}`);
});
