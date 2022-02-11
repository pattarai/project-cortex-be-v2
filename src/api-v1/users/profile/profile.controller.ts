import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export default class ProfileController {
  public getProfile = async (req: Request, res: Response): Promise<any> => {
    try {
      const users = await prisma.users.findMany({
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
      return res.status(200).json({
        message: "Success",
        users,
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
      const {
        userId,
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
          userId: Number(userId),
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
