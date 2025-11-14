import type { Request,Response } from "express";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

export const getNotifications = async (req:Request,res:Response) : Promise<void> => {
    try {
        const userId = (req as any).user._id
        const user = await User.findById(userId)
        if(!user){
            res.status(404).json({
                message: "User not found"
            })
            return
        }
        const notifications = await Notification.find({to:user._id})
        .sort({createdAt:-1})
        .populate("from","fullName username profilePic")
        .populate("post","content image")
        .populate("comment","content")

        res.status(200).json({
            message: 'Notifications Found!',
            notifications
        })
    } catch (error:any) {
        res.status(500).json({
            message: `Error Getting Notifications:${error}`
        })
    }
}

export const deleteNotification = async (req:Request,res:Response) : Promise<void> => {
    try {
        const {notificationId} = req.params
        const userId = (req as any).user._id
        const user = await User.findById(userId)
        if(!user){
            res.status(404).json({
                message: "User not found"
            })
            return
        }
        const notification = await Notification.findOneAndDelete({
            _id:notificationId,
            to:user._id
        })
        if(!notification){
            res.status(404).json({
                message: "Notification not found"
            })
            return
        }
        
        res.status(200).json({
            message: "Notification deleted successfully"
        })

    } catch (error:any) {
        res.status(500).json({
            message: `Error Deleting Notification:${error}`
        })
    }
}