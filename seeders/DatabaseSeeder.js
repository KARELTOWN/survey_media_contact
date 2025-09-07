import NotificationModelSeeder from "./NotificationModelSeeder.js";
import QuestionFieldTypeSeeder from "./QuestionFieldTypeSeeder.js";
import DirectionSeeder from "./DirectionSeeder.js";
import CategorySeeder from "./CategorySeeder.js";
import TopicSeeder from "./TopicSeeder.js";
import RoleSeeder from "./RoleSeeder.js";
import ModuleSeeder from "./ModuleSeeder.js";
import UserSeeder from "./UserSeeder.js";

const seeders = [
  RoleSeeder,
  TopicSeeder,
  CategorySeeder,
  DirectionSeeder,
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
