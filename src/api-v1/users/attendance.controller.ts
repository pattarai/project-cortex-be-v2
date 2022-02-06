//import * as bcrypt from 'bcrypt';
import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export default class AttendanceController {
  public getAttendance = async (req: Request, res: Response): Promise<any> => {
    try {
      const { userId } = req.body;
      const eventId = await prisma.events.findMany({
        select: {
          eventId: true,
          eventName: true,
          phase: true,
          attendance: {
            where:{
              userId
            },
            select: {
              status: true,
            }
          },
        },
      });
      return res.status(200).json({
        message: "Success",
        eventId,
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
