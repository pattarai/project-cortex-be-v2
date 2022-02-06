import { Router } from "express";
import CompleteProfileController from "./complete-profile.controller";

const completeProfile: Router = Router();
const completeProfileController = new CompleteProfileController();

completeProfile
    .route("/")
    .get(completeProfileController.completeProfileGet)
    .patch(completeProfileController.completeProfilePatch);

export default completeProfile;