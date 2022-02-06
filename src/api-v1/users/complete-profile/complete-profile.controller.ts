//import * as bcrypt from 'bcrypt';
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { UploadedFile } from "express-fileupload";
import * as path from "path";

const prisma = new PrismaClient();

export default class CompleteProfile {
    public completeProfileGet = async (
        req: Request,
        res: Response
    ): Promise<any> => {
        try {
            const { userId } = req.body;
            const _user = await prisma.users.findFirst({
                where: {
                    userId,
                },
            });
            return res.json({
                success: true,
                data: _user,
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString(),
            });
        }
    };

    public completeProfilePatch = async (
        req: Request,
        res: Response
    ): Promise<any> => {
        try {
            const {
                userId,
                dateOfBirth,
                collegeName,
                department,
                year,
                rollNumber,
                registerNumber,
                whatsappNumber,
                instagramUrl,
                githubUrl,
                linkedInUrl,
                description,
            } = req.body;

            let profilePicFile = req.files.profilePic as UploadedFile;
            let bitmojiFile = req.files.bitmojiPic as UploadedFile;

            let profilePath = path.join("public", "profile", `${userId}.jpg`);
            let bitmojiPath = path.join("public", "bitmoji", `${userId}.jpg`);

            profilePicFile.mv(profilePath);
            bitmojiFile.mv(bitmojiPath);

            const _user = await prisma.users.update({
                where: {
                    userId: Number(userId),
                },
                data: {
                    dateOfBirth,
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
                },
            });

            return res.json({
                success: true,
                data: _user,
                profilePic: profilePath,
                bitmojiPic: bitmojiPath,
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString(),
            });
        }
    };
}
