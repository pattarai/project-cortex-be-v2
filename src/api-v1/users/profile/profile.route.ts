import { Router } from "express";
import ProfileController from "./profile.controller";

const profile: Router = Router();
const profileController = new ProfileController();

profile
  .route("/")
  .get(profileController.getProfile)
  .patch(profileController.profilePatch);

export default profile;
