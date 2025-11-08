import { body, param, validationResult } from "express-validator";
import _ from "lodash";
import companyService from "../../services/company/companyService.js";
import Company from "../../models/Company.js";
import { expressResultValidator } from "../requestValidator.js";
import striptags from "striptags";
const { checkCompanyExist } = companyService();

export const validateStoreCompany = [
  body("denomination")
    .notEmpty()
    .withMessage("La dénomination est obligatoire")
    .trim()
    .customSanitizer((value) => striptags(value)),
  body("logo")
    .notEmpty()
    .withMessage("Le logo est obligatoire")
    .custom(async (value) => {
      if (!value.startsWith("data:image/")) {
        throw new Error("L'image au format non approprié");
      }
      return true;
    }),
  body("adress")
    .notEmpty()
    .withMessage("L'adresse est obligatoire")
    .trim()
    .customSanitizer((value) => striptags(value)),
  body("phone")
    .notEmpty()
    .withMessage("Le téléphone est obligatoire")
    .trim()
    .customSanitizer((value) => striptags(value)),
  body("email")
    .notEmpty()
    .withMessage("Le téléphone est obligatoire")
    .isEmail()
    .withMessage("Email invalide")
    .trim()
    .normalizeEmail(),

  body("open_hours")
    .notEmpty()
    .withMessage("L'heure de travaille est obligatoire")
    .trim()
    .customSanitizer((value) => striptags(value)),
  expressResultValidator,
];

export const validateIdCompany = [
  param("company_id")
    .notEmpty()
    .withMessage("La société est obligatoire")
    .custom(async (value) => {
      let exist = await checkCompanyExist(value);
      if (!exist) {
        throw new Error("La société n'existe pas");
      }
      return true;
    }),
  expressResultValidator,
];

export const validateUpdateCompany = [
  body("denomination")
    .notEmpty()
    .withMessage("La dénomination est obligatoire")
    .trim()
    .customSanitizer((value) => striptags(value)),
  body("logo")
    .notEmpty()
    .withMessage("Le logo est obligatoire")
    .custom(async (value) => {
      if (!value.startsWith("data:image/")) {
        throw new Error("L'image au format non approprié");
      }
      return true;
    }),
  body("adress")
    .notEmpty()
    .withMessage("L'adresse est obligatoire")
    .trim()
    .customSanitizer((value) => striptags(value)),
  body("phone")
    .notEmpty()
    .withMessage("Le téléphone est obligatoire")
    .trim()
    .customSanitizer((value) => striptags(value)),
  body("email")
    .notEmpty()
    .withMessage("Le téléphone est obligatoire")
    .isEmail()
    .withMessage("Email invalide")
    .trim()
    .normalizeEmail(),

  body("open_hours")
    .notEmpty()
    .withMessage("L'heure de travaille est obligatoire")
    .trim()
    .customSanitizer((value) => striptags(value)),
  expressResultValidator,
];
