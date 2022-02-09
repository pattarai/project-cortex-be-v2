//import * as bcrypt from 'bcrypt';
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class EventsController {
  public getEvents = async (req: Request, res: Response): Promise<any> => {
    try {
      const { phase } = req.body;
      const data = await prisma.events.findMany({
        where: { phase: Number(phase) },
        select: {
          eventId: true,
          eventName: true,
          eventType: true,
          eventDate: true,
        },
      });
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

  public postEvent = async (req: Request, res: Response): Promise<any> => {
    try {
      const { eventName, eventType, eventDate, conductedBy, name, phase } =
        req.body;
      const _events = await prisma.events.create({
        data: {
          eventName,
          eventType,
          eventDate,
          conductedBy,
          name,
          phase,
        },
      });
      return res.status(200).json({
        success: true,
        _events,
      });
    } catch (e) {
      console.error(e);
      res.status(500).send({
        success: false,
        message: e.toString(),
      });
    }
  };

  public deleteEvent = async (req: Request, res: Response): Promise<any> => {
    try {
      const { eventId } = req.body;
      const eventName = await prisma.events.delete({
        where: { eventId },
        select: {
          eventName: true,
          eventType: true,
          eventDate: true,
          name: true,
          conductedBy: true,
          phase: true,
        },
      });
      return res.status(200).json({
        success: true,
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

  public patchEvent = async (req: Request, res: Response): Promise<any> => {
    try {
      const {
        eventId,
        eventName,
        eventType,
        eventDate,
        conductedBy,
        name,
        phase,
      } = req.body;
      const _events = await prisma.events.update({
        where: { eventId },
        data: {
          eventId,
          eventName,
          eventType,
          eventDate,
          conductedBy,
          name,
          phase,
        },
      });
      return res.json({
        success: true,
        data: _events,
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
