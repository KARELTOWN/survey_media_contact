import { body, check, param, validationResult } from "express-validator";
import Category from "../../models/Category.js";
import { surveyFields, surveyOperators } from "../../utils/survey.js";
import SurveyTemplate from "../../models/SurveyTemplate.js";
import Question from "../../models/Question.js";
import { expressResultValidator } from "../requestValidator.js";
import moment from "moment";
import _ from "lodash";
import SurveyThemeSchema from "../../models/SurveyElementSchema/SurveyTheme.js";
import striptags from "striptags";
import validator from "validator";
import Formation from "../../models/Formation.js";
import TrainingModule from "../../models/TrainingModule.js";
import Chapter from "../../models/Chapter.js";
import Trainer from "../../models/Trainer.js";
import TrainingSession from "../../models/TrainingSession.js";
let theme_attributes = SurveyThemeSchema.obj;
const themeTextKeys = [
  "container_bg_img",
  "logo_url",
  "banner_url",
  "footer_text",
  "footer_contact_name",
  "footer_contact_email",
  "footer_contact_phone",
  "footer_contact_address",
  "footer_contact_hours",
  "form_width",
  "form_alignment",
  "form_spacing",
];
const themeBooleanKeys = ["show_footer_contact"];
const themeArrayKeys = ["footer_links"];
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
  expressResultValidator,
];

export const validateSurveyIdInBody = [
  body("survey_id")
    .notEmpty()
    .withMessage("L'identifiant du formulaire est obligatoire")
    .custom(async (value) => {
      const exist = await SurveyTemplate.exists({ _id: value });
      if (!exist) {
        throw new Error("Ce formulaire n'existe pas");
      }
      return true;
    }),
  expressResultValidator,
];

export const validatePublishSurvey = [
  body("survey_id")
    .notEmpty()
    .withMessage("L'identifiant du formulaire est obligatoire")
    .isMongoId()
    .withMessage("survey_id invalide"),
  body("publish")
    .isBoolean()
    .withMessage("publish doit être un booléen"),
  expressResultValidator,
];

