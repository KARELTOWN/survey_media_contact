import { body, param } from "express-validator";
import Direction from "../../models/Direction.js";
import _ from "lodash";
import { checkDirectionExist } from "../../services/direction/directionService.js";

export const validateStoreDirection = [
  body("libelle")
    .notEmpty()
    .withMessage("Le libelle est obligatoire")
    .custom(async (value) => {
      const direction = await checkDirectionExist(value);
      if (direction) {
        throw new Error("Existe déjà");
      }
      return true;
    }),
];

export const validateIdDirection = [
  param("direction_id")
    .notEmpty()
    .withMessage("La direction est obligatoire")
    .custom(async (value) => {
      let exist = await checkDirectionExist(value);
      if (!exist) {
        throw new Error("La direction n'existe pas");
      }
      return true;
    }),
];

export const validateUpdateDirection = [
  body("libelle")
    .notEmpty()
    .withMessage("Le libelle est obligatoire")
    .trim()
    .custom(async (value, { req }) => {
      const { direction_id } = req.params;
      const direction = await Direction.exists({
        libelle: value,
        _id: { $nin: [direction_id] },
      });
      if (direction) {
        throw new Error("Existe déjà");
      }
      return true;
    }),
];

export const validateFilterDirection = [
  body("search")
    .optional()
    .isString()
    .withMessage("Un chaine de caractère est attendu"),
];
