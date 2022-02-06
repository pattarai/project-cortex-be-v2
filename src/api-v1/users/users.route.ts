import { Router } from "express";
import CommonViewController from "./commonView.controller";
import RanksController from "./ranks.controller";

const users: Router = Router();
const commonViewController = new CommonViewController();
const ranksController = new RanksController();

// Retrieve all Users
users.get("/commonView", commonViewController.getUsers);
users.route("/ranks").get(ranksController.getAllRanks).post(ranksController.getUserRanks);

export default users;
