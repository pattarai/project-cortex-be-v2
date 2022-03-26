"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const validateUser_1 = require("../../middlewares/validateUser");
const auth = (0, express_1.Router)();
const authController = new auth_controller_1.default();
auth.get("/", validateUser_1.validateUser, authController.checkUser);
auth.post("/login", authController.login);
exports.default = auth;
//# sourceMappingURL=auth.route.js.map