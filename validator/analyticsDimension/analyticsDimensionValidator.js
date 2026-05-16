import { body, param } from "express-validator";
import Formation from "../../models/Formation.js";
import TrainingModule from "../../models/TrainingModule.js";
import { expressResultValidator } from "../requestValidator.js";
import moment from "moment";

export const validateId = [
  param("id").isMongoId().withMessage("Identifiant invalide"),
  expressResultValidator,
];

export const validateFormation = [
  body("nom").notEmpty().withMessage("Le nom est obligatoire").isString().trim(),
  body("description").optional().isString().trim(),
  expressResultValidator,
];

export const validateModule = [
  body("formation_id")
    .notEmpty()
    .withMessage("La formation est obligatoire")
    .isMongoId()
    .withMessage("Formation invalide")
    .custom(async (value, { req }) => {
      const formation = await Formation.exists({
        _id: value,
        owner_id: req.owner_id,
        account_type_ref: req.account_type_ref,
      });
      if (!formation) throw new Error("Formation introuvable");
      return true;
    }),
  body("nom").notEmpty().withMessage("Le nom est obligatoire").isString().trim(),
  expressResultValidator,
];

export const validateChapter = [
  body("module_id")
    .notEmpty()
    .withMessage("Le module est obligatoire")
    .isMongoId()
    .withMessage("Module invalide")
    .custom(async (value, { req }) => {
      const module = await TrainingModule.exists({
        _id: value,
        owner_id: req.owner_id,
        account_type_ref: req.account_type_ref,
      });
      if (!module) throw new Error("Module introuvable");
      return true;
    }),
  body("nom").notEmpty().withMessage("Le nom est obligatoire").isString().trim(),
  expressResultValidator,
];

export const validateTrainer = [
  body("nom").notEmpty().withMessage("Le nom est obligatoire").isString().trim(),
  body("email").optional({ checkFalsy: true }).isEmail().withMessage("Email invalide"),
  expressResultValidator,
];

export const validateSession = [
  body("formation_id")
    .notEmpty()
    .withMessage("La formation est obligatoire")
    .isMongoId()
    .withMessage("Formation invalide")
    .custom(async (value, { req }) => {
      const formation = await Formation.exists({
        _id: value,
        owner_id: req.owner_id,
        account_type_ref: req.account_type_ref,
      });
      if (!formation) throw new Error("Formation introuvable");
      return true;
    }),
  body("libelle").notEmpty().withMessage("Le libelle est obligatoire").isString().trim(),
  body("date_debut")
    .notEmpty()
    .withMessage("La date de debut est obligatoire")
    .custom((value) => moment(value).isValid())
    .withMessage("Date de debut invalide"),
  body("date_fin")
    .notEmpty()
    .withMessage("La date de fin est obligatoire")
    .custom((value, { req }) => {
      if (!moment(value).isValid()) return false;
      return moment(value).isSameOrAfter(moment(req.body.date_debut));
    })
    .withMessage("Date de fin invalide"),
  expressResultValidator,
];
