//import * as bcrypt from 'bcrypt';
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class AttendanceController {
    public getAttendance = async (req: Request, res: Response): Promise<any> => {
        try {
            const { eventName, eventType, eventDate } = req.body;
            const eventId = await prisma.events.findFirst({
                where: { eventName, eventType, eventDate },
                select: {
                    eventId: true,
                },
            });
            // const attendance = await prisma.attendance.upsert({
            //   where:  { eventId: eventId.eventId },
            //   update: {
            //     attendance: {},
            //   },
            //   create: {},
            // });
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
