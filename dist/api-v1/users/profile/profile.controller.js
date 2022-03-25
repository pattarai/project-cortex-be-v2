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
class ProfileController {
    constructor() {
        this.getProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let userId = res.locals.user.userId;
                const users = yield prismaClient_1.default.users.findFirst({
                    where: {
                        userId,
                    },
                    select: {
                        userId: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        project: true,
                        committee: true,
                        roles: true,
                        dateOfBirth: true,
                        collegeName: true,
                        department: true,
                        year: true,
                        rollNumber: true,
                        registerNumber: true,
                        whatsappNumber: true,
                        profileUrl: true,
                        bitmojiUrl: true,
                        instagramUrl: true,
                        githubUrl: true,
                        linkedInUrl: true,
                        description: true,
                    },
                });
                let dob = users.dateOfBirth.getFullYear() +
                    "-" +
                    (users.dateOfBirth.getMonth() + 1) +
                    "-" +
                    users.dateOfBirth.getDate();
                return res.status(200).json({
                    message: "Success",
                    users: {
                        userId: userId,
                        firstName: users.firstName,
                        lastName: users.lastName,
                        email: users.email,
                        project: users.project,
                        committee: users.committee,
                        roles: users.roles.role,
                        dateOfBirth: dob,
                        collegeName: users.collegeName,
                        department: users.department,
                        year: users.year,
                        rollNumber: users.rollNumber,
                        registerNumber: users.registerNumber,
                        whatsappNumber: users.whatsappNumber,
                        profileUrl: users.profileUrl,
                        bitmojiUrl: users.bitmojiUrl,
                        instagramUrl: users.instagramUrl,
                        githubUrl: users.githubUrl,
                        linkedInUrl: users.linkedInUrl,
                        description: users.department,
                    },
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
        this.profilePatch = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let userId = res.locals.user.userId;
                const { year, rollNumber, registerNumber, whatsappNumber, instagramUrl, githubUrl, linkedInUrl, profileUrl, bitmojiUrl, description, } = req.body;
                const users = yield prismaClient_1.default.users.update({
                    where: {
                        userId,
                    },
                    data: {
                        year: Number(year),
                        rollNumber,
                        registerNumber,
                        whatsappNumber,
                        instagramUrl,
                        githubUrl,
                        linkedInUrl,
                        description,
                        profileUrl,
                        bitmojiUrl,
                    },
                });
                return res.json({
                    success: true,
                    data: users,
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
exports.default = ProfileController;
//# sourceMappingURL=profile.controller.js.map