import Module from "../models/Module.js";

async function ModuleSeeder() {
  try {
    let data = [
      { libelle: "Societe" },
      { libelle: "Configuration enquête" },
      { libelle: "Collaborateur" },
      { libelle: "Thématique" },
      { libelle: "Catégorie" },
      { libelle: "Enquetes" },
      { libelle: "Role" },
    ];

    await Module.insertMany(data, { ordered: false });
    console.log("Modules insert");
  } catch (error) {
    throw error;
  }
}
export default ModuleSeeder;
