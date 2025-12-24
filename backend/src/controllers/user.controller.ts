import type { Request, Response } from 'express'
import User from '../models/user.model.js'
import { generateToken } from '../lib/helper.js';
import bcrypt from 'bcryptjs';
import Notification from '../models/notification.model.js';

export const register = async (req : Request,res:Response) : Promise<void> => {
    try {
        const {username,email,password} = req.body;
        if(!username || !email || !password){
            res.status(400).json({
                message: "All fields are required"
            })
            return
        }
        if(password.toString().length < 6){
            res.status(400).json({
                message: "Password must be at least 6 characters"
            })
            return
        }
        const userExists = await User.findOne({$or : [{username},{email}]})
        if(userExists){
            res.status(400).json({
                message: "User already exists"
            })
            return
        }

        const newUser = new User({username,email,password});
        await newUser.save();

        // generate jwt token
        const token = generateToken(newUser._id.toString());

        res.status(201).json({
            message:'User registered successfully',
            user:{
                id:newUser._id,
                username:newUser.username,
                email:newUser.email,
                profilePic:newUser.profilePic,
                bannerImg:newUser.bannerImg,
                bio:newUser.bio,
                location:newUser.location,
                followers:newUser.followers,
                following:newUser.following,
                createdAt:newUser.createdAt
            },
            token
        });
    } catch (error : any) {
        res.status(500).json({
            message: `Error Registering User:${error.message}`,
            });
    }
}

export const login = async (req : Request,res:Response) : Promise<void> => {
    try {
        const {email_or_username,password} = req.body
        if(!email_or_username || !password){
            res.status(400).json({
                message: "All fields are required"
            })
            return
        }
        const user = await User.findOne({
            $or:[
                {username:email_or_username},
                {email:email_or_username}
            ]
        })
        if(!user){
            res.status(400).json({
                message: "Invalid Credentials"
            })
            return
        }
        const isPasswordValid = await bcrypt.compare(password,user.password)
        if(!isPasswordValid){
            res.status(400).json({
                message: "Invalid Credentials"
            })
            return
        }

        // generate jwt token
        const token = generateToken(user._id.toString());

        res.status(200).json({
            message:'User logged in successfully',
            user:{
                id:user._id,
                username:user.username,
                email:user.email,
                profilePic:user.profilePic,
                bannerImg:user.bannerImg,
                bio:user.bio,
                location:user.location,
                followers:user.followers,
                following:user.following,
                createdAt:user.createdAt
            },
            token
        });

    } catch (error : any) {
        res.status(500).json({
            message: `Error Logging In User:${error.message}`,
            });
    }
}

export const getUserProfile = async (req : Request,res:Response) : Promise<void> => {
    try {
        const {username } = req.params

        const user = await User.findOne({username}).select("-password")
        if(!user) { 
            res.status(404).json({
                message: "User not found"
            })
            return
        }

        res.status(200).json({
            message: 'User Profile Found!',
            user
        })
        
    } catch (error : any) {
        res.status(500).json({
            message: `Error Finding User Profile:${error.message}`,
            });
    }
}

export const getCurrentUser = async (req : Request,res:Response) : Promise<void> => {
    try {
        const userId = (req as any).user._id
        const user = await User.findById(userId).select("-password")
        if(!user) { 
            res.status(404).json({
                message: "User not found"
            })
            return 
        }
        res.status(200).json({
            message: 'User Found!',
            user
        })
    } catch (error :any) {
        res.status(500).json({
            message: `Error Getting Current User:${error.message}`,
            });
    }
}

export const updateProfile = async (req : Request,res:Response) : Promise<void> => {
    try {
        const userId = (req as any).user._id
        const user = await User.findOneAndUpdate({_id:userId},req.body,{
            new:true
        }).select("-password")
        if(!user) { 
            res.status(404).json({
                message: "User not found"
            })
            return 
        }
        res.status(200).json({
            message: 'User Profile Updated!',
            user
        })
    } catch (error :any) {
        res.status(500).json({
            message: `Error updating user profile:${error.message}`,
        });
    }
}

export const followUser = async (req : Request,res:Response) : Promise<void> => {
    try {
        const {targetUserId} = req.params 
        const userId = (req as any).user._id
        if(userId === targetUserId){
            res.status(400).json({
                message: "You cannot follow yourself"
            })
            return
        }
        const currUser = await User.findById(userId)
        const targetUser = await User.findById(targetUserId)
        if(!currUser || !targetUser){
            res.status(404).json({
                message: "User not found"
            })
            return
        }

        const isFollowing = currUser.following.includes(targetUserId as any)
        if(isFollowing){
            //unfollow
            await User.findByIdAndUpdate(currUser._id, {
                $pull: { following: targetUserId },
            });
            await User.findByIdAndUpdate(targetUserId, {
                $pull: { followers: currUser._id },
            });
        }else{
            //follow
            await User.findByIdAndUpdate(currUser._id,{
                $push:{following:targetUserId}
            })
            await User.findByIdAndUpdate(targetUserId,{
                $push:{followers:currUser._id}
            })
        }

        //create a notification
        await Notification.create({
            from:currUser._id,
            to:targetUserId,
            type:"follow"
        })
        
        res.status(200).json({
            message: isFollowing ? "User unfollowed successfully" : "User followed successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: `Error Following User:${error}`,
        });
    }
}
// export const getUserProfile = async (req : Request,res:Response) : Promise<void> => {
//     try {
//         const {username } = req.params

//         const user = await User.findOne({username})
//         if(!user) { 
//             res.status(404).json({
//                 message: "User not found"
//             })
//         }

//         res.status(200).json({
//             message: 'User Profile Found!',
//             user
//         })
        
//     } catch (error : any) {
//         res.status(500).json({
//             message: `Error Finding User Profile:${error.message}`,
//             });
//     }
// }
