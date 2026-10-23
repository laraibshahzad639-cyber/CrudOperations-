import { createTask, deleteTask, getAllTask, getTaskById } from "./task.service.js";
import { sucessMessage } from "../utils/sucessMesage.js";
import { errorMessage } from "../utils/errorMesage.js";

export const createTaskController=async(req ,res ,next)=>{
    try {
        const { title, description, completed } = req.body;
    
        if (!title || !description) {
          return errorMessage(res,400,"Tittle and description are required ")
        }
    
        const data = {
          title,
          description,
          completed: completed ?? false,
        };
    
        const task = await createTask(data)
    
        return sucessMessage(res,201,"Task created sucessfully",task)
      } catch (error) {
        next(error)
      }
    }
export const getAllTasksController= async(req,res,next)=>{
    try {
   

    const task =  await getAllTask()

    if (!task) {
      return errorMessage(res,404,"Task Not Found ")}

    return sucessMessage(res,200,"Task Fetched sucessfully",task )
  } catch (error) {
    next(error)
  }
}

export const deleteTaskController=async(req,res,next)=>{
  try {
    const { id } = req.params;

    const task = await getTaskById(id)

    if (!task) {
      return errorMessage(res,404," Task Not Found ")
    }

    const deletetask = await  deleteTask(id)

    return sucessMessage(res,200,"Task Deleted Sucessfully")
  } catch (error) {
    next(error)
}}
export const getTaskByIdController=async(req,res,next)=>{
    try {
    const { id } = req.params;

    const task =  await getTaskById(id)

    if (!task) {
      return errorMessage(res,404,"Task Not Found ")
    }

    return sucessMessage(res,200,"Task Fetched Sucessfully ",task)
  } catch (error) {
    next(error)
  }
}
export const updateTaskController=async(req,res,next)=>{
    try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    if (!title || !description) {
      return errorMessage(res,400,"Tittle and description are required")
    }

    const task = await getTaskById(id)

    if (!task) {
      return errorMessage(res,404,"Task Not Found")
    }

    const data = { title, description, completed };

    const updatedTask = await Updatetask(id,data)

    return sucessMessage(res,200,"Task updated sucuessfully",updatedTask)
  } catch (error) {
   next(error)
  }
}