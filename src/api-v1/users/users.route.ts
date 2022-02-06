import { Router } from "express";
import CompleteProfileController from "./completeProfile.controller";
import * as fileUpload from "express-fileupload";


const users: Router = Router();
const completeProfileController = new CompleteProfileController();

users.use(fileUpload())

users.route("/complete-profile")
    .get(completeProfileController.completeProfileGet)
    .patch(completeProfileController.completeProfilePatch);

export default users;
