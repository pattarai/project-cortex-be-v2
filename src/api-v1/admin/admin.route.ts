import { Router } from "express";
import AttendanceController from "./attendance.controller";
import EventsController from "./events.controller";

const users: Router = Router();
const attendanceController = new AttendanceController();
const eventsController = new EventsController();

// Retrieve all Users
users.route("/attendance").get(attendanceController.getAttendance);
users.route("/events").get(eventsController.getEvents);

export default users;
