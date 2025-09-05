import { body, check, param, validationResult } from "express-validator";
import Topic from "../../models/Topic.js";
import Category from "../../models/Category.js";
import { surveyFields, surveyOperators } from "../../utils/survey.js";
import SurveyTemplate from "../../models/SurveyTemplate.js";
import Question from "../../models/Question.js";
/**
 * Validator pour SurveyTemplate
 */

export const validateSurveyId = [
  param("survey_id")
    .notEmpty()
    .withMessage("L'identifiant du formulaire est obligatoire")
    .custom(async (value) => {
      const exist = await SurveyTemplate.exists({ _id: value });
      if (!exist) {
        throw new Error("Ce formulaire n'existe pas");
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];

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
    .optional()
    .isString()
    .withMessage("description doit être une chaîne de caractères"),

  body("topic_id")
    .exists({ checkFalsy: true })
    .withMessage("topic est requis")
    .isMongoId()
    .withMessage("topic doit être un ObjectId valide")
    .custom(async (value) => {
      let topic = await Topic.exists({ _id: value });
      if (!topic) {
        throw new Error("La thématique n'existe pas");
      }
      return true;
    }),

  body("category_id")
    .exists({ checkFalsy: true })
    .withMessage("category est requis")
    .isMongoId()
    .withMessage("category doit être un ObjectId valide")
    .custom(async (value, { req }) => {
      let topic = await Category.exists({
        _id: value,
        topic_id: req.body.topic_id,
      });
      if (!topic) {
        throw new Error("La thématique n'existe pas");
      }
      return true;
    }),

  body("lastEdit")
    .exists({ checkFalsy: true })
    .withMessage("lastEdit est requis")
    .custom((value) => {
      if (!Number.isInteger(value))
        throw new Error("Date en timestamp attendu");
      return true;
    }),

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

  body("questions.*.img")
    .optional()
    .isString()
    .withMessage("Une chaine de caractère est attendue"),

  body("questions.*.description")
    .optional()
    .isString()
    .withMessage("Une chaine de caractère est attendue"),

  body("questions.*.title").custom((value, { req, path }) => {
    // Récupérer l’index de la question
    const match = path.match(/questions\.(\d+)\./);
    const index = match ? parseInt(match[1], 10) : null;

    if (index === null) return true; // sécurité

    const question = req.body.questions[index];
    console.log(index, question.category);
    if (question.category !== "image") {
      if (!value || typeof value !== "string" || value.trim() === "") {
        throw new Error(
          "title est requis et doit être une chaîne si category n'est pas 'image'"
        );
      }
    }

    return true;
  }),

  body("questions.*.category")
    .exists({ checkFalsy: true })
    .withMessage("category est requis")
    .isString()
    .withMessage("category doit être une chaîne"),

  body("questions.*.type_field")
    .optional()
    .isString()
    .withMessage("type_field doit être une chaîne"),

  body("questions.*.field_libelle")
    .optional()
    .isString()
    .withMessage("field_libelle doit être une chaîne")
    .custom(async (value, { req, path }) => {
      // path = questions.0.field_libelle par ex.
      // On peut extraire l'index du tableau
      const match = path.match(/questions\[(\d+)\]\.field_libelle/);
      const index = match ? parseInt(match[1], 10) : null;

      if (index !== null) {
        const type_field = req.body.questions[index].type_field;
        const field = surveyFields.find(
          (e) => e.libelle === value && e.field === type_field
        );
        if (!field) {
          throw new Error(
            `Le champ "${value}" est inconnu ou ne correspond pas au type_field "${type_field}"`
          );
        }
      } else {
        throw new Error(`Validation impossible pour le champ "${value}"`);
      }
    }),

  // Condition
  body("questions.*.condition")
    .optional()
    .custom((condition) => {
      if (condition.display && !["hide", "show"].includes(condition.display)) {
        throw new Error('display doit être "hide" ou "show"');
      }
      let operatorMath = surveyOperators.map((e) => e.value);
      if (condition.operator && !operatorMath.includes(condition.operator)) {
        throw new Error("Opérateur de condition invalide");
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
  body("questions.*.required").custom((value, { req, path }) => {
    // Récupère l'index de la question dans "questions"
    const match = path.match(/questions\[(\d+)\]\.field_libelle/);
    const index = match ? parseInt(match[1], 10) : null;

    if (index === null) return true; // sécurité

    const question = req.body.questions[index];

    // Si category !== "image", required doit exister et être booléen
    if (question.category !== "image") {
      if (value === undefined) {
        throw new Error(
          "Le champ required est obligatoire si category n'est pas 'image'"
        );
      }
      if (typeof value !== "boolean") {
        throw new Error("required doit être un booléen");
      }
    }

    return true;
  }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];

export const surveyResponseValidator = [
  body("responses.*.question")
    .notEmpty()
    .withMessage("La question est obligatoire")
    .isUUID()
    .withMessage("Une chaine de caractères est attendue")
    .custom(async (question, { req, path }) => {
      let exist = await Question.exists({ question_id: question });
      if (!exist) {
        throw new Error("La question n'existe pas");
      }
      return true;
    }),

  body("responses.*.response")
    .notEmpty()
    .withMessage("La réponse est obligatoire"),

  body("metadata").optional(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];
