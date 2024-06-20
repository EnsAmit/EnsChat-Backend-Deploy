import jwt from 'jsonwebtoken'
import { createError } from '../../helpers/common/backend.functions.js';

 const verifyToken=(req,res,next)=>{
    const authHeader = req.header('authorization');
    const token = authHeader && authHeader.split(' ')[1];
    if(!token){
    //    next( createError(401,"your are not authenticated...!"))
    return res.status(400).json({mssge:"your are not authenticated...!"})

    }

    //if we get token then verift it

    jwt.verify(token,process.env.JWT_SECRET_KEY,(err,user)=>{
        //once token is verify then callback is executed
        //if token is verify then value of err is null
        if(err){
            //  return next(createError(401,"Token is not valid...!"))
            return  res.status(400).json({mssge:"not valid user"})
        }
        //as its a middleware sp that why we can access the req.
        //we need to create a middleware bcz once token is verify we have to to update the req.user with decoded payload
        req.user =user;
       
        next()
    })
}

export { verifyToken};