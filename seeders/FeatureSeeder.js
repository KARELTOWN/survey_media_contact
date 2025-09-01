import Module from "../models/Module.js";
import Feature from "../models/Feature.js";

const FeatureSeeder = async () => {
  try {
    // let modules = await Module.find({}).exec();
    // for (const foundModule of modules) {
    //   let features = [];
    //   if (module == "Utilisateurs") {
    //     features = [
    //       {
    //         libelle: "Ajouter un utilisateur",
    //         module_id: foundModule._id,
    //       },
    //     ];
    //   }
    //   await Feature.insertMany(features);
    // }
    // console.log("All features inserts.");
  } catch (error) {
    throw error;
  }
};
export default FeatureSeeder;
