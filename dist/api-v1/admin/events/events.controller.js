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
        this.getEvents = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const currentPhase = yield prismaClient_1.default.events.aggregate({
                    _max: {
                        phase: true,
                    },
                });
                const eventList = yield prismaClient_1.default.events.findMany({
                    where: { phase: Number(currentPhase._max.phase) },
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
                const committeeList = yield prismaClient_1.default.users.findMany({
                    select: {
                        committee: true,
                    },
                    distinct: ["committee"],
                });
                const projectList = yield prismaClient_1.default.users.findMany({
                    select: {
                        project: true,
                    },
                    distinct: ["project"],
                });
                const phaseList = yield prismaClient_1.default.events.findMany({
                    distinct: ["phase"],
                    select: {
                        phase: true,
                    },
                });
                return res.status(200).json({
                    message: "Success",
                    data,
                    committeeList: committeeList.map((committee) => committee.committee),
                    projectList: projectList.map((project) => project.project),
                    phaseList: phaseList.map((phase) => phase.phase),
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
        this.postEvent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { eventName, eventType, eventDate, conductedBy, speaker, phase } = req.body;
                const _events = yield prismaClient_1.default.events.create({
                    data: {
                        eventName,
                        eventType,
                        eventDate: new Date(eventDate),
                        conductedBy,
                        speaker,
                        phase,
                    },
                });
                let date = new Date(_events.eventDate);
                let eventdate = date.getFullYear() +
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
                const data = {
                    eventId: _events.eventId,
                    eventName: _events.eventName,
                    eventType: _events.eventType,
                    eventDate: eventdate,
                    conductedBy: _events.conductedBy,
                    speaker: _events.speaker,
                    phase: _events.phase,
                };
                return res.status(200).json({
                    success: true,
                    data: data,
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
        this.deleteEvent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { eventId } = req.body;
                const eventName = yield prismaClient_1.default.events.delete({
                    where: { eventId },
                    select: {
                        eventName: true,
                        eventType: true,
                        eventDate: true,
                        speaker: true,
                        conductedBy: true,
                        phase: true,
                    },
                });
                return res.status(200).json({
                    success: true,
                    eventId,
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
        this.patchEvent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { eventId, eventName, eventType, eventDate, conductedBy, speaker, phase, } = req.body;
                const _events = yield prismaClient_1.default.events.update({
                    where: { eventId },
                    data: {
                        eventId,
                        eventName,
                        eventType,
                        eventDate: new Date(eventDate),
                        conductedBy,
                        speaker,
                        phase,
                    },
                });
                let date = new Date(_events.eventDate);
                let eventdate = date.getFullYear() +
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
                const data = {
                    eventId: _events.eventId,
                    eventName: _events.eventName,
                    eventType: _events.eventType,
                    eventDate: eventdate,
                    conductedBy: _events.conductedBy,
                    speaker: _events.speaker,
                    phase: _events.phase,
                };
                return res.json({
                    success: true,
                    data: data,
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
//# sourceMappingURL=events.controller.js.map