//import * as bcrypt from 'bcrypt';
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class EventsController {
  public getEventsByPhase = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    try {
      const { phase } = req.body;
      const eventList = await prisma.events.findMany({
        where: { phase: Number(phase) },
        select: {
          eventId: true,
          eventName: true,
          eventDate: true,
          eventType: true,
          conductedBy: true,
          speaker: true,
          phase: true,
        },
      });

      let data = eventList.map((event) => {
        let date = new Date(event.eventDate);
        let eventDate =
          date.getFullYear() +
          "-" +
          (date.getMonth() + 1) +
          "-" +
          date.getDate() +
          " " +
          date.getHours() +
          ":" +
          date.getMinutes() +
          ":" +
          date.getSeconds();
        const phase = event.phase;
        return {
          eventId: event.eventId,
          eventName: event.eventName,
          eventDate: eventDate,
          eventType: event.eventType,
          conductedBy: event.conductedBy,
          speaker: event.speaker,
          phase: phase,
        };
      });
      console.log(data);
      return res.status(200).json({
        message: "Success",
        data,
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
