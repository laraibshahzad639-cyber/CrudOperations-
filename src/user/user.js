
import express from "express";
import { createUserController, deleteUserController, getUserController, updateUserController } from "./user.controller.js";


// import { createUser, deleteUsers, getUserById, getUsers, updateUsers } from "./user.service.js"

const user = express.Router();

user.post("/", createUserController) 
//   try {
//     const { name, email } = req.body;

//     if (!name || !email) {
//       return res.status(400).json({
//         status: false,
//         message: "Email and Name are required",
//       });
//     }

//     const data = {
//       name,
//       email,
//     };

//     const createUsers = await createUser(data)

//     return res.status(201).json({
//       status: true,
//       message: "User created successfully",
//       data: createUsers,
//     });
//   } catch (error) {
//     console.error(error);

//     return res.status(500).json({
//       status: false,
//       message: "Internal server error",
//     });
//   }

user.get("/",getUserController)
//     try{
        
//         const user = await getUsers()
//         res.status(200).json({
//             status:true,
//             message:"User fetched sucessfully ",
//             data:user
//         })
//     }
//     catch(error){
//         res.status(404).json({
//             status:false,
//             message:"User not found"
            
//         })
//     }
// })
// user.get("/:id",async(req,res)=>{
//  try {
//     const {id}=req.params
//     const user=  await getUserById(id)
//     if(!user){
//         return  res.status(404).json({
//             status:false,
//             message:"User not found"
//         })
       
//     }
//      return  res.status(200).json({
//             status:true,
//             message:"Users fetched sucessfully",
//             data:user
//         })
//  }
//  catch(error){
//     res.status(500).json({
//   status:false,
//   message:"Internal server error"
//     })
//  }
// })
user.patch("/:id",updateUserController)
    // try{
    //     const{id}=req.params
    //     const {name,email}=req.body
    //     const user=await getUserById(id)
    //     if(!user)
    //     {
    //         return  res.status(404).json({
    //             status:false,
    //             message:"User not found"
    //         })
    //     }
    //     const data={name,email}
    //     const updatedUser=await updateUsers(  id ,data)
    //     return  res.status(200).json({
    //         status:false,
    //         message:"User updatedd Sucessfuly",
    //         data:updatedUser
    //     })
    // }
    // catch(error){
    //     return  res.status(500).json({
    //       status:false,
    //       message:"Internal server error "  
    //     })
    // }
// })

user.delete("/:id",deleteUserController)
//     try{
//         const {id}=req.params
//         const user=await getUserById(id)
//         if(!user){
//             return res.status(404).json({
//                 status:false,
//                 message:"Users not found"
//             })
//         }
//         const deletedUser=await deleteUsers(id)
//         return res.status(200).json({
//             status:true,
//             message:"User deleted sucessfuly"

//         })
//     }
//     catch(error){
//         return res.status(500).json({
//             status:false,
//             message:"Internal server error"

//         })
//     }
// })
export default user;
