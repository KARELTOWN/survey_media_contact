import Module from "../models/Module.js";

async function ModuleSeeder() {
  try {
    let data = [
      { libelle: "Utilisateurs" },
      { libelle: "Thématiques" },
      { libelle: "Catégories d'enquêtes" },
      { libelle: "Directions" },
      { libelle: "Roles" },
      { libelle: "Fonctions" },
      { libelle: "Formulaire d'enquêtes" },
      { libelle: "Réponses aux enquêtes" },
      { libelle: "Modèles de Notfications" },
      { libelle: "Notifications" },
      { libelle: "Statistiques" },
    ];

    await Module.insertMany(data, { ordered: false });
    console.log("Modules insert");
  } catch (error) {
    throw error;
  }
}
export default ModuleSeeder;
