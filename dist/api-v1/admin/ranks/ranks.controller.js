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
class RanksController {
    constructor() {
        this.getRanks = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const ranks = yield prismaClient_1.default.ranking.findMany({
                    select: {
                        factors: true,
                        userId: true,
                        score: true,
                        users: {
                            select: {
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                });
                return res.status(200).json({
                    message: "Success",
                    ranks,
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
        this.patchRanks = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { crewScore } = req.body;
                let crewScoreList = [];
                yield prismaClient_1.default.$transaction((crewScoreList = crewScore.map((user) => prismaClient_1.default.ranking.updateMany({
                    where: { factorId: user.factorId, userId: user.userId },
                    data: { score: user.score },
                }))));
                return res.status(200).json({
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
    }
}
exports.default = RanksController;
//# sourceMappingURL=ranks.controller.js.map