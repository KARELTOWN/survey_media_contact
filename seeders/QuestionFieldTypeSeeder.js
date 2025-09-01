import QuestionFieldType from "../models/QuestionFieldType.js";

async function QuestionFieldTypeSeeder() {
  try {
    let data = [
      { libelle: "Réponse courte" },
      { libelle: "Paragraphe" },
      { libelle: "Choix multiple" },
      { libelle: "Case à cocher" },
      { libelle: "Liste déroulante" },
      { libelle: "Fichier" },
      { libelle: "Avis" },
      { libelle: "Date" },
      { libelle: "Heure" },
    ];
    await QuestionFieldType.insertMany(data, { ordered: false });
    console.log("Question Field Type insert");
  } catch (error) {
    throw error;
  }
}
export default QuestionFieldTypeSeeder;
