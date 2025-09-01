import Topic from "../models/Topic.js";
import Category from "../models/Category.js";

async function CategorySeeder() {
  try {
    let topic1 = await Topic.findOne({ libelle: "Ambiance de travail" });
    let topic2 = await Topic.findOne({ libelle: "Communication interne" });
    let topic3 = await Topic.findOne({ libelle: "Reconnaissance" });
    let topic4 = await Topic.findOne({ libelle: "Formation et développement" });
    let topic5 = await Topic.findOne({
      libelle: "Satisfaction client et performance",
    });

    const topic1_data = [
      "Qualité de l’espace de travail (bureaux, matériel, confort)",
      "Relations avec les collègues",
      "Gestion du stress et pression",
      "Équilibre vie professionnelle / vie privée",
      "Culture d’entreprise et valeurs",
    ];
    const topic2_data = [
      "Clarté des informations reçues",
      "Fréquence des mises à jour et briefings",
      "Accessibilité des managers / équipe RH",
      "Feedback et reconnaissance des idées",
      "Communication descendante vs ascendante",
    ];

    const topic3_data = [
      "Reconnaissance du travail accompli",
      "Incitations financières (bonus, primes)",
      "Incitations non financières (récompenses, mentions)",
      "Opportunités de développement / promotion",
      "Motivation personnelle et engagement",
    ];
    const topic4_data = [
      "Qualité des formations proposées",
      "Accessibilité des outils d’apprentissage",
      "Accompagnement par les managers",
      "Possibilités d’évolution de carrière",
      "Clarté des attentes et objectifs",
    ];
    const topic5_data = [
      "Ressources pour atteindre les objectifs",
      "Charge de travail vs performance attendue",
      "Support des managers pour atteindre les KPI",
      "Satisfaction des clients perçue",
      "Gestion des plaintes et incidents",
    ];

    const allCategories = [
      ...topic1_data.map((libelle) => ({ topic_id: topic1._id, libelle })),
      ...topic2_data.map((libelle) => ({ topic_id: topic2._id, libelle })),
      ...topic3_data.map((libelle) => ({ topic_id: topic3._id, libelle })),
      ...topic4_data.map((libelle) => ({ topic_id: topic4._id, libelle })),
      ...topic5_data.map((libelle) => ({ topic_id: topic5._id, libelle })),
    ];

    await Category.insertMany(allCategories, { ordered: false });

    console.log("Category insert");
  } catch (error) {
    throw error;
  }
}
export default CategorySeeder;
