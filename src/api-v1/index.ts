import { Router } from "express";

import users from "./users/users.route";
import admin from "./admin/admin.route";

const router: Router = Router();

router.use("/users", users);
// router.use("/admin", admin);

export default router;
