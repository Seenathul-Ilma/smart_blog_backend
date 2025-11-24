import { Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import { AuthRequest } from "../middleware/auth";
import { Post } from "../models/postModel";
import { IUser, User } from "../models/userModels";
import { GoogleGenAI } from "@google/genai";

import dotenv from "dotenv"
dotenv.config()

// if we install genai by using 'npm install @google/genai'
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const savePost = async (req: AuthRequest, res: Response) => {
    //req.file?.buffer -> we can get any file type that we stored in RAM from this

    try {

        const { title, content, tags } = req.body
        let imageURL = ""

        if(!req.user){
            res.status(401).json({ message:"Unauthorized Access..!" })
        }

        if (req.file) {
            const result:any = await new Promise((resolve, reject)=>{
                const upload_stream = cloudinary.uploader.upload_stream(   // cloudinary in-built structure eka
                    {folder: "posts"},    
                    (error,result)=>{
                        if (error) return reject(error)
                        resolve(result)
                    }
                )
                upload_stream.end(req.file?.buffer)
            })
            imageURL = result.secure_url
        }

        const newPost = new Post({
            title,
            content,
            tags: tags.split(","),  // "Java,CSS,Python" -> ["Java", "CSS", "Python"]
            imageURL,
            author: req.user.sub
        })
        await newPost.save()

        res.status(201).json({
            message: "Post creation succuss..!",
            data: newPost
        })

        // save to mongodb

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Failed to save post..!" })
    }
}

export const generateContent = async (req: AuthRequest, res: Response) => {
    try {

        const { content } = req.body

        if(!req.user){
            res.status(401).json({ message:"Unauthorized Access..!" })
        }

        // if we install genai by using 'npm install @google/genai'
        const generatedDescription = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: content,
        });

        // if we install genai by using 'npm install @google/genai'
        console.log(generatedDescription.text);

        res.status(201).json({
            message: "Description Generated successfully..!",
            data: generatedDescription.text
        })

        // save to mongodb

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Failed to generate content..!" })
    }
}

// api/v1/post?page=1&limit=10
export const getAllPosts = async (req: Request, res: Response) => {
    // pagination  (page, limit)
    // use query params
    try {

        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 10

        const skip = (page - 1) * limit

        const posts = await Post.find()
        .populate("author", "email")   // related model's data ganna puluvan 
        .sort({ createdAt : -1})   // to get in desc order
        .skip(skip)   // ignore data for pagination
        .limit(limit)  // currently needed data count

        const total = await Post.countDocuments()  // to get total document count
        
        res.status(200).json({
            message: "Retrieved posts successfully..!",
            data: posts,
            totalPages: Math.ceil(total / limit),
            totalCount: total,
            page
        })
        
    } catch (err:any) {
        console.error(err)
        res.status(500).json({ message: err?.message })
    }

}

export const getMyPost = async (req: AuthRequest, res: Response) => {

    try {

        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 10

        const skip = (page - 1) * limit

        const posts = await Post.find({ author: req.user.sub })
        //.populate("author", "email")   // related model's data ganna puluvan  (an author don't need his own data to grab)
        .sort({ createdAt : -1})   // to get in desc order
        .skip(skip)   // ignore data for pagination
        .limit(limit)  // currently needed data count

        const total = await Post.countDocuments()  // to get total document count
        
        res.status(200).json({
            message: "Retrieved posts successfully..!",
            data: posts,
            totalPages: Math.ceil(total / limit),
            totalCount: total,
            page
        })
        
    } catch (err:any) {
        console.error(err)
        res.status(500).json({ message: err?.message })
    }

}