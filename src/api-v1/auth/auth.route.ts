import { Router } from "express";
import AuthController from "./auth.controller";

const auth: Router = Router();
const authController = new AuthController()

auth.route("/login").post(authController.login);

export default auth;