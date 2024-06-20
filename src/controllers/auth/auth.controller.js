import User from '../../models/auth/user.model.js'
import bcrypt from 'bcrypt'
import { createError } from '../../helpers/common/backend.functions.js'
import JWT from 'jsonwebtoken'

const registerUser = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password } = req.body
        const isUserExist = await User.findOne({ email })
        if (isUserExist) {
            next(createError(403, "User already exists"))
            return

        }
        if (!firstName || !email || !password || firstName == "" || password == "" || email == "") {
            next(createError(403, "Please Enter all the Feilds"))
            return;
        }

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password
        })

        if (newUser) {
            res.status(201).json({
                message: "registration successfull",
            },)
        }
        else {
            next(createError(401, "user not found"))
            return;
        }
    }
    catch (error) {
        next(error);
    }
}


const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password || email == "" || password == "") {
            next(createError(403, "fill all fields"))
            return;
        }

        const userExist = await User.findOne({ email })

        if (!userExist) {
            next(createError(400, 'invalid credentials'))
            return;
        }

        const verifiedUser = await userExist.comparePassword(password)

        const id = userExist._id;

        //generate token -> jwt.sign(payload, secretOrPrivateKey, [options, callback])

        if (verifiedUser) {
            const token = JWT.sign({ id: userExist._id }, process.env.JWT_SECRET_KEY, { expiresIn: '20hr' })
            return res.status(200)
                .json(
                    {
                        error: false,
                        data: userExist,
                        message: "Login Successfully...!",
                        token
                    })
        }
        else {
            res.status(400).json({message:"invalid email or password"})
            next(createError(401, "invalid email or password"))
            return;
        }
    }
    catch (error) {
        console.log('login error', error)
        next(error)
    }

}

const updateUser = async (req, res, next) => {
    try {
        
        const { ...update } = req.body;
        const userId = req.user.id;

        const userExist = await User.findById(userId);
        if (!userExist) {
            return next(createError(400, "User not found"))
        }
        
        if (update.userName) {
            const uniqueUserName = await User.findOne({ userName: update.userName })
          
            if (uniqueUserName!=null && uniqueUserName._id != userId ) {
               
                return next(createError(409, "userName alredy present!!!"))
            }
        }

        //updating field based on user requirement
        for (let key in update) {
            if (update.hasOwnProperty(key)) {
                userExist[key] = update[key]
            }
        }
        const result = await userExist.save();
        const updateUser ={
            _id : result._id,
            firstName : result.firstName,
            lastName : result.lastName,
            email : result.email,
            userName : result.userName

        }
        if (result) {
            res.status(200).json({ data: updateUser })
        }
    }
    catch (error) {
        next(error)
    }
}

const updatePic = async (req, res, next) => {
    try {
        const userId = req.body.userId;
        const fileName = req.file.filename;
        const userExist = await User.findById(userId)
        if (!userExist) {
            next(createError(400, "User Not exists"))
            return;
        }

        userExist.picture = fileName;
        const result = await userExist.save()
        if (!result) {
            next(createError(400, "fail to update the profile picture"))
        }
        res.status(200).json({ message: "Profile Updated successfuly" })
    }
    catch (error) {
        next(error)
    }
}


const getProfileData = async (req, res, next) => {
    try {
        const _id = req.body.userId;
        // console.log(_id)
        const userExist = await User.find({_id},{firstName:1,lastName:1,userName:1,gender:1,about:1,picture:1});
        // console.log("userExists",userExist)
        if (!userExist) {
            next(createError(400, "User not found"))
        }
    //    const data = {
    //     ...userExist
    //    }
    //     console.log(data)
    const data ={userExist}
        return res.status(200).json(userExist[0])
    }
    catch (error) {
        next(error)
    }
}

export {
    registerUser, loginUser, updateUser, updatePic, getProfileData
}