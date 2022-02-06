import { Router } from "express";
import CommonViewController from "./commonView.controller";

const users: Router = Router();
const commonViewController = new CommonViewController();

// Retrieve all Users
users.get("/commonView", commonViewController.getUsers);

export default users;
