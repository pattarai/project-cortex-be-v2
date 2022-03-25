"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_management_controller_1 = require("./user-management.controller");
const users = (0, express_1.Router)();
const userManagementController = new user_management_controller_1.default();
users
    .route("/")
    .get(userManagementController.getUser)
    .post(userManagementController.createUser)
    .patch(userManagementController.updateUser)
    .delete(userManagementController.deleteUser);
exports.default = users;
//# sourceMappingURL=user-management.route.js.map