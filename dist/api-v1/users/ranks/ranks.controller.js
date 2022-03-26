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
class RankController {
    constructor() {
        this.getAllRanks = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // get current phase
                const currentPhase = yield prismaClient_1.default.factors.aggregate({
                    _max: {
                        phase: true,
                    },
                });
                // total score calculation for each user
                const sum = yield prismaClient_1.default.ranking.groupBy({
                    by: ["userId"],
                    where: {
                        factors: {
                            phase: currentPhase._max.phase,
                        },
                    },
                    _sum: {
                        score: true,
                    },
                });
                // current phase total threshold score calculation
                const totalMaxscore = yield prismaClient_1.default.factors.groupBy({
                    by: ["phase"],
                    where: {
                        phase: currentPhase._max.phase,
                    },
                    _sum: {
                        maxScore: true,
                    },
                });
                // get user details
                const userDetails = yield prismaClient_1.default.ranking.findMany({
                    select: {
                        userId: true,
                        users: {
                            select: {
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                });
                // FORMULA : (sum(score) / sum(maxScore)) * 10
                const totalScore = sum.map((item) => {
                    const total = parseFloat(Math.abs((item._sum.score / totalMaxscore[0]._sum.maxScore) * 10).toPrecision(3));
                    return Object.assign(Object.assign({}, item), { total });
                });
                // sort by total score in descending order
                totalScore.sort((a, b) => b.total - a.total);
                // 7.5 >="DIAMOND", 6.5 >="GOLD", 5.5 >="SILVER", 4.5 >="BRONZE", 0 >"COPPER"
                const rankDetails = totalScore.map((item) => {
                    if (item.total >= 7.5) {
                        return Object.assign(Object.assign(Object.assign({}, item), userDetails.find((user) => user.userId === item.userId)), { league: "DIAMOND" });
                    }
                    else if (item.total >= 6.5) {
                        return Object.assign(Object.assign(Object.assign({}, item), userDetails.find((user) => user.userId === item.userId)), { league: "GOLD" });
                    }
                    else if (item.total >= 5.5) {
                        return Object.assign(Object.assign(Object.assign({}, item), userDetails.find((user) => user.userId === item.userId)), { league: "SILVER" });
                    }
                    else if (item.total >= 4.5) {
                        return Object.assign(Object.assign(Object.assign({}, item), userDetails.find((user) => user.userId === item.userId)), { league: "BRONZE" });
                    }
                    else {
                        return Object.assign(Object.assign(Object.assign({}, item), userDetails.find((user) => user.userId === item.userId)), { league: "COPPER" });
                    }
                });
                return res.status(200).json({
                    message: "Success",
                    data: rankDetails,
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
        this.getUserRanks = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.body;
                // get all distinct phases
                const phase = yield prismaClient_1.default.factors.findMany({
                    distinct: ["phase"],
                    select: {
                        phase: true,
                    },
                });
                // get totalsum of scores for each phase
                const totalSum = yield Promise.all(phase.map((item) => __awaiter(this, void 0, void 0, function* () {
                    const total = yield prismaClient_1.default.ranking.aggregate({
                        where: {
                            userId,
                            factors: {
                                phase: item.phase,
                            },
                        },
                        _sum: {
                            score: true,
                        },
                    });
                    return total;
                })));
                //threshold score calculation for each phase
                const maxScore = yield Promise.all(phase.map((item) => __awaiter(this, void 0, void 0, function* () {
                    const total = yield prismaClient_1.default.factors.aggregate({
                        where: {
                            phase: item.phase,
                        },
                        _sum: { maxScore: true },
                    });
                    return total;
                })));
                // FORMULA : (sum(score) / sum(maxScore)) * 10
                const totalScoreByPhase = totalSum.map((item, index) => {
                    let total = 0;
                    maxScore.forEach((max, keyy) => {
                        if (index === keyy) {
                            total = parseFloat(Math.abs((item._sum.score / max._sum.maxScore) * 10).toPrecision(3));
                        }
                    });
                    return total;
                });
                const userDetails = yield prismaClient_1.default.ranking.findMany({
                    where: {
                        userId,
                    },
                    select: {
                        score: true,
                        factors: {
                            select: {
                                phase: true,
                                factorName: true,
                                maxScore: true,
                            },
                        },
                    },
                });
                userDetails.sort((a, b) => b.factors.phase - a.factors.phase);
                return res.status(200).json({
                    message: "Success",
                    data: { userDetails, totalScoreByPhase },
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
exports.default = RankController;
//# sourceMappingURL=ranks.controller.js.map