import type { Request, Response } from 'express'
import Post from '../models/post.model.js'
import User from '../models/user.model.js'
import cloudinary from '../lib/cloudinary.js'

export const getPosts = async (req:Request,res:Response) : Promise<void> => {
    try {
        const posts = await Post.find()
        .sort({createdAt:-1})
        .populate("user","username profilePic fullName")
        .populate({
            path:"comments",
            populate:{
                path:"user",
                select:"username fullName profilePic"
            }
        })
        res.status(200).json({
            message: 'Posts Found!',
            posts
        })
    } catch (error:any) {
        res.status(500).json({
            message: `Error Getting Posts:${error}`
        })
    }
}

export const getPost = async (req:Request,res:Response) : Promise<void> => {
    try {
        const {postId} = req.params
        const post = await Post.findById(postId)
        .populate("user", "username fullName profilePic")
        .populate({
            path: "comments",
            populate: {
                path: "user",
                select: "username fullName profilePic",
            },
        });
        if(!post){
            res.status(404).json({
                message: "Post not found"
            })
            return
        }
        res.status(200).json({post})

    } catch (error : any) {
        res.status(500).json({
            message: `Error Getting Post:${error}`
        })
    }
}

export const getUserPosts = async (req:Request,res:Response) : Promise<void> => {
    try {
        const {username} = req.params
        const user = await User.findOne({username})
        if(!user){
            res.status(404).json({
                message: "User not found"
            })
            return
        }

        const posts = await Post.find({user:user._id})
        .sort({createdAt:-1})
        .populate("user","username profilePic fullName")
        .populate({
            path:'comments',
            populate:{
                path:'user',
                select:'username fullName profilePic'
            }
        })

        res.status(200).json({
            message: 'Posts Found!',
            posts
        })
    } catch (error:any) {
        res.status(500).json({
            message: `Error Getting Posts:${error}`
        })          
    }
}

export const createPost = async (req:Request,res:Response) : Promise<void> => {
    try {
        const userId = (req as any).user._id
        const { content } = req.body;
        const imageFile = req.file;
    
        if (!content && !imageFile) {
            res.status(400).json({ error: "Post must contain either text or image" });
            return;
        }
    
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ error: "User not found" })
            return;
        }
    
        let imageUrl = "";
    
        // upload image to Cloudinary if provided
        if (imageFile) {
            try {
            // convert buffer to base64 for cloudinary
                const base64Image = `data:${imageFile.mimetype};base64,${imageFile.buffer.toString(
                    "base64"
                )}`;
    
                const uploadResponse = await cloudinary.uploader.upload(base64Image, {
                    folder: "social_media_posts",
                    resource_type: "image",
                    transformation: [
                    { width: 800, height: 600, crop: "limit" },
                    { quality: "auto" },
                    { format: "auto" },
                    ],
                });
                imageUrl = uploadResponse.secure_url;
            } catch (uploadError) {
                res.status(400).json({ error: "Failed to upload image" });
                return
            }
        }
    
        const post = await Post.create({
            user: user._id,
            content: content || "", 
            image: imageUrl,
        });
    
        res.status(201).json({ post });
    } catch (error:any) {
        res.status(500).json({
            message: `Error Creating Post:${error}`
        })
    }
}