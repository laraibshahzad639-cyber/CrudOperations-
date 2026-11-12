import * as TaskService from "./task.service.js";
import { sucessMessage } from "../utils/sucessMesage.js";
import { errorMessage } from "../utils/errorMesage.js";
import { db } from "../prisma/db.ts";
import { getUserById } from "../user/user.service.js";

export const createTaskController = async (req, res, next) => {
  try {
    // console.log("Logged-in user:", req.user);
    const { title, description, completed, priority, status } = req.body;

    // if (!title || !description||!priority||!status) {
    //   return errorMessage(res, 400, "Tittle  description  priority  and status are required ");
    // }

    const data = {
      title,
      description,
      completed: completed ?? false,
      priority,
      status,
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
      console.log("Deleted Task Result:", deletetask);
    return sucessMessage(res, 200, "Task Deleted Sucessfully");
  } catch (error) {
    console.error("check ", error);
    next(error);
  }
};
export const getTaskByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    // console.log("Task ID:", id);
    // console.log("Logged-in User ID:", req.user.userId);
    // console.log("test  id ");

    const task = await TaskService.getTaskById(id, req.user.userId);

    if (!task) {
      // console.log("test id ");
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
    const { title, description, completed, priority, status } = req.body;

    const task = await TaskService.getTaskById(id, req.user.userId);

    if (!task) {
      return errorMessage(res, 404, "Task Not Found");
    }

    const updateData = {};

    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (priority !== undefined) updateData.priority = priority.trim().toUpperCase();
  
    if (completed !== undefined) {
      const isCompleted = completed === true || completed === "true";

      if (completed !== true && completed !== false &&
          completed !== "true" && completed !== "false") {
        return errorMessage(res, 400, "Invalid completed value");
      }

      updateData.completed = isCompleted;

      if (status === undefined) {
        updateData.status = isCompleted ? "COMPLETED" : "IN_PROGRESS";
      }
    }

    if (status !== undefined) {
      const cleanStatus = status.trim().toUpperCase();

      if (!["TODO", "IN_PROGRESS", "COMPLETED"].includes(cleanStatus)) {
        return errorMessage(res, 400, "Invalid status");
      }
  if(task.status==="TODO"&&cleanStatus==="COMPLETED"){
      return errorMessage(res, 400,"COMPLETED task cannot be moved back to TODO task  directly.")
    }

      updateData.status = cleanStatus;
      updateData.completed = cleanStatus === "COMPLETED";
    }

    const updatedTask = await TaskService.updateTask(
  id,
  req.user.userId,
  updateData,
  req.user.role
);

    if (!updatedTask) {
      return errorMessage(res, 404, "Task Not Found");
    }

    return sucessMessage(res, 200, "Task updated successfully", updatedTask);

  } catch (error) {
    console.error("Update Task Error:", error);
    next(error);
  }
};




export const getAllTaskController = async (req, res, next) => {
  try {
    const { completed, page, limit, order, priority, status } = req.query;
    const cleanPriority=priority?.trim().toUpperCase()
    const cleanStatus=status?.trim().toUpperCase()
    const cleanOrder=order?.trim().toUpperCase()
  
    // console.log("User role:", req.user.role);
    // console.log("User ID:", req.user.userId);
    // console.log("Priority received:", req.query.priority);

    // console.log(`page is ${typeof page}, limit is ${typeof limit}`);

    const page1 = Number(page) || 1;
    const limit1 = Number(limit) || 10;

    // console.log(`value of page is ${page1}, value of limit is ${limit1}`);

    let task;
    if (
      cleanPriority!== undefined &&
      cleanPriority!== "LOW" &&
      cleanPriority !== "MEDIUM" &&
       cleanPriority !== "HIGH"
    ) {
      return errorMessage(res, 400, "Invalid priority");
    }

    if (
      completed=== "true" ||
     completed=== "false" ||
      cleanPriority !== undefined ||
      page ||
      limit ||
      cleanOrder ||
     cleanStatus == "TODO" ||
     cleanStatus == "IN_PROGRESS" ||
      cleanStatus== "COMPLETED"
    ) {
      task = await TaskService.getAllTask(
        req.user.role,
        req.user.userId,
        completed === "true" ? true : completed === "false" ? false : undefined,
       cleanPriority,
        cleanStatus,
        page1,
        limit1,
        cleanOrder === "asc" ? "asc" : cleanOrder === "desc" ? "desc" : undefined
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

export const checkStatusController = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const role = req.user.role;
    console.log("test user id");

    const statusSummary = await TaskService.checkStatusSummary(role, userId);
    return sucessMessage(
      res,
      200,
      "Status summary fteched sucessfuly",
      statusSummary
    );
  } catch (error) {
    console.log("check erorr", error);
    next(error);
  }
};
