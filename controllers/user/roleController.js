import { matchedData } from "express-validator";
import roleService from "../../services/user/roleService.js";
import userService from "../../services/user/userService.js";
import Role from "../../models/Role.js";

const { getActiveAccountData } = userService();
const {
  createRoleFn,
  updateRoleFn,
  updatePermissionFn,
  getPermissionsFn,
  getRolesFn,
} = roleService();
export default function roleController() {
  const createRole = async (req, res, next) => {
    try {
      const data = matchedData(req);

      let active_account_data = getActiveAccountData(req);

      let created_by = { created_by: req.user._id };
      let role = await createRoleFn({
        libelle: data.libelle,
        ...active_account_data,
        ...created_by,
      });

      return res.status(200).json({
        message: "Role créé",
        data: {
          role: {
            _id: role._id,
            libelle: role.libelle,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  };

  const getRoles = async (req, res, next) => {
    try {
      const data = await getRolesFn(req.owner_id);

      return res.status(200).json({
        message: "Roles récupérées",
        data: data,
      });
    } catch (error) {
      next(error);
    }
  };

  const updateRole = async (req, res, next) => {
    try {
      const data = matchedData(req);
      let role = await updateRoleFn(data);

      return res.status(200).json({
        message: "Role modifié",
        data: {
          role: {
            _id: role._id,
            libelle: role.libelle,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  };

  const getPermissions = async (req, res, next) => {
    try {
      const data = matchedData(req);
      let permissions = await getPermissionsFn(data.role_id);
      let role = await Role.findOne({ _id: data.role_id }).select('libelle');
      return res.status(200).json({
        message: "Get successfully",
        data: {
          permissions,
          role,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  const updatePermission = async (req, res, next) => {
    try {
      const data = matchedData(req);
      let permission = await updatePermissionFn(data.permission_id);
      return res.status(200).json({
        message: "Update successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  return {
    getRoles,
    updateRole,
    getPermissions,
    createRole,
    updatePermission,
  };
}
