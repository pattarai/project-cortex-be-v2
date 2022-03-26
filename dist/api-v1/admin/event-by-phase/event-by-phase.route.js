"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const event_by_phase_controller_1 = require("./event-by-phase.controller");
const events = (0, express_1.Router)();
const eventsController = new event_by_phase_controller_1.default();
events.route("/").post(eventsController.getEventsByPhase);
exports.default = events;
//# sourceMappingURL=event-by-phase.route.js.map