import LogicOpetator from "../models/LogicOpetator.js";

async function LogicOperatorSeeder() {
  try {
    let data = [
      { libelle: "inférieur ou égale" },
      { libelle: "supérieur ou égale" },
      { libelle: "égale" },
      { libelle: "différent" },
    ];
    await LogicOpetator.insertMany(data, { ordered: false });
    console.log("Logic operator insert");
  } catch (error) {
    throw error;
  }
}
export default LogicOperatorSeeder;
