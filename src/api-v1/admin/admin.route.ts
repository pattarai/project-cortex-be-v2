import { Router } from "express";
import AttendanceController from "./attendance.controller";

const admin: Router = Router();
const attendanceController = new AttendanceController();

// Retrieve all Users
admin.route("/attendance").get(attendanceController.getAttendance);

export default admin;
