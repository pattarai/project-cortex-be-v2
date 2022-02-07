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

      //Check if attendance exists
      const attendance = await prisma.events.findMany({
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

      const attendLength = attendance[0].attendance.length;

      if (attendLength > 0) {
        return res.status(200).json({
          message: "Success",
          attendance,
        });
      } else if (attendLength === 0) {
        const userList = await prisma.users.findMany({
          select: {
            userId: true,
            firstName: true,
            lastName: true,
          },
        });
        return res.status(200).json({
          message: "Success",
          userList,
        });
      } else {
        return res.status(200).json({
          message: "Failure",
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

  // Insert or Update Attendance
  public addAttendance = async (req: Request, res: Response): Promise<any> => {
    try {
      const { attendanceId, eventId, userId, status, externalId, name } =
        req.body;
      const attendance = await prisma.attendance.upsert({
        where: { attendanceId },
        update: { userId, eventId, status },
        create: {
          userId,
          eventId,
          status,
        },
      });
      return res.status(200).json({
        message: "Success",
        attendance,
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
