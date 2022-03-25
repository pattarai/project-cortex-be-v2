"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const common_view_controller_1 = require("./common-view.controller");
const commonView = (0, express_1.Router)();
const commonViewController = new common_view_controller_1.default();
commonView
    .route("/")
    .get(commonViewController.getUsers);
exports.default = commonView;
//# sourceMappingURL=common-view.route.js.map