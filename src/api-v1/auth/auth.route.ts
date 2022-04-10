import { Router } from "express";
import AuthController from "./auth.controller";
import { validateUser } from "../../middlewares/validateUser"

const auth: Router = Router();
const authController = new AuthController()

auth.get("/", validateUser, authController.checkUser);
auth.post("/login", authController.login)
auth.post("/forgot-password", authController.forgotPassword)
auth.post("/update-password", authController.updatePassword)

export default auth;