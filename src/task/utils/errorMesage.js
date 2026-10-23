export const errorMessage=(res,statuscode,message,data=null)=>{
    return res.status(statuscode).json(
        {
            sucess:false,statuscode,message,data

        }
    );
}