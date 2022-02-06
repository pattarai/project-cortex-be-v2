import { Router } from "express";
import CommonViewController from "./common-view.controller";

const commonView: Router = Router();
const commonViewController = new CommonViewController();

commonView
    .route("/")
    .get(commonViewController.getUsers);

export default commonView;