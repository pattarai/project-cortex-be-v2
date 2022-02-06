import { Router } from "express";

import attendance from "./attendance/attendance.route";
import events from "./events/events.route";
import ranks from "./ranks/ranks.route";
import userManagement from "./user-management/user-management.route";

const admin: Router = Router();

// Retrieve all Users
admin.use("/attendance", attendance);
admin.use("/events", events);
admin.use("/ranks", ranks);
admin.use("/user-management", userManagement);

export default admin;
