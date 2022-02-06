import { Router } from "express";
import AttendanceController from "./attendance.controller";
import EventsController from "./events.controller";

const admin: Router = Router();
const attendanceController = new AttendanceController();
const eventsController = new EventsController();

// Retrieve all Users
admin.route("/attendance").get(attendanceController.getAttendance);
admin.route("/events").get(eventsController.getEvents);

export default admin;
