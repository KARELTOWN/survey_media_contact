import roleService from "../../services/user/roleService.js";
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
      let role = createRoleFn({
        libelle: data.libelle,
        owner_id: req.ownerId,
      });
      await role.save();

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
      const data = await getRolesFn(req.ownerId);

      return res.status(200).json({
        message: "Topics récupérées",
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
      let permissions = await getPermissionsFn(data.permission_id);
      return res.status(200).json({
        message: "Get successfully",
        data: permissions,
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
        data: permission,
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
    updatePermission
  };
}
