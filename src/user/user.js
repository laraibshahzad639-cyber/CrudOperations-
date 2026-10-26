
import express from "express";
import { db } from "../prisma/db.ts";

const user = express.Router();

user.post("/", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        status: false,
        message: "Email and Name are required",
      });
    }

    const data = {
      name,
      email,
    };

    const createUser = await db.orm.public.User.create(data);

    return res.status(201).json({
      status: true,
      message: "User created successfully",
      data: createUser,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
});
user.get("/",async(req,res)=>{
    try{
        
        const user = await db.orm.public.User.all()
        res.status(200).json({
            status:true,
            message:"User fetched sucessfully ",
            data:user
        })
    }
    catch(error){
        res.status(404).json({
            status:false,
            message:"User not found"
            
        })
    }
})
user.get("/:id",async(req,res)=>{
 try {
    const {id}=req.params
    const user= await db.orm.public.User.where({id}).first()
    if(!user){
        return  res.status(404).json({
            status:false,
            message:"User not found"
        })
       
    }
     return  res.status(200).json({
            status:true,
            message:"Users fetched sucessfully",
            data:user
        })
 }
 catch(error){
    res.status(500).json({
  status:false,
  message:"Internal server error"
    })
 }
})
user.patch("/:id",async(req,res)=>{
    try{
        const{id}=req.params
        const {name,email}=req.body
        const user=await db.orm.public.User.where({id}).first()
        if(!user)
        {
            return  res.status(404).json({
                status:false,
                message:"User not found"
            })
        }
        const data={name,email}
        const updatedUser=await db.orm.public.User.where({id}).update(data)
        return  res.status(200).json({
            status:false,
            message:"User updatedd Sucessfuly",
            data:updatedUser
        })
    }
    catch(error){
        return  res.status(500).json({
          status:false,
          message:"Internal server error "  
        })
    }
})

user.delete("/:id",async(req,res)=>{
    try{
        const {id}=req.params
        const user=await db.orm.public.User.where({id}).first()
        if(!user){
            return res.status(404).json({
                status:false,
                message:"Users not found"
            })
        }
        const deletedUser=await db.orm.public.User.where({id}).delete()
        return res.status(200).json({
            status:true,
            message:"User deleted sucessfuly"

        })
    }
    catch(error){
        return res.status(500).json({
            status:false,
            message:"Internal server error"

        })
    }
})
export default user;
