//error middleware
app.use((error,req,res,next)=>{
    //here we set the default statusCode and message so if we dont send it then default one will send to user
    const errorStatus =error.status || 500;
    const errorMessage= error.message || "something went wrong";
    return res.status(errorStatus).json(
        {
            error:true,
            success:false,
            status:errorStatus,
            message:errorMessage,
            stack:error.stack
        }
    )

})