import express from "express";
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from "./utils/db.ts";
dotenv.config()

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello from TypeScript + Express backend!");
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on ${PORT}`);
    connectDB()
});
