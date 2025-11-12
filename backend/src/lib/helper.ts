import path from 'path'
import DataUriParser from 'datauri/parser.js'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const generateToken = (userId : string) => {
    const token = jwt.sign({id:userId},process.env.JWT_SECRET as string,{
        expiresIn:'7d'
    });
    return token;
}

export const verifyToken = (token : any) => {
    return jwt.verify(token,process.env.JWT_SECRET as string)
}

// const parser = new DataUriParser();

// export const getDataUri = (file : File) => {
//     const extName = path.extname(file.originalname);
//     return parser.format(extName, file.buffer);
// };