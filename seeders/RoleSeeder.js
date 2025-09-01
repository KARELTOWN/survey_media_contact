import Role from "../models/Role.js";

async function RoleSeeder() {
  try {
    let data = [
      { libelle: "Administrateur" },
      { libelle: "Contributeur" },
      { libelle: "Utilisateur" },
    ];
    await Role.insertMany(data, { ordered: false });
    console.log("Roles insert");
  } catch (error) {
    throw error;
  }
}
export default RoleSeeder;
