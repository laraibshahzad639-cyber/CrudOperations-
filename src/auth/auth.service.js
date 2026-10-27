import { db } from "../prisma/db.ts";
export const registerUser=async(data)=>{
    return await db.orm.public.User.create(data);
}
export const  loginUser=async(email)=>{
    return await db.orm.public. User.where({email}).first()
} 
export const myUser=async()=>{
    return  await db.orm.public.User
      .where({ id: userId })
      .first();
}