import Topic from "../models/Topic.js";
async function TopicSeeder() {
  try {
    let data = [
      { libelle: "Ambiance de travail" },
      { libelle: "Communication interne" },
      { libelle: "Reconnaissance" },
      { libelle: "Formation et développement" },
      { libelle: "Satisfaction client et performance" },
    ];
    await Topic.insertMany(data, { ordered: false });
    console.log("Topic insert");
  } catch (error) {
    throw error;
  }
}
export default TopicSeeder;