export const surveyValidator = [
  body("form_id")
    .exists({ checkFalsy: true })
    .withMessage("form_id est requis")
    .isString()
    .withMessage("form_id doit être une chaîne de caractères")
    .isUUID("4")
    .withMessage("Un UUID est attendu")
    .custom(async (value, { req }) => {
      if (!req.body?.publish || req.body?.publish === false) {
        let form_id_exist = await SurveyTemplate.exists({ form_id: value });
        if (form_id_exist) {
          throw new Error("Formulaire déjà soumis");
        }
      }
      return true;
    }),

  body("theme")
    .isObject()
    .withMessage("Le thème est attendu")
    .custom((value) => {
      let keys = Object.keys(value);
      if (keys.length === 0) {
        throw new Error("Le thème ne peut pas être vide");
      }
      for (const key of Object.keys(theme_attributes)) {
        // Ignorer container_bg_img
        if (themeBooleanKeys.includes(key)) {
          if (value[key] !== undefined && !_.isBoolean(value[key])) {
            throw new Error(`La clé ${key} a une valeur invalide`);
          }
          continue;
        }
        if (themeArrayKeys.includes(key)) {
          if (value[key] !== undefined && !_.isArray(value[key])) {
            throw new Error(`La clé ${key} a une valeur invalide`);
          }
          continue;
        }
        if (themeTextKeys.includes(key)) {
          if (value[key] && !_.isString(value[key])) {
            throw new Error(`La clÃ© ${key} a une valeur invalide`);
          }
          continue;
        }

        // Vérifier que la clé existe et que la valeur est une couleur hex
        if (
          (!keys.includes(key) || !validator.isHexColor(value[key])) &&
          value[key]
        ) {
          throw new Error(`La clé ${key} a une valeur invalide`);
        }
      }
      return true;
    }),

  body("start_date")
    .optional()
    .custom((value) => {
      if (value && value !== undefined) {
        let date = moment(value).isValid();
        if (!date) {
          throw new Error("Une date est attendue");
        }
      }
      return true;
    }),

  body("end_date")
    .optional()
    .custom((value) => {
      if (value && value !== undefined) {
        let date = moment(value).isValid();
        if (!date) {
          throw new Error("Une date est attendue");
        }
      }
      return true;
    }),

  body("title")
    .exists({ checkFalsy: true })
    .withMessage("title est requis")
    .isString()
    .withMessage("title doit être une chaîne de caractères")
    .trim()
    .customSanitizer((value) => striptags(value)),

  body("description")
    .optional()
    .isString()
    .trim()
    .escape()
    .withMessage("description doit être une chaîne de caractères"),

  body("category_id")
    .exists({ checkFalsy: true })
    .withMessage("category est requis")
    .isMongoId()
    .withMessage("category doit être un ObjectId valide")
    .custom(async (value, { req }) => {
      let category = await Category.exists({
        _id: value,
        owner_id: req.owner_id,
        account_type_ref: req.account_type_ref,
      });
      if (!category) {
        throw new Error("La catégorie n'existe pas");
      }
      if (value.form_width && !["narrow", "medium", "wide", "full"].includes(value.form_width)) {
        throw new Error("Largeur du formulaire invalide");
      }
      if (value.form_alignment && !["left", "center"].includes(value.form_alignment)) {
        throw new Error("Alignement du formulaire invalide");
      }
      if (value.form_spacing && !["compact", "normal", "comfortable"].includes(value.form_spacing)) {
        throw new Error("Espacement du formulaire invalide");
      }
      return true;
    }),

  body("formation_id")
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage("formation_id invalide")
    .custom(async (value, { req }) => {
      const exist = await Formation.exists({
        _id: value,
        owner_id: req.owner_id,
        account_type_ref: req.account_type_ref,
      });
      if (!exist) throw new Error("La formation n'existe pas");
      return true;
    }),

  body("module_id")
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage("module_id invalide")
    .custom(async (value, { req }) => {
      const query = {
        _id: value,
        owner_id: req.owner_id,
        account_type_ref: req.account_type_ref,
      };
      if (req.body.formation_id) query.formation_id = req.body.formation_id;
      const exist = await TrainingModule.exists(query);
      if (!exist) throw new Error("Le module n'existe pas");
      return true;
    }),

  body("chapter_id")
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage("chapter_id invalide")
    .custom(async (value, { req }) => {
      const query = {
        _id: value,
        owner_id: req.owner_id,
        account_type_ref: req.account_type_ref,
      };
      if (req.body.module_id) query.module_id = req.body.module_id;
      const exist = await Chapter.exists(query);
      if (!exist) throw new Error("Le chapitre n'existe pas");
      return true;
    }),

  body("trainer_id")
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage("trainer_id invalide")
    .custom(async (value, { req }) => {
      const exist = await Trainer.exists({
        _id: value,
        owner_id: req.owner_id,
        account_type_ref: req.account_type_ref,
      });
      if (!exist) throw new Error("Le formateur n'existe pas");
      return true;
    }),

  body("session_id")
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage("session_id invalide")
    .custom(async (value, { req }) => {
      const query = {
        _id: value,
        owner_id: req.owner_id,
        account_type_ref: req.account_type_ref,
      };
      if (req.body.formation_id) query.formation_id = req.body.formation_id;
      const exist = await TrainingSession.exists(query);
      if (!exist) throw new Error("La session n'existe pas");
      return true;
    }),
  body("multiple_submission")
    .notEmpty()
    .withMessage("Le nombre de soumission est requis")
    .isBoolean()
    .withMessage("Le nombre de soumission doit être un boolean"),

  body("capture_mail")
    .notEmpty()
    .withMessage("Définissez si l'email doit être capturé")
    .isBoolean()
    .withMessage("Ce champ doit être un boolean"),
  body("response_mode")
    .optional()
    .isIn(["anonymous", "identified", "semi_anonymous"])
    .withMessage("Mode de réponse invalide"),
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

  body("questions.*.title")
    .custom((value, { req, path }) => {
      // Récupérer l’index de la question
      const match = path.match(/questions\.(\d+)\./);
      const index = match ? parseInt(match[1], 10) : null;

      if (index === null) return true; // sécurité

      const question = req.body.questions[index];
      if (question.category !== "image") {
        if (!value || typeof value !== "string" || value.trim() === "") {
          throw new Error(
            "title est requis et doit être une chaîne si category n'est pas 'image'"
          );
        }
      }

      return true;
    })
    .trim()
    .customSanitizer((value) => striptags(value)),

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

  expressResultValidator,
];

