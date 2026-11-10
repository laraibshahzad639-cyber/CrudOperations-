import { db } from "../prisma/db.ts";

export const addComment=async(data)=>{
    return await db.orm.public.Comment.create(data)
}
export const getComments = async (taskId, limit1, offset) => {
  return await db.orm.public.Comment
    .where({ taskId }).orderBy((user)=>user.createdAt.desc()).include("user",(user)=>user.select("name"))
    .limit(limit1)
    .offset(offset)
    .all();
};
export const updateComment=async(id,userId,data, role)=>{
    if(role==="ADMIN"){
        return db.orm.public.Comment.where({id}).update();
    }
    else{
        return await db.orm.public.Comment.where({ id, userId }).update(data)

    }
    
}
export const getCommentById=async(id)=>{
    return db.orm.public.Comment.where({id}).first()
}
export const deleteComments = async (id, userId, role) => {
  if (role === "ADMIN") {
    return await db.orm.public.Comment.where({ id }).delete();
  } else {
    return await db.orm.public.Comment.where({ id, userId }).delete();
  }
};