import express from "express";
import dotenv from "dotenv";
import { db } from "./src/prisma/db.ts";
import { title } from "node:process";

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 4000;

// app.use("/tasks", router)

app.post("/tasks", async (req, res) => {
  try {
    const { title, description, completed } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        status: false,
        message: "Title and description are required",
      });
    }

    const data = {
      title,
      description,
      completed: completed ?? false,
    };

    const task = await db.orm.public.Task.create(data);

    return res.status(201).json({
      status: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "internal server error",
    });
  }
});

app.get("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const task = await db.orm.public.Task.where({ id }).first();

    if (!task) {
      return res.status(404).json({
        status: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Task fetched successfully",
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
});

app.patch("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        status: false,
        message: "Title and description are required",
      });
    }

    const task = await db.orm.public.Task.where({ id }).first();

    if (!task) {
      return res.status(404).json({
        status: false,
        message: "Task not found",
      });
    }

    const data = { title, description, completed };

    const updatedTask = await db.orm.public.Task.where({ id }).update(data);

    return res.status(200).json({
      status: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const task = await db.orm.public.Task.where({ id }).first();

    if (!task) {
      return res.status(404).json({
        status: false,
        message: "Task not found",
      });
    }

    const deleteTask = await db.orm.public.Task.where({ id }).delete();

    return res.status(200).json({
      status: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Inernal server error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on Port ${PORT}`);
});
