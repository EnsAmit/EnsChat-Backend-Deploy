import mongoose from "mongoose"
import dotenv from 'dotenv'
dotenv.config()

const dbConnect=()=>{

const conn = mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log(" db connection successful")
})
.catch((error)=>{
    console.log("error in db connection",error)
})

}

export {dbConnect}