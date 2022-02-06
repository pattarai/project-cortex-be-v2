import { Router } from "express";
import CommonViewController from "./commonView.controller";
import RanksController from "./ranks.controller";
import AttendanceController from "./attendance.controller";

const users: Router = Router();
const commonViewController = new CommonViewController();
const ranksController = new RanksController();
const attendanceController = new AttendanceController();

// Retrieve all Users
users.get("/commonView", commonViewController.getUsers);
users.route("/ranks").get(ranksController.getAllRanks).post(ranksController.getUserRanks);
users.get("/attendance", attendanceController.getAttendance);

export default users;
