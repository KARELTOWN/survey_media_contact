import { body, param, validationResult } from "express-validator";
import _ from "lodash";
import { expressResultValidator } from "../requestValidator.js";

export const validateConfigUpdate = [
  body("logo")
    .notEmpty()
    .withMessage("Le logo est obligatoire")
    .custom(async (value) => {
      if (!value.startsWith("data:image/")) {
        throw new Error("L'image au format non approprié");
      }
      return true;
    }),
  // body("adress")
  //   .optional()
  //   .custom((value, { req }) => {
  //     if (
  //       req.account_type_ref === "enterprise" &&
  //       (!value || value == undefined)
  //     ) {
  //       throw new Error("Adresse obligatoire");
  //     }
  //     return true;
  //   }),
  // body("phone")
  //   .optional()
  //   .custom((value, { req }) => {
  //     if (
  //       req.account_type_ref === "enterprise" &&
  //       (!value || value == undefined)
  //     ) {
  //       throw new Error("Téléphone obligatoire");
  //     }
  //     return true;
  //   }),
  // body("open_hours")
  //   .optional()
  //   .custom((value, { req }) => {
  //     if (
  //       req.account_type_ref === "enterprise" &&
  //       (!value || value == undefined)
  //     ) {
  //       throw new Error("Horaires d'ouvertures obligatoires");
  //     }
  //     return true;
  //   }),
  expressResultValidator,
];
