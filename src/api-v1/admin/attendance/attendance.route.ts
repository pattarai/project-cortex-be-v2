import { Router } from "express";
import AttendanceController from "./attendance.controller";

const attendance: Router = Router();
const attendanceController = new AttendanceController();

attendance
  .route("/")
  .post(attendanceController.addAttendance)
  .patch(attendanceController.updateAttendance)
  .delete(attendanceController.deleteAttendance);

attendance.route("/get").post(attendanceController.getAttendance);

export default attendance;
