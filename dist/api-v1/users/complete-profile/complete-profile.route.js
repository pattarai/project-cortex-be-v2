"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const complete_profile_controller_1 = require("./complete-profile.controller");
const fileUpload = require("express-fileupload");
const completeProfile = (0, express_1.Router)();
const completeProfileController = new complete_profile_controller_1.default();
completeProfile.use(fileUpload());
completeProfile
    .route("/")
    .get(completeProfileController.completeProfileGet)
    .patch(completeProfileController.completeProfilePatch);
exports.default = completeProfile;
//# sourceMappingURL=complete-profile.route.js.map