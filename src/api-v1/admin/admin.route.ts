import { Router } from "express";

import attendance from "./attendance/attendance.route";
import events from "./events/events.route";
import ranks from "./ranks/ranks.route";
import factors from "./factors/factors.route";
import userManagement from "./user-management/user-management.route";
import eventByPhase from "./event-by-phase/event-by-phase.route";

import { validateAdmin } from "../../middlewares/validateAdmin"

const admin: Router = Router();

admin.use(validateAdmin)

// Retrieve all Users
admin.use("/attendance", attendance);
admin.use("/events", events);
admin.use("/ranks", ranks);
admin.use("/factors", factors);
admin.use("/user-management", userManagement);
admin.use("/event-by-phase", eventByPhase);

export default admin;
