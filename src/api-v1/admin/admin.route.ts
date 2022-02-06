import { Router } from "express";
import AttendanceController from "./attendance.controller";

const users: Router = Router();
const attendanceController = new AttendanceController();

// Retrieve all Users
users.route("/attendance").get(attendanceController.getAttendance);

export default users;
