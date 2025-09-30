import express from "express";
const RoleRouter = express.Router();

import {
  validateStoreRole,
  validateUpdateRole,
  validatePermission,
  validateRoleId,
} from "../../validator/user/roleValidator.js";

import roleController from "../../controllers/user/roleController.js";
import permissionCheck from "../../middleware/permissionCheck.js";
const { createRole, getPermissions, getRoles, updatePermission, updateRole } =
  roleController();

RoleRouter.post(
  "/create",
  permissionCheck("AR"),
  validateStoreRole,
  createRole
);

RoleRouter.put(
  "/update/:role_id",
  permissionCheck("MR"),
  validateUpdateRole,
  updateRole
);

RoleRouter.get("/get", permissionCheck("RE"), getRoles);

RoleRouter.get(
  "/permissions/:role_id",
  permissionCheck("RPR"),
  validateRoleId,
  getPermissions
);

RoleRouter.put(
  "/update_permissions/:permission_id",
  permissionCheck("MPR"),
  validatePermission,
  updatePermission
);

export default RoleRouter;
