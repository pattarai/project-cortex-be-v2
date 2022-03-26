"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const prismaClient_1 = require("../../../helpers/prismaClient");
class EventsController {
    constructor() {
        this.getEventsByPhase = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { phase } = req.body;
                const eventList = yield prismaClient_1.default.events.findMany({
                    where: { phase: Number(phase) },
                    select: {
                        eventId: true,
                        eventName: true,
                        eventDate: true,
                        eventType: true,
                        conductedBy: true,
                        speaker: true,
                        phase: true,
                    },
                });
                let data = eventList.map((event) => {
                    let date = new Date(event.eventDate);
                    let eventDate = date.getFullYear() +
                        "-" +
                        (date.getMonth() + 1) +
                        "-" +
                        date.getDate() +
                        " " +
                        date.getHours() +
                        ":" +
                        date.getMinutes() +
                        ":" +
                        date.getSeconds();
                    const phase = event.phase;
                    return {
                        eventId: event.eventId,
                        eventName: event.eventName,
                        eventDate: eventDate,
                        eventType: event.eventType,
                        conductedBy: event.conductedBy,
                        speaker: event.speaker,
                        phase: phase,
                    };
                });
                console.log(data);
                return res.status(200).json({
                    message: "Success",
                    data,
                });
            }
            catch (e) {
                console.error(e);
                res.status(500).send({
                    success: false,
                    message: e.toString(),
                });
            }
        });
    }
}
exports.default = EventsController;
//# sourceMappingURL=event-by-phase.controller.js.map