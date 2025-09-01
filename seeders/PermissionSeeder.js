import Role from "../models/Role.js";
import Feature from "../models/Feature.js";
import Permission from "../models/Permission.js";

async function PermissionSeeder() {
  try {
    const roles = await Role.find({});
    const features = await Feature.find({});

    roles.forEach((role) => {
      features.forEach(async (feature) => {
        await Permission.insertOne({
          feature_id: feature._id,
          module_id: feature.module_id,
          role_id: role._id,
          is_active: true,
        });
      });
    });
    console.log("Permissions inserts");
  } catch (error) {
    throw error;
  }
}
export default PermissionSeeder;
