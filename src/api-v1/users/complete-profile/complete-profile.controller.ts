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
      let userId = res.locals.user.userId;
      const user = await prisma.users.findFirst({
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

      let userId = res.locals.user.userId;

      let profilePicFile = req.files.profilePic as UploadedFile;
      let bitmojiFile = req.files.bitmojiPic as UploadedFile;

      if (profilePicFile && bitmojiFile) {
        let profilePath = path.join("public", "profile", `${userId}.jpg`);
        let bitmojiPath = path.join("public", "bitmoji", `${userId}.jpg`);

        profilePicFile.mv(profilePath);
        bitmojiFile.mv(bitmojiPath);
      }

      const user = await prisma.users.update({
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
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.toString(),
      });
    }
  };
}
