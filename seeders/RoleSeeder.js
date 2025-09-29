import Role from "../models/Role.js";

async function RoleSeeder() {
  try {
    const roles = [
      {
        libelle: "Super Administrateur",
      },
      {
        libelle: "Administrateur",
      },
      {
        libelle: "Utilisateur",
      },
    ];

    let insert = await Role.insertMany(roles, {
      ordered: false,
    });
    console.log("Listes des roles insérées");
  } catch (error) {
    throw error;
  }
}
export default RoleSeeder;
