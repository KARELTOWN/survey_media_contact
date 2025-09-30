import express from "express";
const UserRouter = express.Router();

import {
  validateAddUser,
  validateUserCompanyId,
} from "../../validator/user/userValidator.js";

import userController from "../../controllers/user/userController.js";
import paginateData from "../../helpers/pagination.js";
import { validatePaginationQuery } from "../../validator/generalValidator.js";
import permissionCheck from "../../middleware/permissionCheck.js";
const { addUserCompany, changeUserInCompanyState, getUsers, getAccountParams } =
  userController();

UserRouter.post(
  "/add_company",
  permissionCheck("IC"),
  validateAddUser,
  addUserCompany
);

UserRouter.post(
  "/update_user_company_state",
  permissionCheck("RRC"),
  validateUserCompanyId,
  changeUserInCompanyState
);

UserRouter.get(
  "/get",
  permissionCheck("LC"),
  validatePaginationQuery,
  paginateData,
  getUsers
);

export default UserRouter;
