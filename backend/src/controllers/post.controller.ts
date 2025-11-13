import type { Request, Response } from 'express'
import Post from '../models/post.model.js'
import User from '../models/user.model.js'
import '../models/comment.model.js' // Import for Mongoose model registration
import cloudinary from '../lib/cloudinary.js'
import Comment from '../models/comment.model.js'

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

export const getPostByID = async (req:Request,res:Response) : Promise<void> => {
    try {
        const {postId} = req.params
        const post = await Post.findById(postId)
        .populate("user", "username fullName profilePic")
        .populate({
            path:'comments',
            populate:{
                path:'user',
                select:'username fullName profilePic'
            }
        })
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
        if(content.length > 999){
            res.status(400).json({
                message:"Post content is too long, Its should be less than 1000 characters"
            })
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

export const likePost = async (req:Request,res:Response) : Promise<void> => {
    try {
        const {postId} = req.params
        const userId = (req as any).user._id
        const post = await Post.findById(postId)
        if(!post){
            res.status(404).json({
                message: "Post not found"
            })
            return
        }
        const isLiked = post.likes.includes(userId as any)
        if(isLiked){
            await Post.findByIdAndUpdate(postId,{
                $pull:{likes:userId}
            })
        }else{
            await Post.findByIdAndUpdate(postId,{
                $push:{likes:userId}
            })
        }
        res.status(200).json({
            message: isLiked ? "Post unliked successfully" : "Post liked successfully",
        });
    } catch (error:any) {
        res.status(500).json({
            message: `Error Creating Post:${error}`
        })
    }
}

export const deletePost = async (req:Request,res:Response) : Promise<void> => {
    try {
        const {postId} = req.params
        const userId = (req as any).user._id
        const post = await Post.findById(postId)
        if(!post){
            res.status(404).json({
                message: "Post not found"
            })
            return
        }
        const user = await User.findById(userId)
        if(!user){
            res.status(404).json({
                message: "User not found"
            })
            return
        }

        if(post.user.toString() != userId){
            res.status(401).json({
                message: "You are not authorized to delete this post"
            })
            return
        }
        //Delete all comments 
        await Comment.deleteMany({post:postId})
        //Delete the post
        await Post.findByIdAndDelete(postId)
        
        res.status(200).json({
            message: "Post deleted successfully"
        })
    } catch (error:any) {
        res.status(500).json({
            message: `Error Creating Post:${error}`
        })
    }
}