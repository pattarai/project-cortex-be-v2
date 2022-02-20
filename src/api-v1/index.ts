import { Router } from "express";

import users from "./users/users.route";
import admin from "./admin/admin.route";
import auth from "./auth/auth.route";

const router: Router = Router();

router.use("/users", users);
router.use("/admin", admin);
router.use("/auth", auth);

export default router;