export const surveyModelValidator = [
  body("theme")
    .isObject()
    .withMessage("Le thème est attendu")
    .custom((value) => {
      let keys = Object.keys(value);
      if (keys.length === 0) {
        throw new Error("Le thème ne peut pas être vide");
      }
      for (const key of Object.keys(theme_attributes)) {
        if (themeBooleanKeys.includes(key)) {
          if (value[key] !== undefined && !_.isBoolean(value[key])) {
            throw new Error(`La clé ${key} a une valeur invalide`);
          }
          continue;
        }
        if (themeArrayKeys.includes(key)) {
          if (value[key] !== undefined && !_.isArray(value[key])) {
            throw new Error(`La clé ${key} a une valeur invalide`);
          }
          continue;
        }
        if (themeTextKeys.includes(key)) {
          if (value[key] && !_.isString(value[key])) {
            throw new Error(`La clÃ© ${key} a une valeur invalide`);
          }
          continue;
        }
        if (
          (!keys.includes(key) || !validator.isHexColor(value[key])) &&
          value[key]
        ) {
          throw new Error(`La clé ${key} a une valeur invalide`);
        }
      }
      return true;
    }),

  body("title")
    .exists({ checkFalsy: true })
    .withMessage("title est requis")
    .isString()
    .withMessage("title doit être une chaîne de caractères")
    .trim()
    .customSanitizer((value) => striptags(value)),

  body("description")
    .optional()
    .isString()
    .trim()
    .escape()
    .withMessage("description doit être une chaîne de caractères"),

  body("category_id")
    .exists({ checkFalsy: true })
    .withMessage("category est requis")
    .isMongoId()
    .withMessage("category doit être un ObjectId valide")
    .custom(async (value, { req }) => {
      let category = await Category.exists({
        _id: value,
        owner_id: req.owner_id,
        account_type_ref: req.account_type_ref,
      });
      if (!category) {
        throw new Error("La catégorie n'existe pas");
      }
      if (value.form_width && !["narrow", "medium", "wide", "full"].includes(value.form_width)) {
        throw new Error("Largeur du formulaire invalide");
      }
      if (value.form_alignment && !["left", "center"].includes(value.form_alignment)) {
        throw new Error("Alignement du formulaire invalide");
      }
      if (value.form_spacing && !["compact", "normal", "comfortable"].includes(value.form_spacing)) {
        throw new Error("Espacement du formulaire invalide");
      }
      return true;
    }),

  body("formation_id")
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage("formation_id invalide"),
  body("module_id")
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage("module_id invalide"),
  body("chapter_id")
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage("chapter_id invalide"),
  body("trainer_id")
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage("trainer_id invalide"),
  body("session_id")
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage("session_id invalide"),
  body("multiple_submission")
    .notEmpty()
    .withMessage("Le nombre de soumission est requis")
    .isBoolean()
    .withMessage("Le nombre de soumission doit être un boolean"),

  body("capture_mail")
    .notEmpty()
    .withMessage("Définissez si l'email doit être capturé")
    .isBoolean()
    .withMessage("Ce champ doit être un boolean"),
  body("response_mode")
    .optional()
    .isIn(["anonymous", "identified", "semi_anonymous"])
    .withMessage("Mode de réponse invalide"),
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

  body("questions.*.title")
    .custom((value, { req, path }) => {
      // Récupérer l’index de la question
      const match = path.match(/questions\.(\d+)\./);
      const index = match ? parseInt(match[1], 10) : null;

      if (index === null) return true; // sécurité

      const question = req.body.questions[index];
      if (question.category !== "image") {
        if (!value || typeof value !== "string" || value.trim() === "") {
          throw new Error(
            "title est requis et doit être une chaîne si category n'est pas 'image'"
          );
        }
      }

      return true;
    })
    .trim()
    .customSanitizer((value) => striptags(value)),

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

  expressResultValidator,
];

export const surveyResponseValidator = [
  body("responses.*.question")
    .notEmpty()
    .withMessage("La question est obligatoire")
    .isUUID()
    .withMessage("Une chaine de caractères est attendue")
    .custom(async (question, { req, path }) => {
      let exist = await Question.exists({ _id: question });
      if (!exist) {
        throw new Error("La question n'existe pas");
      }
      return true;
    }),

  body("responses.*.response")
    .notEmpty()
    .withMessage("La réponse est obligatoire"),

  body("metadata")
    .notEmpty()
    .withMessage("Metadata obligatoire")
    .isObject()
    .withMessage("Un objet est attendu")
    .custom((value) => {
      if (
        value["user_agent"] == undefined ||
        !_.isString(value["user_agent"])
      ) {
        throw new Error("Les métadata sont attendus");
      }
      return true;
    }),

  expressResultValidator,
];

export const validateDateFilter = [
  body("start_date")
    .optional()
    .custom((value, { req }) => {
      if (value && value !== undefined) {
        if (!moment(value).isValid()) {
          throw new Error("Date de début invalide");
        }
      }
   
      return true;
    }),
  body("end_date")
    .optional()
    .custom((value, { req }) => {
      if (value && value !== undefined) {
        if (!moment(value).isValid()) {
          throw new Error("Date de fin invalide");
        }
      }
     
      return true;
    }),
  expressResultValidator,
];
