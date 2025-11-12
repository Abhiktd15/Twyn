import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minLength:6
    },
    profilePic:{
        type:String,
        default:""
    },
    bannerImg:{
        type:String,
        default:""
    },
    bio:{
        type:String,
        default:""
    },
    location:{
        type:String,
        default:""
    }, 
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]

},{
    timestamps:true
})

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    next();
});


const User = mongoose.model("User",userSchema)

export default User;