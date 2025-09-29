import Role from "../../models/Role.js";

export default function roleService() {
  const createRole = async (data) => {
    try {
      let role = await Role.findOne({
        libelle: data.libelle,
        owner_id: data.owner_id,
      });
      if (!role) {
        role = await Role.create({ ...data });
      }
      return role;
    } catch (error) {
      throw new Error(error);
    }
  };
  return {
    createRole,
  };
}
