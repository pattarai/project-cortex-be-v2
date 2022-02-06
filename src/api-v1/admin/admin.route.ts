import { Router } from "express";

import attendance from "./attendance/attendance.route";
import events from "./events/events.route";
import ranks from "./ranks/ranks.route";

const admin: Router = Router();

// Retrieve all Users
admin.use("/attendance", attendance);
admin.use("/events", events);
admin.use("/ranks", ranks);


export default admin;
