import NotificationModelSeeder from "./NotificationModelSeeder.js";
import QuestionFieldTypeSeeder from "./QuestionFieldTypeSeeder.js";
import LogicOperator from "./LogicOperator.js";
import DirectionSeeder from "./DirectionSeeder.js";
import CategorySeeder from "./CategorySeeder.js";
import TopicSeeder from "./TopicSeeder.js";
import RoleSeeder from "./RoleSeeder.js";
import ModuleSeeder from "./ModuleSeeder.js";

try {
  // await RoleSeeder();
  // await TopicSeeder();
  // await CategorySeeder();
  // await DirectionSeeder();
  // await LogicOperator();
  // await QuestionFieldTypeSeeder();
  await NotificationModelSeeder();
  // await ModuleSeeder();
  process.exit(0);
} catch (error) {
  console.log("Erreur d'exécution des seeders");
  throw error;
}
