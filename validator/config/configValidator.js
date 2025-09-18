import { body, param, validationResult } from "express-validator";
import _ from "lodash";

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
  body("adress").notEmpty().withMessage("L'adresse est obligatoire"),
  body("phone").notEmpty().withMessage("Le téléphone est obligatoire"),
  body("open_hours")
    .notEmpty()
    .withMessage("L'heure de travaille est obligatoire"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];
