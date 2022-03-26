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
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
const prismaClient_1 = require("../../helpers/prismaClient");
class AuthController {
    constructor() {
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                if (email && password) {
                    const user = yield prismaClient_1.default.users.findFirst({
                        where: {
                            email
                        }
                    });
                    if (user) {
                        let isMatch = yield (0, bcryptjs_1.compare)(password, user.password);
                        if (isMatch) {
                            let currentPhase = yield prismaClient_1.default.events.aggregate({
                                _max: {
                                    phase: true
                                }
                            });
                            let payload = { userId: user.userId, roleId: user.roleId, currentPhase: currentPhase._max.phase };
                            let token = yield (0, jsonwebtoken_1.sign)({ payload }, process.env.JWT_AUTH_SECRET, { expiresIn: "1h" });
                            res.json({
                                success: true,
                                token
                            });
                        }
                        else {
                            res.json({
                                success: false,
                                message: "Invalid password"
                            });
                        }
                    }
                    else {
                        res.json({
                            success: false,
                            message: "User not found"
                        });
                    }
                }
                else {
                    res.json({
                        success: false,
                        message: "Please provide all the required fields"
                    });
                }
            }
            catch (err) {
                return res.status(500).json({
                    success: false,
                    message: err.toString(),
                });
            }
        });
        this.checkUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let userId = res.locals.user.userId;
                let roleId = res.locals.user.roleId;
                let isCompleted = yield prismaClient_1.default.users.findFirst({
                    where: {
                        userId
                    },
                    select: {
                        isCompleted: true
                    }
                });
                let isAdmin = yield prismaClient_1.default.office_bearers.findFirst({
                    where: {
                        roleId
                    }
                });
                res.json({
                    success: true,
                    isCompleted: isCompleted.isCompleted,
                    isAdmin: isAdmin ? true : false,
                    user: res.locals.user
                });
            }
            catch (err) {
                return res.status(500).json({
                    success: false,
                    message: err.toString(),
                });
            }
        });
    }
}
exports.default = AuthController;
//# sourceMappingURL=auth.controller.js.map