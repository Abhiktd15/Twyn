import type { Request, Response } from 'express'
import User from '../models/user.model.js'
import { generateToken } from '../lib/helper.js';

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
                bio:newUser.bio,
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

export const getUserProfile = async (req : Request,res:Response) : Promise<void> => {
    try {
        const {username } = req.params

        const user = await User.findOne({username})
        if(!user) { 
            res.status(404).json({
                message: "User not found"
            })
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
