import { createTask, deleteTask, getAllTask, getTaskById } from "./task.service.js";

export const createTaskController=async(req ,res )=>{
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
    
        const task = await createTask(data)
    
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
    }
export const getAllTasksController= async(req,res)=>{
    try {
   

    const task =  await getAllTask()

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
}

export const deleteTaskController=async(req,res)=>{
  try {
    const { id } = req.params;

    const task = await getTaskById(id)

    if (!task) {
      return res.status(404).json({
        status: false,
        message: "Task not found",
      });
    }

    const deletetask = await  deleteTask(id)

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
}
export const getTaskByIdController=async(req,res)=>{
    try {
    const { id } = req.params;

    const task =  await getTaskById(id)

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
}
export const updateTaskController=async(req,res)=>{
    try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        status: false,
        message: "Title and description are required",
      });
    }

    const task = await getTaskById(id)

    if (!task) {
      return res.status(404).json({
        status: false,
        message: "Task not found",
      });
    }

    const data = { title, description, completed };

    const updatedTask = await Updatetask(id,data)

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
}