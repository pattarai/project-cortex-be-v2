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
        this.getAttendance = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // const { userId, phase } = req.body;
                const userId = res.locals.user.userId;
                const phase = res.locals.user.currentPhase;
                const requestedPhaseEvents = yield prismaClient_1.default.attendance.findMany({
                    where: {
                        userId,
                        events: {
                            phase,
                        },
                    },
                    select: {
                        eventId: true,
                        status: true,
                        events: {
                            select: {
                                eventName: true,
                            },
                        },
                    },
                });
                const absentCount = yield prismaClient_1.default.attendance.count({
                    where: {
                        status: 0,
                        userId,
                        events: {
                            phase,
                        },
                    },
                });
                const presentCount = yield prismaClient_1.default.attendance.count({
                    where: {
                        status: 1,
                        userId,
                        events: {
                            phase,
                        },
                    },
                });
                const informedCount = yield prismaClient_1.default.attendance.count({
                    where: {
                        status: 2,
                        userId,
                        events: {
                            phase,
                        },
                    },
                });
                const statusCount = [absentCount, presentCount, informedCount];
                return res.status(200).json({
                    success: true,
                    requestedPhaseEvents,
                    statusCount,
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
exports.default = AttendanceController;
//# sourceMappingURL=attendance.controller.js.map