import { Router } from "express";
import attendance from "./attendance/attendance.route";
import commonView from "./common-view/common-view.route";
import completeProfile from "./complete-profile/complete-profile.route";
import ranks from "./ranks/ranks.route";
import profile from "./profile/profile.route";

const users: Router = Router();

// Retrieve all Users
users.use("/common-view", commonView);
users.use("/ranks", ranks);
users.use("/attendance", attendance);
users.use("/complete-profile", completeProfile);
users.use("/profile", profile);

export default users;
