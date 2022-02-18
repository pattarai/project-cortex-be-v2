import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class UsermanagementController {
  public getUser = async (req: Request, res: Response): Promise<any> => {
    try {
      const user = await prisma.users.findMany({
        where: {
          status: true,
        },
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
        message: "Success",
        user,
      });
    } catch (e) {
      console.error(e);
      res.status(500).send({
        success: false,
        message: e.toString(),
      });
    }
  };

  public createUser = async (req: Request, res: Response): Promise<any> => {
    try {
      const userDetails = req.body;
      const user = await prisma.users.create({
        data: {
          ...userDetails,
        },
      });
      return res.status(200).json({
        message: "Success",
        user,
      });
    } catch (e) {
      console.error(e);
      res.status(500).send({
        success: false,
        message: e.toString(),
      });
    }
  };

  public updateUser = async (req: Request, res: Response): Promise<any> => {
    try {
      const { userId, ...details } = req.body;
      const user = await prisma.users.update({
        where: {
          userId,
        },
        data: {
          ...details,
        },
      });
      return res.status(200).json({
        message: "Success",
        user,
      });
    } catch (e) {
      console.error(e);
      res.status(500).send({
        success: false,
        message: e.toString(),
      });
    }
  };

  public deleteUser = async (req: Request, res: Response): Promise<any> => {
    try {
      const { userId } = req.body;
      await prisma.users.update({
        where: {
          userId,
        },
        data: {
          status: false,
        },
      });
      return res.status(200).json({
        message: "Success",
      });
    } catch (e) {
      console.error(e);
      res.status(500).send({
        success: false,
        message: e.toString(),
      });
    }
  };
}
