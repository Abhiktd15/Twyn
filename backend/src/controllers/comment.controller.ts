import type { Request, Response } from 'express'
import Comment from '../models/comment.model.js'
import User from '../models/user.model.js';
import Post from '../models/post.model.js';
import Notification from '../models/notification.model.js';

export const getComments = async (req:Request,res:Response) : Promise<void> => {
    try {
        const {postId} = req.params
        const comments = await Comment.find({ post: postId })
        .sort({ createdAt: -1 })
        .populate("user", "username fullName profilePic");

        res.status(200).json({
            message: 'Comments Found!',
            comments
        })
    } catch (error:any) {   
        res.status(500).json({
            message: `Error Getting Comments:${error}`
        })
    }
}

export const createComment = async (req:Request,res:Response) : Promise<void> => {
    try {
        const {postId} = req.params
        const userId = (req as any).user._id
        const user = await User.findById(userId)
        if(!user){
            res.status(404).json({
                message: "User not found"
            })
            return
        }
        const post = await Post.findById(postId)
        if(!post){
            res.status(404).json({
                message: "Post not found"
            })
            return
        }

        const {content} = req.body
        if(!content || content.trim() === ""){
            res.status(400).json({
                message: "Comment content is required"
            })
            return
        }
        const comment =  await Comment.create({
            user:userId,
            post:postId,
            content
        })
        await Post.findByIdAndUpdate(postId,{
            $push:{comments:comment._id}
        })

        //Create Notification if not commenting on own's post 
        if(post.user.toString() !== user._id.toString()){
            await Notification.create({
                from:user._id,
                to:post.user,
                type:"comment",
                post:postId,
                comment:comment._id
            })
        }
        res.status(201).json({
            message: 'Comment Created!',
            comment
        })
    } catch (error:any) {
        res.status(500).json({
            message: `Error Creating Comment:${error}`
        })
    }
}

export const deleteComment = async (req:Request,res:Response) : Promise<void> => {
    try {
        const {commentId} = req.params
        const userId = (req as any).user._id
        const user = await User.findById(userId)
        if(!user){
            res.status(404).json({
                message: "User not found"
            })
            return
        }
        const comment = await Comment.findById(commentId)
        if(!comment){
            res.status(404).json({
                message: "Comment not found"
            })
            return
        }
        // if(comment.user.toString() !== user._id.toString()){
        //     res.status(401).json({
        //         message: "You are not authorized to delete this comment"
        //     })
        //     return
        // }
        //delete comment from post 
        await Post.findByIdAndUpdate(comment.post,{
            $pull:{comments:commentId}
        })
        await Comment.findByIdAndDelete(commentId)
        res.status(200).json({
            message: 'Comment Deleted!',
        })
    } catch (error:any) {
        res.status(500).json({
            message: `Error Deleting Comment:${error}`
        })
    }
}