import { Router } from "express";
import AttendanceController from "./attendance.controller";
import EventsController from "./events.controller";
import RanksController from "./ranks.controller";

const admin: Router = Router();
const attendanceController = new AttendanceController();
const eventsController = new EventsController();
const ranksController = new RanksController();

// Retrieve all Users
admin.route("/attendance").get(attendanceController.getAttendance);
admin.route("/events").get(eventsController.getEvents);
admin.route("/ranks").get(ranksController.getRanks);


export default admin;
