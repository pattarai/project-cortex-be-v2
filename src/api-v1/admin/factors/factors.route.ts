import { Router } from "express";
import FactorsController from "./factors.controller";

const factors: Router = Router();
const factorsController = new FactorsController();

factors
  .route("/")
  .get(factorsController.getFactors)
  .post(factorsController.postFactors)
  .patch(factorsController.patchFactors)
  .delete(factorsController.deleteFactors);

export default factors;
