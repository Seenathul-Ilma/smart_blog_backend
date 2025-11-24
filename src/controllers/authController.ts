import { Request, Response } from "express"
import bcrypt from "bcryptjs"
//import { Auth } from "../models/authModel"
import { IUser, Role, Status, User } from "../models/userModels"
import { AuthRequest } from "../middleware/auth"
//import { AuthorizationRequest } from "../middleware/authorizeRoles"
import { signAccessToken, signRefreshToken } from "../utils/tokens"

import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

//const JWT_SECRET = process.env.JWT_SECRET as string
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string

export const register = async (req: Request, res: Response) => {
    
    try {
        /* const firstName = req.body.fname
        const lastName = req.body.lname
        const email = req.body.email
        const password = req.body.password
        const role = req.body.role */

        const { firstName, lastName, email, password, role } = req.body

        // data validation
        if(!firstName || !lastName || !email || !password || !role) {
            return res.status(400).json({ message: "Ooopsss.. All fields are required..!"})
        }

        if( role !== Role.USER && role !== Role.AUTHOR) {
            return res.status(400).json({ message: "Ooopsss.. Invalid role..!" })
        }
        
        //const existingUser = await User.findOne({email: email})
        const existingUser = await User.findOne({ email })
        if(existingUser) {
            return res.status(400).json({ message: "Email already exist..!" })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const approvalStatus = role === Role.AUTHOR ? Status.PENDING : Status.APPROVED

        const newUser = new User ({
            firstname: firstName,
            lastname: lastName,
            //email: email,
            email,    // same (email : email)
            password: hashedPassword,
            roles: [role],
            approval: approvalStatus
        })

        await newUser.save()

        //console.log("UserData: ", registeredUser)

        res.status(201).json({
            message: 
                role === Role.AUTHOR
                    ? "Author registration successful! Your account is awaiting admin approval..."
                    : "User registered successful..!",
            data: {
                id: newUser._id,
                email: newUser.email,
                roles: newUser.roles,
                approval: newUser.approval
            }
        })
    } catch (err: any) {
        console.error(err)
        res.status(500).json({ message: err?.message })
    }

    console.log("Successfully registered..!")
    //res.send("You're registered. Please Log in.")
}

export const refreshAccessToken = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body // req body eken refreshToken eka eliyta gannnawa

        if(!refreshToken) {
            return res.status(400).json({ message: "Refresh token is required..!" })
        }

        // token eka ethule hangagena hitapu data tika payload ekata araganna
        const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET)

        const currentUser = await User.findById(payload.sub)
        if(!currentUser) {
            return res.status(404).json({ message: "Cannot find user..!" })
        }

        const newAccessToken = signAccessToken(currentUser)

        res.status(200).json({
            message: "New access token has been generated..!",
            data: {
                accessToken: newAccessToken
            }
        })

        /* res.status(200).json({
            accessToken: newAccessToken
        }) */

    } catch (err) {
        console.error(err)
        res.status(403).json({ message: "Invalid or expired refresh token..!" })
    }
}

export const login = async (req: Request, res: Response) => {
    //console.log("Login Successful..!")
    //res.send("Logged in. Welcome to the dashboard..!")

    try {
        const { email, password } = req.body

        const existingUser = await User.findOne({ email })
        if(!existingUser) {
            return res.status(401).json({message: "Invalid Credentials..!"})
        }

        const validPassword = await bcrypt.compare(password, existingUser.password)
        if(!validPassword) {
            return res.status(401).json({message: "Incorrect Password..!"})
        }

        const accessToken = signAccessToken(existingUser)
        const refreshToken = signRefreshToken(existingUser)

        res.status(200).json({
            message: "Login Successful..!",
            data: {
                email: existingUser.email,
                role: existingUser.roles,
                accessToken, // token (accessToken)
                refreshToken // refreshToken
            }
        })
    }  catch (err: any) {
        console.error(err)
        res.status(500).json({ message: err?.message })
    }
}

export const getMyProfile = async (req: AuthRequest, res: Response) => {
    //console.log("User Profile Found..!")
    //res.send("User Profile..!")

    if(!req.user) {
        return res.status(401).json({ message: "Oooppss.. Unauthorized Access..!" })
    }

    const userId = req.user.sub
    const user = ((await User.findById(userId).select("-password")) as IUser) || null

    if(!user) {
        return res.status(404).json({ message: "Cannot find user..!" })
    }

    const { firstname, lastname, email, roles, approval } = user

    res.status(200).json({ 
        message: "OK",
        data: { firstname, lastname, email, roles, approval }
     })

}

//export const adminRegister = async (req: AuthorizationRequest, res: Response) => {
export const adminRegister = async (req: AuthRequest, res: Response) => {
    //console.log("Admin registration success..!")
    //res.send("Admin registration success..!")

    try {

        if(!req.user) {
            return res.status(403).json({ message: "Oooppss.. Unauthorized Access..!" })
        }

        const { firstName, lastName, email, password } = req.body

        if(!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "Oooppss.. All fields are required..!" })
        }

        const existingUser = await User.findOne({ email })
        if(existingUser) {
            return res.status(400).json({ message: "Email already exist..!" })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User ({
            firstname: firstName,
            lastname: lastName,
            email,
            password: hashedPassword,
            roles: [Role.ADMIN],
            approval: Status.APPROVED
        })

        await newUser.save()

        res.status(201).json({
            message: "Admin registration successful..!",
            data: {
                id: newUser._id,
                email: newUser.email,
                roles: newUser.roles,
                approval: newUser.approval
            }
        })  
    } catch (err: any) {
        console.error(err)
        res.status(500).json({ message: err?.message })
    }
}