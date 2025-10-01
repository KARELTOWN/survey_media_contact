import Module from "../models/Module.js";
import Feature from "../models/Feature.js";

const FeatureSeeder = async () => {
  try {
    let modules = await Module.find({}).exec();
    for (const foundModule of modules) {
      let features = [];
      if (foundModule.libelle == "Societe") {
        features = [
          {
            libelle: "Détail société",
            code: "DS",
            module_id: foundModule._id,
          },
          {
            libelle: "Modification société",
            code: "MS",
            module_id: foundModule._id,
          },
        ];
      }
      if (foundModule.libelle == "Configuration enquête") {
        features = [
          {
            libelle: "Configuration d'enquêtes",
            code: "CE",
            module_id: foundModule._id,
          },
        ];
      }
      if (foundModule.libelle == "Collaborateur") {
        features = [
          {
            libelle: "Liste de collaborateurs",
            code: "LC",
            module_id: foundModule._id,
          },
          {
            libelle: "Invitation collaborateur",
            code: "IC",
            module_id: foundModule._id,
          },
          {
            libelle: "Retrait/Reintegration collaborateur",
            code: "RRC",
            module_id: foundModule._id,
          },
          {
            libelle: "Modification role du collaborateur",
            code: "MRC",
            module_id: foundModule._id,
          },
        ];
      }
      if (foundModule.libelle == "Thématique") {
        features = [
          {
            libelle: "Ajout thématique",
            code: "AT",
            module_id: foundModule._id,
          },
          {
            libelle: "Modification thématique",
            code: "MT",
            module_id: foundModule._id,
          },
        ];
      }
      if (foundModule.libelle == "Catégorie") {
        features = [
          {
            libelle: "Ajout catégorie",
            code: "AC",
            module_id: foundModule._id,
          },
          {
            libelle: "Modification catégorie",
            code: "MC",
            module_id: foundModule._id,
          },
        ];
      }
      if (foundModule.libelle == "Enquetes") {
        features = [
          {
            libelle: "Ajout d'enquête",
            code: "AE",
            module_id: foundModule._id,
          },
          {
            libelle: "Modification d'enquête",
            code: "UPE",
            module_id: foundModule._id,
          },
          {
            libelle: "Export en excel",
            code: "SURVEY_EXCEL",
            module_id: foundModule._id,
          },
          {
            libelle: "Détail d'enquête",
            code: "DE",
            module_id: foundModule._id,
          },
          {
            libelle: "Réponses d'enquêtes",
            code: "RE",
            module_id: foundModule._id,
          },
          {
            libelle: "Statistique d'enquêtes",
            code: "SE",
            module_id: foundModule._id,
          },
          {
            libelle: "Modification d'enquête",
            code: "ME",
            module_id: foundModule._id,
          },
        ];
      }
      if (foundModule.libelle == "Role") {
        features = [
          {
            libelle: "Ajout role",
            code: "AR",
            module_id: foundModule._id,
          },
          {
            libelle: "Modifier role",
            code: "MR",
            module_id: foundModule._id,
          },
          {
            libelle: "Récupérer les roles",
            code: "RR",
            module_id: foundModule._id,
          },
          {
            libelle: "Récupérer les permissions d'un role",
            code: "RPR",
            module_id: foundModule._id,
          },
          {
            libelle: "Modifier la permission d'un role",
            code: "MPR",
            module_id: foundModule._id,
          },
        ];
      }
      await Feature.insertMany(features, { ordered: false });
    }
  } catch (error) {
    throw error;
  }
};
export default FeatureSeeder;
