"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const events_controller_1 = require("./events.controller");
const events = (0, express_1.Router)();
const eventsController = new events_controller_1.default();
events
    .route("/")
    .get(eventsController.getEvents)
    .post(eventsController.postEvent)
    .delete(eventsController.deleteEvent)
    .patch(eventsController.patchEvent);
exports.default = events;
//# sourceMappingURL=events.route.js.map