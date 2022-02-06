import { Router } from "express";
import CommonViewController from "./commonView.controller";
import RanksController from "./ranks.controller";
import AttendanceController from "./attendance.controller";
import CompleteProfileController from "./completeProfile.controller";

const users: Router = Router();
const commonViewController = new CommonViewController();
const ranksController = new RanksController();
const attendanceController = new AttendanceController();
const completeProfileController = new CompleteProfileController();

// Retrieve all Users
users.get("/commonView", commonViewController.getUsers);
users.route("/ranks").get(ranksController.getAllRanks).post(ranksController.getRankDetails);
users.get("/attendance", attendanceController.getAttendance);
users.route("/completeProfile").get(completeProfileController.completeProfileGet).patch(completeProfileController.completeProfilePatch);

export default users;
