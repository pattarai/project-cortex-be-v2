"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profile_controller_1 = require("./profile.controller");
const profile = (0, express_1.Router)();
const profileController = new profile_controller_1.default();
profile
    .route("/")
    .get(profileController.getProfile)
    .patch(profileController.profilePatch);
exports.default = profile;
//# sourceMappingURL=profile.route.js.map