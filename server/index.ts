import "dotenv/config";

import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/Auth";
const app = express();
app.use(cors({
    origin: process.env.CLIENT_URI ? process.env.CLIENT_URI : "*",
    credentials: true
}))

app.use(express.json());
app.use(cookieParser());
app.use("/auth",authRouter);

app.get("health",(req:Request,res:Response)=>{
    return res.status(200).json({message:"Healthy",Time:Date.now()});
})
app.listen(8000, () => {
    console.log("hello i am from backend");
})