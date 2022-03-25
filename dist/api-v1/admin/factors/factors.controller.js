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
class FactorsController {
    constructor() {
        this.getFactors = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const getFactors = yield prismaClient_1.default.factors.findMany({
                    select: {
                        factorId: true,
                        factorName: true,
                        maxScore: true,
                        phase: true,
                    },
                });
                return res.status(200).json({
                    message: "Success",
                    getFactors,
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
        this.postFactors = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { factorName, maxScore, phase } = req.body;
                let userIdList = [];
                const postFactors = yield prismaClient_1.default.factors.create({
                    data: {
                        factorName,
                        phase,
                        maxScore,
                    },
                });
                console.log(postFactors);
                const getUsers = yield prismaClient_1.default.users.findMany({
                    select: {
                        userId: true,
                    },
                });
                const postRanks = yield prismaClient_1.default.$transaction((userIdList = getUsers.map((user) => prismaClient_1.default.ranking.create({
                    data: {
                        factorId: postFactors.factorId,
                        score: 0,
                        userId: user.userId,
                    },
                }))));
                return res.status(200).json({
                    success: true,
                    postFactors,
                    postRanks,
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
        this.patchFactors = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { factorId, factorName, phase, maxScore } = req.body;
                const patchFactors = yield prismaClient_1.default.factors.update({
                    where: { factorId: Number(factorId) },
                    data: {
                        factorId,
                        factorName,
                        phase,
                        maxScore,
                    },
                });
                return res.json({
                    success: true,
                    data: patchFactors,
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
        this.deleteFactors = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { factorId } = req.body;
                const deleteRanks = yield prismaClient_1.default.ranking.deleteMany({
                    where: { factorId },
                });
                const deleteFactors = yield prismaClient_1.default.factors.delete({
                    where: { factorId },
                });
                return res.status(200).json({
                    success: true,
                    deleteRanks,
                    deleteFactors,
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
exports.default = FactorsController;
//# sourceMappingURL=factors.controller.js.map