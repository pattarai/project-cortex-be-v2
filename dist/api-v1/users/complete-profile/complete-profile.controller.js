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
// import { UploadedFile } from "express-fileupload";
// import * as path from "path";
class CompleteProfile {
    constructor() {
        this.completeProfileGet = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let userId = res.locals.user.userId;
                const user = yield prismaClient_1.default.users.findFirst({
                    where: {
                        userId,
                    },
                    select: {
                        userId: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        committee: true,
                        project: true,
                        roleId: true,
                        dateOfBirth: true,
                        collegeName: true,
                        department: true,
                        year: true,
                        rollNumber: true,
                        registerNumber: true,
                        whatsappNumber: true,
                        instagramUrl: true,
                        githubUrl: true,
                        linkedInUrl: true,
                        description: true,
                    },
                });
                return res.json({
                    success: true,
                    user,
                });
            }
            catch (err) {
                return res.status(500).json({
                    success: false,
                    message: err.toString(),
                });
            }
        });
        this.completeProfilePatch = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { dateOfBirth, collegeName, department, year, rollNumber, registerNumber, whatsappNumber, instagramUrl, githubUrl, linkedInUrl, description, } = req.body;
                let userId = res.locals.user.userId;
                // let profilePicFile = req.files.profilePic as UploadedFile;
                // let bitmojiFile = req.files.bitmojiPic as UploadedFile;
                // if (profilePicFile && bitmojiFile) {
                //   let profilePath = path.join("public", "profile", `${userId}.jpg`);
                //   let bitmojiPath = path.join("public", "bitmoji", `${userId}.jpg`);
                //   profilePicFile.mv(profilePath);
                //   bitmojiFile.mv(bitmojiPath);
                // }
                const user = yield prismaClient_1.default.users.update({
                    where: {
                        userId: Number(userId),
                    },
                    data: {
                        dateOfBirth: new Date(dateOfBirth),
                        collegeName,
                        department,
                        year: Number(year),
                        rollNumber,
                        registerNumber,
                        whatsappNumber,
                        instagramUrl,
                        githubUrl,
                        linkedInUrl,
                        description,
                        isCompleted: true,
                    },
                });
                return res.json({
                    success: true,
                    user,
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
exports.default = CompleteProfile;
//# sourceMappingURL=complete-profile.controller.js.map