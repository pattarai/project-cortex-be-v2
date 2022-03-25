"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const factors_controller_1 = require("./factors.controller");
const factors = (0, express_1.Router)();
const factorsController = new factors_controller_1.default();
factors
    .route("/")
    .get(factorsController.getFactors)
    .post(factorsController.postFactors)
    .patch(factorsController.patchFactors)
    .delete(factorsController.deleteFactors);
exports.default = factors;
//# sourceMappingURL=factors.route.js.map