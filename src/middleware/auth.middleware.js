import jwt from "jsonwebtoken";
import { sucessMessage } from "../utils/sucessMesage.js";
import { errorMessage } from "../utils/errorMesage.js";
import { getUserById } from "../user/user.service.js";
// import { decode } from "node:punycode";

export const authenticationMiddleware = async (req, res, next) => {
  console.log("1. Authentication middleware called");

  const accessToken = req.cookies?.access_token;

  if (!accessToken) {
    return res.status(401).json({
      status: false,
      message: "Authentication required",
    });                                                                                                                                                                                                                     
  }

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not configured");

    return res.status(500).json({
      status: false,
      message: "Server configuration error",
    });


  }
 

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    const user = await getUserById(decoded.userId);
    
    if(!user){
      return errorMessage(res,404,"User Not found ");
    }
    
    if(user.isActive == false){
      return errorMessage(res,403,
        "Your account hasbeen deactivated"
      );
    }

    console.log("Decoded token:", decoded);

    req.user = {

      userId: decoded.userId,
      taskId:decoded.taskId,

      role: decoded.role,
      isActive:decoded.isActive
    };

    console.log("User  Role:", req.user.role);

    return next();
  } catch (error) {
    console.log("4. Authentication failed:", error.message);

    return res.status(401).json({
      status: false,
      message: "Invalid or expired token",
    });
  }
};


