"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const attendance_route_1 = require("./attendance/attendance.route");
const events_route_1 = require("./events/events.route");
const ranks_route_1 = require("./ranks/ranks.route");
const factors_route_1 = require("./factors/factors.route");
const user_management_route_1 = require("./user-management/user-management.route");
const event_by_phase_route_1 = require("./event-by-phase/event-by-phase.route");
const validateAdmin_1 = require("../../middlewares/validateAdmin");
const admin = (0, express_1.Router)();
admin.use(validateAdmin_1.validateAdmin);
// Retrieve all Users
admin.use("/attendance", attendance_route_1.default);
admin.use("/events", events_route_1.default);
admin.use("/ranks", ranks_route_1.default);
admin.use("/factors", factors_route_1.default);
admin.use("/user-management", user_management_route_1.default);
admin.use("/event-by-phase", event_by_phase_route_1.default);
exports.default = admin;
//# sourceMappingURL=admin.route.js.map