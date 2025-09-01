import express from "express";
const UserRouter = express.Router();

import {
  validateUserId,
} from "../../validator/auth/authValidator.js";

import {
  validateAddUser,
} from "../../validator/user/userValidator.js";

import userController from "../../controllers/user/userController.js";

const {
  addUser,
  changeAccountStatus,
  getUsers
} = userController();

UserRouter.post("/add", validateAddUser, addUser);

UserRouter.post(
  "/change_account_status",
  validateUserId,
  changeAccountStatus
);

UserRouter.post(
  "/get_all",
  getUsers
);

export default UserRouter;
