import Feature from "../../models/Feature.js";
import Role from "../../models/Role.js";
import Permission from "../../models/Permission.js";

export default function roleService() {
  const createRoleFn = async (data) => {
    try {
      let role = await Role.findOne({
        libelle: data.libelle,
        owner_id: data.owner_id,
      });
      if (!role) {
        role = await Role.create({ ...data });
        const features = await Feature.find({});

        let permissions = [];
        features.forEach(async (feature) => {
          permissions.push({
            feature_id: feature._id,
            module_id: feature.module_id,
            role_id: role._id,
            is_active: true,
          });
        });

        await Permission.insertMany(permissions);
      }
      return role;
    } catch (error) {
      throw new Error(error);
    }
  };

  const getRolesFn = async (owner_id) => {
    try {
      return await Role.find({ owner_id });
    } catch (error) {
      throw new Error(error);
    }
  };

  const updateRoleFn = async (data) => {
    try {
      let role = await Role.findByIdAndUpdate(
        data.role_id,
        {
          libelle: data.libelle,
        },
        { new: true }
      );

      return role;
    } catch (error) {
      throw new Error(error);
    }
  };

  const getPermissionsFn = async (role_id) => {
    try {
      let permissions = await Permission.find({ role_id })
        .populate([
          {
            select: "libelle",
            path: "module_id",
          },
          {
            select: "libelle",
            path: "feature_id",
          },
        ])
        .select(["module_id", "feature_id", "is_active"]);

      const grouped = permissions.reduce((acc, perm) => {
        const moduleName = perm.module_id.libelle;

        if (!acc[moduleName]) {
          acc[moduleName] = [];
        }

        acc[moduleName].push({
          feature: perm.feature_id.libelle,
          is_active: perm.is_active,
        });

        return acc;
      }, {});

      return grouped;
    } catch (error) {
      throw new Error(error);
    }
  };

  const updatePermissionFn = async (permission_id) => {
    try {
      let permission = await Permission.findByIdAndUpdate(
        permission_id,
        [{ $set: { is_active: { $not: "$is_active" } } }],
        { new: true }
      );
      return permission;
    } catch (error) {
      throw new Error(error);
    }
  };

  return {
    createRoleFn,
    updateRoleFn,
    updatePermissionFn,
    getPermissionsFn,
    getRolesFn,
  };
}
