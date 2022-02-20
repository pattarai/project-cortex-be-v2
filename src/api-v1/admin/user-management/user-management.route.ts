import { Router } from "express";
import userManagement from "./user-management.controller";

const users: Router = Router();
const userManagementController = new userManagement();

users
  .route("/")
  .get(userManagementController.getUser)
  .post(userManagementController.createUser)
  .patch(userManagementController.updateUser)
  .delete(userManagementController.deleteUser);

export default users;
