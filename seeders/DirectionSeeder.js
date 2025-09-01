import Direction from "../models/Direction.js";

async function DirectionSeeder() {
  try {
    let data = [
      { libelle: "MEDIA CONTACT", code: "MC" },
      { libelle: "AAIM", code: "AAIM" },
      { libelle: "HOOPE-AFRICA", code: "HA" },
      { libelle: "DIGITAL BY PALLADIUM", code: "DBP" },
    ];
    await Direction.insertMany(data, { ordered: false });
    console.log("Direction insert");
  } catch (error) {
    throw error;
  }
}
export default DirectionSeeder;
