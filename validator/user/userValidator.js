import { body, param, validationResult } from "express-validator";
import User from "../../models/User.js";
import Role from "../../models/Role.js";
import UserCompany from "../../models/UserCompany.js";
import { expressResultValidator } from "../requestValidator.js";

export const validateAddUser = [
  body("email")
    .notEmpty()
    .withMessage("Le champ EMAIL est obligatoire")
    .isEmail()
    .withMessage("EMAIL invalide")
    .escape()
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: value }).exec();
      if (!user) {
        throw new Error("Compte non trouvé");
      }
      let user_exist_in_company = await UserCompany.exists({
        user_id: user._id,
      });
      if (user_exist_in_company) {
        throw new Error("Utilisateur déjà associé");
      }
      return true;
    }),
  body("role_id")
    .notEmpty()
    .withMessage("Le role est obligatoire")
    .custom(async (value, { req }) => {
      let role = await Role.exists({
        _id: value,
        owner_id: req.ownerId,
        account_type_ref: req.account_type_ref,
      });
      if (!role) {
        throw new Error("Le role n'existe pas");
      }
      return true;
    }),
  expressResultValidator,
];

export const validateUserCompanyId = [
  body("user_company")
    .notEmpty()
    .withMessage("User company obligatoire")
    .custom(async (value) => {
      if (value && value !== null) {
        let user = await UserCompany.findById(value);
        if (!user) {
          throw new Error("User company n'existe pas");
        }
        return true;
      }
    }),
  expressResultValidator,
];

export const validateAddUserCompany = [
  body("role_id")
    .notEmpty()
    .withMessage("Role obligatoire")
    .custom(async (value, { req }) => {
      let role = await Role.exists({ _id: value, owner_id: req.ownerId });
      if (!role) {
        throw new Error("Role n'existe pas");
      }
      return true;
    }),
  body("email")
    .notEmpty()
    .withMessage("Email obligatoire")
    .custom(async (value, { req }) => {
      let user = await User.exists({ email: value });
      if (!user) {
        throw new Error("Utilisateur inconnu");
      }
      return true;
    }),
  expressResultValidator,
];
