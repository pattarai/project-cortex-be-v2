"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const attendance_route_1 = require("./attendance/attendance.route");
const common_view_route_1 = require("./common-view/common-view.route");
const complete_profile_route_1 = require("./complete-profile/complete-profile.route");
const ranks_route_1 = require("./ranks/ranks.route");
const profile_route_1 = require("./profile/profile.route");
const validateUser_1 = require("../../middlewares/validateUser");
const users = (0, express_1.Router)();
users.use(validateUser_1.validateUser);
// Retrieve all Users
users.use("/common-view", common_view_route_1.default);
users.use("/ranks", ranks_route_1.default);
users.use("/attendance", attendance_route_1.default);
users.use("/complete-profile", complete_profile_route_1.default);
users.use("/profile", profile_route_1.default);
exports.default = users;
//# sourceMappingURL=users.route.js.map