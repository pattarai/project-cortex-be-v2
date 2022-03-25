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
class AttendanceController {
    constructor() {
        // Get all Attendance
        this.getAttendance = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { eventName, eventType, eventDate } = req.body;
                const date = new Date(eventDate);
                const newDate = date.setDate(date.getDate() + 1);
                const eventId = yield prismaClient_1.default.events.findFirst({
                    where: {
                        eventName,
                        eventType,
                        eventDate: new Date(newDate),
                    },
                    select: {
                        eventId: true,
                    },
                });
                const attendance = yield prismaClient_1.default.events.findFirst({
                    where: { eventId: Number(eventId.eventId) },
                    select: {
                        attendance: {
                            select: {
                                userId: true,
                                eventId: true,
                                status: true,
                                users: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                    },
                                },
                            },
                        },
                        external_attendance: {
                            select: {
                                externalId: true,
                                name: true,
                            },
                        },
                    },
                });
                //Check if attendance exists
                if (attendance.attendance.length > 0) {
                    return res.status(200).json({
                        message: "Success",
                        crewAttendance: attendance.attendance,
                        externalAttendance: attendance.external_attendance,
                        eventId: Number(eventId.eventId),
                        isExist: true,
                    });
                }
                else {
                    let userList = yield prismaClient_1.default.users.findMany({
                        select: {
                            userId: true,
                            firstName: true,
                            lastName: true,
                        },
                    });
                    const crewAttendance = userList.map((user) => {
                        const users = { firstName: user.firstName, lastName: user.lastName };
                        return {
                            userId: user.userId,
                            eventId: Number(eventId.eventId),
                            status: 1,
                            users,
                        };
                    });
                    return res.status(200).json({
                        message: "Success",
                        crewAttendance,
                        isExist: false,
                        eventId: Number(eventId.eventId),
                    });
                }
            }
            catch (e) {
                console.error(e);
                res.status(500).send({
                    success: false,
                    message: e.toString(),
                });
            }
        });
        // Insert Attendance
        this.addAttendance = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { crewAttendance, externalAttendance } = req.body;
                const newCrewAttendance = crewAttendance.map((attendance) => {
                    return {
                        userId: attendance.userId,
                        eventId: attendance.eventId,
                        status: attendance.status,
                    };
                });
                const crewattendance = yield prismaClient_1.default.attendance.createMany({
                    data: [...newCrewAttendance],
                });
                let externalAttendanceList = [];
                if (externalAttendance.length > 0) {
                    externalAttendanceList = yield prismaClient_1.default.external_attendance.createMany({
                        data: [...externalAttendance],
                    });
                }
                return res.status(200).json({
                    success: true,
                    crewattendance,
                    externalAttendanceList,
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
        //Update Attendance
        this.updateAttendance = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { crewAttendance } = req.body;
                let crewAttendanceList = [];
                yield prismaClient_1.default.$transaction((crewAttendanceList = crewAttendance.map((user) => prismaClient_1.default.attendance.updateMany({
                    where: { eventId: user.eventId, userId: user.userId },
                    data: { status: user.status },
                }))));
                res.status(200).send({
                    success: true,
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
        // Delete Attendance
        this.deleteAttendance = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { externalId } = req.body;
                const externalList = yield prismaClient_1.default.external_attendance.delete({
                    where: { externalId },
                });
                return res.status(200).json({ success: true, externalList });
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
exports.default = AttendanceController;
//# sourceMappingURL=attendance.controller.js.map