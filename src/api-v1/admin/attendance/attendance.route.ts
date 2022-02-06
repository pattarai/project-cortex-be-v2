import { Router } from "express";
import AttendanceController from "./attendance.controller";

const attendance: Router = Router();
const attendanceController = new AttendanceController();

attendance
    .route("/")
    .get(attendanceController.getAttendance)


export default attendance;