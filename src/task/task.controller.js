import * as TaskService from "./task.service.js";
import { sucessMessage } from "../utils/sucessMesage.js";
import { errorMessage } from "../utils/errorMesage.js";
import { db } from "../prisma/db.ts";

export const createTaskController = async (req, res, next) => {
  try {
    console.log("Logged-in user:", req.user);
    const { title, description, completed, priority } = req.body;

    if (!title || !description || !priority) {
      return errorMessage(
        res,
        400,
        "Tittle  description  and priority are required "
      );
    }

    const data = {
      title,
      description,
      completed: completed ?? false,
      priority: priority || "MEDIUM",
      userId: req.user.userId,
    };

    const task = await TaskService.createTask(data);

    return sucessMessage(res, 201, "Task created sucessfully", task);
  } catch (error) {
    console.error("check error", error);
    next(error);
  }
};

export const deleteTaskController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await TaskService.getTaskById(id);

    if (!task) {
      return errorMessage(res, 404, " Task Not Found ");
    }

    const deletetask = await TaskService.deleteTask(id);
    return sucessMessage(res, 200, "Task Deleted Sucessfully");
  } catch (error) {
    console.error("check ", error);
    next(error);
  }
};
export const getTaskByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await TaskService.getTaskById(id, req.user.userId);

    if (!task) {
      return errorMessage(res, 404, "Task Not Found ");
    }

    return sucessMessage(res, 200, "Task Fetched Sucessfully ", task);
  } catch (error) {
    console.error("check error", error);
    next(error);
  }
};
export const updateTaskController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, completed, priority } = req.body;

    if (!title || !description || !priority) {
      return errorMessage(res, 400, "Tittle and description are required");
    }

    const task = await TaskService.getTaskById(id, req.user.userId);

    if (!task) {
      return errorMessage(res, 404, "Task Not Found");
    }

    const data = { title, description, completed, priority };

    const updatedTask = await TaskService.updateTask(id, req.user.userId, data);

    return sucessMessage(res, 200, "Task updated sucuessfully", updatedTask);
  } catch (error) {
    console.error("check error", error);
    next(error);
  }
};

export const getAllTaskController = async (req, res, next) => {
  try {
    const { completed, page, limit, order, priority } = req.query;

    console.log("User role:", req.user.role);
    console.log("User ID:", req.user.userId);

    console.log(`page is ${typeof page}, limit is ${typeof limit}`);

    const page1 = Number(page) || 1;
    const limit1 = Number(limit) || 10;

    console.log(`value of page is ${page1}, value of limit is ${limit1}`);

    let task;
    if (
      priority !== undefined &&
      priority !== "LOW" &&
      priority !== "MEDIUM" &&
      priority !== "HIGH"
    ) {
      return errorMessage(res, 400, "Invalid priority");
    }

    if (
      completed === "true" ||
      completed === "false" ||
      priority !== undefined ||
      page ||
      limit ||
      order
    ) {
      task = await TaskService.getAllTask(
        req.user.role,
        req.user.userId,
        completed === "true" ? true : completed === "false" ? false : undefined,
        priority,
        page1,
        limit1,
        order
      );
    } else {
      task = await TaskService.getAllTask(req.user.role, req.user.userId);
    }

    return sucessMessage(res, 200, "Tasks fetched successfully", task);
  } catch (error) {
    console.error("Get all tasks error:", error);
    return next(error);
  }
};
