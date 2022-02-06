//import * as bcrypt from 'bcrypt';
import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export default class EventsController {
  public getEvents = async (req: Request, res: Response): Promise<any> => {
    try {
      const { phase } = req.body;
      const eventId = await prisma.events.findMany({
        where: { phase },
        select: {
          eventName: true,
          eventType: true,
          eventDate: true,
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
