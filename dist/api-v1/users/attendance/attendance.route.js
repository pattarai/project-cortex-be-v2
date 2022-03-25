"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const attendance_controller_1 = require("./attendance.controller");
const attendance = (0, express_1.Router)();
const attendanceController = new attendance_controller_1.default();
attendance.route("/").post(attendanceController.getAttendance);
exports.default = attendance;
//# sourceMappingURL=attendance.route.js.map