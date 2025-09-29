import NotificationModelSeeder from "./NotificationModelSeeder.js";
import QuestionFieldTypeSeeder from "./QuestionFieldTypeSeeder.js";
import ModuleSeeder from "./ModuleSeeder.js";
import UserSeeder from "./UserSeeder.js";

const seeders = [
  QuestionFieldTypeSeeder,
  NotificationModelSeeder,
  ModuleSeeder,
  UserSeeder
];

for (const seeder of seeders) {
  try {
    await seeder();
    console.log(`${seeder.name} exécuté avec succès`);
  } catch (err) {
    console.error(`Erreur dans ${seeder.name}:`, err.message);
    // Ici on continue quand même avec les seeders suivants
  }
}

console.log("Tous les seeders ont été exécutés (avec ou sans erreurs)");
process.exit(0);
