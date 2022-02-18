import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class UsermanagementController {
  public getUser = async (req: Request, res: Response): Promise<any> => {
    try {
      const committeeList = await prisma.users.findMany({
        select: {
          committee: true,
        },
        distinct: ["committee"],
      });

      const projectList = await prisma.users.findMany({
        select: {
          project: true,
        },
        distinct: ["project"],
      });

      const rolesList = await prisma.roles.findMany({
        select: {
          role: true,
        },
      });

      const users = await prisma.users.findMany({
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
        success: true,
        users,
        committeeList: committeeList.map((committee) => committee.committee),
        projectList: projectList.map((project) => project.project),
        roleList: rolesList.map((roles) => roles.role),
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
      const { role, ...userDetails } = req.body;
      const roleId = await prisma.roles.findFirst({
        where: {
          role,
        },
        select: {
          roleId: true,
        },
      });
      const user = await prisma.users.create({
        data: {
          roleId,
          ...userDetails,
        },
      });
      return res.status(200).json({
        success: true,
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
      const { userId, role, ...userDetails } = req.body;
      const roleId = await prisma.roles.findFirst({
        where: {
          role,
        },
        select: {
          roleId: true,
        },
      });
      const user = await prisma.users.update({
        where: {
          userId,
        },
        data: {
          roleId,
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
