import LogicOperator from "../models/LogicOperator.js";

async function LogicOperatorSeeder() {
  try {
    let data = [
      { libelle: "inférieur ou égale" },
      { libelle: "supérieur ou égale" },
      { libelle: "égale" },
      { libelle: "différent" },
    ];
    await LogicOperator.insertMany(data, { ordered: false });
    console.log("Logic operator insert");
  } catch (error) {
    throw error;
  }
}
export default LogicOperatorSeeder;
