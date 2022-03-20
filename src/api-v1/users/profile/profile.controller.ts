import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export default class ProfileController {
  public getProfile = async (req: Request, res: Response): Promise<any> => {
    try {
      let userId = res.locals.user.userId;
      const users = await prisma.users.findFirst({
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
          office_bearers: true,
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

      let dob =
        users.dateOfBirth.getFullYear() +
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
          office_bearers: users.office_bearers,
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
    } catch (e) {
      console.error(e);
      res.status(500).send({
        success: false,
        message: e.toString(),
      });
    }
  };

  public profilePatch = async (req: Request, res: Response): Promise<any> => {
    try {
      let userId = res.locals.user.userId;
      const {
        year,
        rollNumber,
        registerNumber,
        whatsappNumber,
        instagramUrl,
        githubUrl,
        linkedInUrl,
        profileUrl,
        bitmojiUrl,
        description,
      } = req.body;

      const users = await prisma.users.update({
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
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.toString(),
      });
    }
  };
}
