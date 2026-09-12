import "dotenv/config";

import express, {type Request,type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/Auth.ts";
const app = express();
app.use(cors({
    origin: process.env.CLIENT_URI ? process.env.CLIENT_URI : "http://localhost:3000",
    credentials: true 
}))

app.use(express.json());
app.use(cookieParser());
app.use("/auth",authRouter);

app.get("/health",(req:Request,res:Response)=>{
    console.log("hello");
    return res.status(200).json({message:"Healthy",Time:Date.now()});
})
app.listen(8000, () => {
    console.log("hello i am from backend");
})