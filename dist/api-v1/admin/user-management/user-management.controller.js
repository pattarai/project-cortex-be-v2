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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const prismaClient_1 = require("../../../helpers/prismaClient");
const bcryptjs_1 = require("bcryptjs");
const sendPassword_1 = require("../../../helpers/sendPassword");
class UsermanagementController {
    constructor() {
        this.getUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
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
                const rolesList = yield prismaClient_1.default.roles.findMany({
                    select: {
                        role: true,
                    },
                });
                const users = yield prismaClient_1.default.users.findMany({
                    select: {
                        userId: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        project: true,
                        committee: true,
                        startDate: true,
                        status: true,
                        roles: {
                            select: {
                                role: true,
                            },
                        },
                    },
                });
                return res.status(200).json({
                    success: true,
                    users,
                    committeeList: committeeList.map((committee) => committee.committee),
                    projectList: projectList.map((project) => project.project),
                    roleList: rolesList.map((roles) => roles.role),
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
        this.createUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const _a = req.body, { role, startDate, userId, password, email } = _a, userDetails = __rest(_a, ["role", "startDate", "userId", "password", "email"]);
                const { roleId } = yield prismaClient_1.default.roles.findFirst({
                    where: {
                        role,
                    },
                    select: {
                        roleId: true,
                    },
                });
                const hashedPassword = yield (0, bcryptjs_1.hash)(password, 10);
                const user = yield prismaClient_1.default.users.create({
                    data: Object.assign({ roles: {
                            connect: {
                                roleId,
                            },
                        }, email, password: hashedPassword, startDate: new Date(startDate) }, userDetails),
                });
                const factorIds = yield prismaClient_1.default.factors.findMany({
                    select: {
                        factorId: true,
                    },
                });
                yield prismaClient_1.default.$transaction(factorIds.map((factor) => prismaClient_1.default.ranking.create({
                    data: { userId: user.userId, factorId: factor.factorId, score: 0 },
                })));
                (0, sendPassword_1.sendPassword)(email, password);
                return res.status(200).json({
                    success: true,
                    user,
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
        this.updateUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const _b = req.body, { userId, role, startDate, password } = _b, userDetails = __rest(_b, ["userId", "role", "startDate", "password"]);
                const { roleId } = yield prismaClient_1.default.roles.findFirst({
                    where: {
                        role,
                    },
                    select: {
                        roleId: true,
                    },
                });
                const user = yield prismaClient_1.default.users.update({
                    where: {
                        userId,
                    },
                    data: Object.assign({ startDate: new Date(startDate), roleId }, userDetails),
                });
                return res.status(200).json({
                    success: true,
                    user,
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
        this.deleteUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.body;
                yield prismaClient_1.default.users.delete({
                    where: {
                        userId,
                    },
                });
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
exports.default = UsermanagementController;
//# sourceMappingURL=user-management.controller.js.map