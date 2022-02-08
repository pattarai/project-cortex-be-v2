import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class AttendanceController {
  // Get all Attendance
  public getAttendance = async (req: Request, res: Response): Promise<any> => {
    try {
      const { eventName, eventType, eventDate } = req.body;
      const eventId = await prisma.events.findFirst({
        where: {
          eventName,
          eventType,
          eventDate,
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
              attendanceId: true,
              userId: true,
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
          attendance,
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

        userList = userList.map((user) => {
          return {
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            status: 1,
            eventId: Number(eventId.eventId),
          };
        });

        return res.status(200).json({
          message: "Success",
          userList,
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

      const crewattendance = await prisma.attendance.createMany({
        data: [...crewAttendance],
      });

      let externalAttendanceList: any = [];
      if (externalAttendance.length > 0) {
        externalAttendanceList = await prisma.external_attendance.createMany({
          data: [...externalAttendance],
        });
      }
      return res.status(200).json({
        message: "Success",
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

  // Delete Attendance
  public deleteAttendance = async (req: Request, res: Response) => {
    try {
      const { externalId } = req.body;
      const externalList = await prisma.external_attendance.delete({
        where: { externalId },
      });
      return res.status(200).json({ message: "Success", externalList });
    } catch (e) {
      console.error(e);
      res.status(500).send({
        success: false,
        message: e.toString(),
      });
    }
  };
}
