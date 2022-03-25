"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_route_1 = require("./users/users.route");
const admin_route_1 = require("./admin/admin.route");
const auth_route_1 = require("./auth/auth.route");
const router = (0, express_1.Router)();
router.use("/users", users_route_1.default);
router.use("/admin", admin_route_1.default);
router.use("/auth", auth_route_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map