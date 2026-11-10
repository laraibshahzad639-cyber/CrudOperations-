import express from "express";
import { addCommentsController, deleteCommentsController, getAllComments, updateCommentsController } from "./comment.controller.js";
import { authenticationMiddleware } from "../middleware/auth.middleware.js";
const router1 = express.Router();
router1.post("/:taskId/comments", authenticationMiddleware,addCommentsController)
router1.get("/", authenticationMiddleware,getAllComments)
router1.patch("/:id",authenticationMiddleware,updateCommentsController)
router1.delete("/:id",authenticationMiddleware,deleteCommentsController)
export {router1}