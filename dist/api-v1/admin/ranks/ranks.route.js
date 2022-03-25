"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ranks_controller_1 = require("./ranks.controller");
const ranks = (0, express_1.Router)();
const ranksController = new ranks_controller_1.default();
ranks
    .route("/")
    .get(ranksController.getRanks)
    .patch(ranksController.patchRanks);
exports.default = ranks;
//# sourceMappingURL=ranks.route.js.map