//import * as bcrypt from 'bcrypt';
import { Request, Response } from "express";
import prisma from "../../../helpers/prismaClient";

export default class AttendanceController {
  public getAttendance = async (req: Request, res: Response): Promise<any> => {
    try {
      // const { userId, phase } = req.body;
      const userId = res.locals.user.userId;
      const phase = res.locals.user.currentPhase;

      const requestedPhaseEvents = await prisma.attendance.findMany({
        where: {
          userId,
          events: {
            phase,
          },
        },
        select: {
          eventId: true,
          status: true,
          events: {
            select: {
              eventName: true,
            },
          },
        },
      });

      const absentCount = await prisma.attendance.count({
        where: {
          status: 0,
          userId,
          events: {
            phase,
          },
        },
      });

      const presentCount = await prisma.attendance.count({
        where: {
          status: 1,
          userId,
          events: {
            phase,
          },
        },
      });

      const informedCount = await prisma.attendance.count({
        where: {
          status: 2,
          userId,
          events: {
            phase,
          },
        },
      });

      const statusCount = [absentCount, presentCount, informedCount];
      return res.status(200).json({
        success: true,
        requestedPhaseEvents,
        statusCount,
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
