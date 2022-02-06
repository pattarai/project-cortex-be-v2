import { Router } from "express";
import attendance from "./attendance/attendance.route";
import commonView from "./common-view/common-view.route";
import completeProfile from "./complete-profile/complete-profile.route";
import ranks from "./ranks/ranks.route";

import * as fileUpload from "express-fileupload";

const users: Router = Router();

users.use(fileUpload());
// Retrieve all Users
users.use("/common-view", commonView);
users.use("/ranks", ranks);
users.use("/attendance", attendance);
users.use("/complete-profile", completeProfile);

export default users;
