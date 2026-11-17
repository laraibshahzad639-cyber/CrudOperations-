import { getUserById } from "../user/user.service.js"
import { errorMessage } from "../utils/errorMesage.js"
import { sucessMessage } from "../utils/sucessMesage.js"
import { getTaskById } from "../task/task.service.js";
import { addComment, deleteComments, getCommentById, getComments, updateComment } from "./comment.service.js"


export const addCommentsController = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;

    if (!content || !content.trim()) {
      return errorMessage(res, 400, "Content required");
    }

    const task = await getTaskById(taskId);

    if (!task) {
      return errorMessage(res, 404, "Task not found");
    }

  

    const addcomment = await addComment({
      content,
      taskId,
      userId
    });

    return sucessMessage(res, 201, "Comment added successfully", addcomment);
  } catch (error) {
    next(error);
  }
};

export const getAllComments = async (req, res, next) => {// add taskId parameter to the function,set default value of page is 1 and  default value of limit is 10, set maximum value of limit is 100, calculate offset based on page and limit
    try {
        const { taskId } = req.params;
        const { page, limit } = req.query;

        const page1 = Number(page) || 1;
        const limit1 = Math.min(Number(limit) || 10, 100);

        const offset = (page1 - 1) * limit1;

        const task = await getTaskById(
            taskId,
            req.user.userId,
            req.user.role
        );

        if (!task) {
            return errorMessage(res, 404, "Task not found");
        }

        const comments = await getComments(taskId, limit1, offset);

        return sucessMessage(res, 200, "Comments fetched successfully", comments);
    }
    catch (error) {
        console.error("check error", error);
        next(error);
    }
};

export const updateCommentsController=async(req,res,next)=>{
    try{
        const{id}=req.params
        const{content}=req.body
          const userId = req.user.userId;
        const findComments= await getCommentById(id)
        if(!findComments)
        {
            return errorMessage(res,404,"Comments not found ")
        }
        if (findComments.userId !== userId) {
      return errorMessage(res, 403, "You cannot update another users comment");
    }
     

        const updatedComment=await updateComment(id,userId,{content})
        return sucessMessage (res,200,"Comments  updated sucessfully ",updatedComment)
        


    }
    catch(error){
        console.error("check  error",error)
        next(error)
    }
}
export const deleteCommentsController=async(req,res,next)=>{
     try {
         const {id}=req.params
         const userId=req.user.userId
         const findComment=await getCommentById(id)
         if(!findComment)
         {
            return errorMessage(res, 404,"Comments not found ")

         }
          if (req.user.role !== "ADMIN" && findComment.userId !== userId) {
      return errorMessage(res, 403, "You cannot delete another users comment");
    }

         const deleteComment=await deleteComments(id,userId,req.user.role)
         return sucessMessage(res,200,"Comments  deleted sucessfully",deleteComment)

     }
     catch(error){
      console.error("check  error",error)
      next(error)
     }
     
}