import { Router } from "express";
import RanksController from "./ranks.controller";

const ranks: Router = Router();
const ranksController = new RanksController();

ranks
    .route("/")
    .get(ranksController.getAllRanks)
    .post(ranksController.getUserRanks);

export default ranks;