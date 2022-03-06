//import * as bcrypt from 'bcrypt';
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class EventsController {
  public getEvents = async (req: Request, res: Response): Promise<any> => {
    try {
      const currentPhase = await prisma.events.aggregate({
        _max: {
          phase: true,
        },
      });
      const eventList = await prisma.events.findMany({
        where: { phase: Number(currentPhase._max.phase) },
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
          date.getDate();
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

      const phaseList = await prisma.events.findMany({
        distinct: ["phase"],
        select: {
          phase: true,
        },
      });
      return res.status(200).json({
        message: "Success",
        data,
        committeeList: committeeList.map((committee) => committee.committee),
        projectList: projectList.map((project) => project.project),
        phaseList: phaseList.map((phase) => phase.phase),
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
      const { eventName, eventType, eventDate, conductedBy, speaker, phase } =
        req.body;
      const _events = await prisma.events.create({
        data: {
          eventName,
          eventType,
          eventDate: new Date(eventDate),
          conductedBy,
          speaker,
          phase,
        },
      });

      let date = new Date(_events.eventDate);
      let eventdate =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getDate() +
        " ";

      const data = {
        eventId: _events.eventId,
        eventName: _events.eventName,
        eventType: _events.eventType,
        eventDate: eventdate,
        conductedBy: _events.conductedBy,
        speaker: _events.speaker,
        phase: _events.phase,
      };

      return res.status(200).json({
        success: true,
        data: data,
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
          speaker: true,
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
        speaker,
        phase,
      } = req.body;
      console.log("patch event", eventDate.setSeconds(0));
      const _events = await prisma.events.update({
        where: { eventId },
        data: {
          eventId,
          eventName,
          eventType,
          eventDate: new Date(eventDate),
          conductedBy,
          speaker,
          phase,
        },
      });

      let date = new Date(_events.eventDate);
      let eventdate =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getDate() +
        " ";

      const data = {
        eventId: _events.eventId,
        eventName: _events.eventName,
        eventType: _events.eventType,
        eventDate: eventdate,
        conductedBy: _events.conductedBy,
        speaker: _events.speaker,
        phase: _events.phase,
      };

      return res.json({
        success: true,
        data: data,
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
