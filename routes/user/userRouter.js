import express from "express";
const UserRouter = express.Router();

import {
  validateAddUser,
  validateUserCompanyId,
  validateAcceptInvitation
} from "../../validator/user/userValidator.js";

import userController from "../../controllers/user/userController.js";
import paginateData from "../../helpers/pagination.js";
import { validatePaginationQuery } from "../../validator/generalValidator.js";
import permissionCheck from "../../middleware/permissionCheck.js";
const { addUserCompany, retireUserFromCompany, getUsers, getAccountParams, acceptInvitation } =
  userController();

UserRouter.post(
  "/add_company",
  permissionCheck("IC"),
  validateAddUser,
  addUserCompany
);

UserRouter.post(
  "/retire_user_from_company",
  permissionCheck("RRC"),
  validateUserCompanyId,
  retireUserFromCompany
);

UserRouter.post(
  "/accept_invitation",
  validateAcceptInvitation,
  acceptInvitation
);

UserRouter.get(
  "/get",
  permissionCheck("LC"),
  validatePaginationQuery,
  paginateData,
  getUsers
);

export default UserRouter;
