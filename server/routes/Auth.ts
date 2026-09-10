import express from "express";
import { register, login, logout, Getprofile } from "../controller/Auth";
import { validate } from "../middlewares/validate";
import { registerSchema, loginSchema } from "../validators/auth.validator";
import { ValidateToken } from "../middlewares/TokenValidator";

const authRouter = express.Router();

authRouter.post("/register", validate(registerSchema), register);
authRouter.post("/login", validate(loginSchema), login);
authRouter.post("/logout", logout);
authRouter.get("/me", ValidateToken, Getprofile);

export default authRouter;