import { Router } from "express";
import EventsController from "./events.controller";

const events: Router = Router();
const eventsController = new EventsController();

events
    .route("/")
    .get(eventsController.getEvents)
    .post(eventsController.postEvent)
    .delete(eventsController.deleteEvent)
    .patch(eventsController.patchEvent);


export default events;