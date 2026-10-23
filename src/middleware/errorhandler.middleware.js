export const errorhandlerMiddleware=(err,req,res,next)=>{
    return res.status(500).json({
        status:false,
        message:"Internal Server Error",
        method:req.method
    })
}