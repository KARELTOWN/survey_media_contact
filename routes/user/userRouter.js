import express from "express";
const UserRouter = express.Router();

import { validateUserId } from "../../validator/auth/authValidator.js";

import { validateAddUser } from "../../validator/user/userValidator.js";

import userController from "../../controllers/user/userController.js";
import paginateData from "../../helpers/pagination.js";
import { validatePaginationQuery } from "../../validator/generalValidator.js";

const { addUser, changeAccountStatus, getUsers, getAccountParams } =
  userController();

UserRouter.post("/create", validateAddUser, addUser);

UserRouter.post("/change_account_status", validateUserId, changeAccountStatus);

UserRouter.get("/params", getAccountParams);

UserRouter.get("/get", validatePaginationQuery, paginateData, getUsers);

export default UserRouter;
