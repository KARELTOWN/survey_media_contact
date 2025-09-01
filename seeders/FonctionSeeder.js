import Direction from "../models/Direction.js";
import Fonction from "../models/Fonction.js";

async function FonctionSeeder() {
  try {
    let dr1 = await Direction.findOne({ libelle: "MEDIA CONTACT" });
    let dr2 = await Direction.findOne({ libelle: "AAIM" });
    let dr3 = await Direction.findOne({ libelle: "HOOPE-AFRICA" });
    let dr4 = await Direction.findOne({ libelle: "DIGITAL BY PALLADIUM" });

    const fonctions = [
      { libelle: "Sécrétaire Administrative et financière", is_unique: false },
      { libelle: "Gestionnaire des ressources humaines", is_unique: false },
      { libelle: "Directeur Générale", is_unique: true },
      { libelle: "Responsable Technique", is_unique: true },
      { libelle: "Chargé de Communication", is_unique: false },
    ];

    const allFonctions = [
      ...fonctions.map((data) => ({
        libelle: data.libelle,
        is_unique: data.is_unique,
        direction_id: dr1._id,
      })),
      ...fonctions.map((data) => ({
        libelle: data.libelle,
        is_unique: data.is_unique,
        direction_id: dr2._id,
      })),
      ...fonctions.map((data) => ({
        libelle: data.libelle,
        is_unique: data.is_unique,
        direction_id: dr3._id,
      })),
      ...fonctions.map((data) => ({
        libelle: data.libelle,
        is_unique: data.is_unique,
        direction_id: dr4._id,
      })),
    ];

    await Fonction.insertMany(allFonctions, { ordered: false });

    console.log("Fonctions insert");
  } catch (error) {
    throw error;
  }
}
export default FonctionSeeder;
