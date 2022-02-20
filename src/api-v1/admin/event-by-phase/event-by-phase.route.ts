import { Router } from "express";
import EventsController from "./event-by-phase.controller";

const events: Router = Router();
const eventsController = new EventsController();

events.route("/").post(eventsController.getEventsByPhase);

export default events;
