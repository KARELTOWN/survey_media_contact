import { body, check, validationResult } from "express-validator";
import Topic from "../../models/Topic.js";
import Category from "../../models/Category.js";
import QuestionFieldType from "../../models/QuestionFieldType.js";
import { surveyOperators } from "../../utils/survey.js";
/**
 * Validator pour SurveyTemplate
 */
export const surveyValidator = [
  // Champs principaux du survey
  body("form_id")
    .exists({ checkFalsy: true })
    .withMessage("form_id est requis")
    .isString()
    .withMessage("form_id doit être une chaîne de caractères"),

  body("title")
    .exists({ checkFalsy: true })
    .withMessage("title est requis")
    .isString()
    .withMessage("title doit être une chaîne de caractères"),

  body("description")
    .exists({ checkFalsy: true })
    .withMessage("description est requis")
    .isString()
    .withMessage("description doit être une chaîne de caractères"),

  body("topic")
    .exists({ checkFalsy: true })
    .withMessage("topic est requis")
    .isMongoId()
    .withMessage("topic doit être un ObjectId valide")
    .custom(async (value) => {
      let topic = await Topic.exists({ libelle: value });
      if (!topic) {
        throw new Error("La thématique n'existe pas");
      }
    }),

  body("category")
    .exists({ checkFalsy: true })
    .withMessage("category est requis")
    .isMongoId()
    .withMessage("category doit être un ObjectId valide")
    .custom(async (value, { req }) => {
      let topic = await Category.exists({
        libelle: value,
        topic_id: req.body.topic,
      });
      if (!topic) {
        throw new Error("La thématique n'existe pas");
      }
    }),

  body("lastEdit")
    .exists({ checkFalsy: true })
    .withMessage("lastEdit est requis")
    .isDate()
    .withMessage("lastEdit doit être une date valide"),

  // Validation des questions imbriquées
  body("questions")
    .isArray({ min: 1 })
    .withMessage("Le formulaire doit contenir au moins une question"),

  body("questions.*.question_id")
    .exists({ checkFalsy: true })
    .withMessage("question_id est requis")
    .isString()
    .isUUID()
    .withMessage("question_id doit être une chaîne de caractères"),

  body("questions.*.title")
    .exists({ checkFalsy: true })
    .withMessage("Le titre de la question est requis")
    .isString()
    .withMessage("title doit être une chaîne de caractères"),

  body("questions.*.type_field")
    .optional()
    .isString()
    .withMessage("type_field doit être une chaîne"),

  body("questions.*.category")
    .exists({ checkFalsy: true })
    .withMessage("category est requis")
    .isString()
    .withMessage("category doit être une chaîne"),

  body("questions.*.field_libelle")
    .optional()
    .isString()
    .withMessage("field_libelle doit être une chaîne")
    .custom(async (value, { req }) => {
      let field = await QuestionFieldType.exists({
        libelle: value,
      });
      if (!field) {
        throw new Error("Le champ " + req.body.field_libelle + "est inconnu");
      }
    }),

  // Condition
  body("questions.*.condition")
    .optional()
    .custom((condition) => {
      if (condition.display && !["hide", "show"].includes(condition.display)) {
        throw new Error('display doit être "hide" ou "show"');
      }
      if (
        condition.operator &&
        !surveyOperators.includes(
          condition.operator
        )
      ) {
        throw new Error("operator invalide");
      }
      return true;
    }),

  // Field params
  body("questions.*.field_params")
    .optional()
    .custom((fp) => {
      if (fp.accept) {
        const validTypes = [
          "image",
          "video",
          "pdf",
          "word",
          "excel",
          "powerpoint",
        ];
        for (let type of fp.accept) {
          if (!validTypes.includes(type))
            throw new Error(`Type de fichier invalide: ${type}`);
        }
      }
      if (fp.max_size && typeof fp.max_size !== "number")
        throw new Error("max_size doit être un nombre");
      if (fp.multiple && typeof fp.multiple !== "boolean")
        throw new Error("multiple doit être un booléen");
      return true;
    }),

  // Required
  body("questions.*.required")
    .exists()
    .withMessage("Le champ required est obligatoire")
    .isBoolean()
    .withMessage("required doit être un booléen"),

  // Middleware pour récupérer les erreurs
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];
