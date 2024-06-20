import mongoose from 'mongoose'
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const userSchema = mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String 
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        
    },
    userName:{
        type:String,
        // unique:true

    },
    picture:{
        type:String,
        

    },
    about:{
        type:String
    },
    gender:{
        type:String,
        // enum:["Male","Female","Other"]
    },
    // isAdmin:{
    //     type:Boolean,
    //     default:false
    // },
    createdAt:{
        type:Date,
        default:Date.now()

    }

},
)

userSchema.pre('save',async function(next){
    const user = this;
    // console.log({"premethod",this}) it will print the data that is ging to save in db
    //if password is modified ie; hashed then we dont need to modify or hased it
    if(!user.isModified('password'))
    {
        next();
    }
    try{
        const saltRound = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(user.password,saltRound)
        //update the password
        user.password=hashPassword;

    }
    catch(error){
        console.log(error)
        next()
    }

})
userSchema.methods.comparePassword = async function(password){
    return bcrypt.compare(password,this.password)

}
// userSchema.methods.comparePassword=async function(password){
//     return bcrypt.compare(password,this.password,)
// }
const User = mongoose.model('User',userSchema);

export default User;