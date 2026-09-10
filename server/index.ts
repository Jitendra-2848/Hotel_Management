import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

const app = express();
app.use(cors({
    origin: process.env.CLIENT_URI ? process.env.CLIENT_URI : "*",
    credentials: true
}))

app.listen(8000, () => {
    console.log("hello i am from backend");
})