import { Router } from "express";
import CompleteProfileController from "./complete-profile.controller";
import * as fileUpload from "express-fileupload";

const completeProfile: Router = Router();
const completeProfileController = new CompleteProfileController();

completeProfile.use(fileUpload())

completeProfile
    .route("/")
    .get(completeProfileController.completeProfileGet)
    .patch(completeProfileController.completeProfilePatch);

export default completeProfile;