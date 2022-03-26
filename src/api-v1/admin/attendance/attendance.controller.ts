import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class AttendanceController {
  // Get all Attendance
  public getAttendance = async (req: Request, res: Response): Promise<any> => {
    try {
      const { eventName, eventType, eventDate } = req.body;
      const date=new Date(eventDate);
      const newDate = date.setDate(date.getDate() - 1);
      const eventId = await prisma.events.findFirst({
        where: {
          eventName,
          eventType,
          eventDate: new Date(newDate),
        },
        select: {
          eventId: true,
        },
      });

      const attendance = await prisma.events.findFirst({
        where: { eventId: Number(eventId.eventId) },
        select: {
          attendance: {
            select: {
              userId: true,
              eventId: true,
              status: true,
              users: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          external_attendance: {
            select: {
              externalId: true,
              name: true,
            },
          },
        },
      });

      //Check if attendance exists
      if (attendance.attendance.length > 0) {
        return res.status(200).json({
          message: "Success",
          crewAttendance: attendance.attendance,
          externalAttendance: attendance.external_attendance,
          eventId: Number(eventId.eventId),
          isExist: true,
        });
      } else {
        let userList = await prisma.users.findMany({
          select: {
            userId: true,
            firstName: true,
            lastName: true,
          },
        });

        const crewAttendance = userList.map((user) => {
          const users = { firstName: user.firstName, lastName: user.lastName };
          return {
            userId: user.userId,
            eventId: Number(eventId.eventId),
            status: 1,
            users,
          };
        });

        return res.status(200).json({
          message: "Success",
          crewAttendance,
          isExist: false,
          eventId: Number(eventId.eventId),
        });
      }
    } catch (e) {
      console.error(e);
      res.status(500).send({
        success: false,
        message: e.toString(),
      });
    }
  };

  // Insert Attendance
  public addAttendance = async (req: Request, res: Response): Promise<any> => {
    try {
      const { crewAttendance, externalAttendance } = req.body;

      const newCrewAttendance = crewAttendance.map((attendance) => {
        return {
          userId: attendance.userId,
          eventId: attendance.eventId,
          status: attendance.status,
        };
      });

      const crewattendance = await prisma.attendance.createMany({
        data: [...newCrewAttendance],
      });

      let externalAttendanceList: any = [];
      if (externalAttendance.length > 0) {
        externalAttendanceList = await prisma.external_attendance.createMany({
          data: [...externalAttendance],
        });
      }
      return res.status(200).json({
        success: true,
        crewattendance,
        externalAttendanceList,
      });
    } catch (e) {
      console.error(e);
      res.status(500).send({
        success: false,
        message: e.toString(),
      });
    }
  };

  //Update Attendance
  public updateAttendance = async (req: Request, res: Response) => {
    try {
      const { crewAttendance } = req.body;

      let crewAttendanceList: any = [];

      type User = {
        userId: number;
        eventId: number;
        status: number;
      };

      await prisma.$transaction(
        (crewAttendanceList = crewAttendance.map((user: User) =>
          prisma.attendance.updateMany({
            where: { eventId: user.eventId, userId: user.userId },
            data: { status: user.status },
          })
        ))
      );

      res.status(200).send({
        success: true,
      });
    } catch (e) {
      console.error(e);
      res.status(500).send({
        success: false,
        message: e.toString(),
      });
    }
  };

  // Delete Attendance
  public deleteAttendance = async (req: Request, res: Response) => {
    try {
      const { externalId } = req.body;
      const externalList = await prisma.external_attendance.delete({
        where: { externalId },
      });
      return res.status(200).json({ success: true, externalList });
    } catch (e) {
      console.error(e);
      res.status(500).send({
        success: false,
        message: e.toString(),
      });
    }
  };
}
