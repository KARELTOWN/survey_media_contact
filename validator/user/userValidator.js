import { body, param } from "express-validator";
import User from "../../models/User.js";
import Role from "../../models/Role.js";
import Fonction from "../../models/Fonction.js";
import Direction from "../../models/Direction.js";

export const validateAddUser = [
  body("lastname")
    .notEmpty()
    .withMessage("Le nom est obligatoire")
    .isLength({ min: 1 })
    .withMessage("Renseignez au moins 2 caractères")
    .escape(),
  body("firstname")
    .notEmpty()
    .withMessage("Le prénom est obligatoire")
    .isLength({ min: 1 })
    .withMessage("Renseignez au moins 2 caractères")
    .escape(),
  body("code")
    .notEmpty()
    .withMessage("code est obligatoire")
    .isNumeric()
    .withMessage("Un nombre est attendu"),
  body("phone")
    .notEmpty()
    .withMessage("Téléphone est obligatoire")
    .isNumeric()
    .withMessage("Un nombre est attendu"),
  body("email")
    .notEmpty()
    .withMessage("Le champ EMAIL est obligatoire")
    .isEmail()
    .withMessage("EMAIL invalide")
    .escape()
    .custom(async (value) => {
      const user = await User.find({ email: value }).exec();
      if (user.length > 0) {
        throw new Error("Ce email est déjà utilisé");
      }
      return true;
    }),

  body("role_id")
    .notEmpty()
    .withMessage("Le role est obligatoire")
    .custom(async (value) => {
      let role = await Role.exists({ _id: value });
      if (!role) {
        throw new Error("Le role n'existe pas");
      }
      return true;
    }),

  body("direction_id")
    .notEmpty()
    .withMessage("La direction est obligatoire")
    .custom(async (value) => {
      let direction = await Direction.exists({ _id: value });
      if (!direction) {
        throw new Error("La direction n'existe pas");
      }
      return true;
    }),

  body("fonction_id")
    .optional()
    .custom(async (value, { req }) => {
      if (value && value !== null && value !== undefined && value !== '') {
        const { direction_id } = req.body;
        let fonction = await Fonction.findOne({
          _id: value,
          direction_id: direction_id,
        });
        if (!fonction) {
          throw new Error("La fonction n'existe pas");
        } else {
          if (fonction.is_unique === true) {
            let user_exist = await User.exists({ fonction_id: value });
            if (user_exist === true) {
              throw new Error("Un utilisateur a déjà cette fonction");
            }
          }
        }
      }

      return true;
    }),
];
