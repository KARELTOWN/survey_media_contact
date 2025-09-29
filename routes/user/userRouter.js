import express from "express";
const UserRouter = express.Router();

import { validateAddUser, validateUserCompanyId } from "../../validator/user/userValidator.js";

import userController from "../../controllers/user/userController.js";
import paginateData from "../../helpers/pagination.js";
import {
  validatePaginationQuery,
} from "../../validator/generalValidator.js";

const { addUserToCompany, retireFromCompany, getUsers, getAccountParams } =
  userController();

UserRouter.post(
  "/create",
  validateAddUser,
  addUserToCompany
);

UserRouter.post(
  "/retire_user",
  validateUserCompanyId,
  retireFromCompany
);

UserRouter.get("/params", getAccountParams);

UserRouter.get(
  "/get",
  validatePaginationQuery,
  paginateData,
  getUsers
);

export default UserRouter;
