import { body, param, validationResult } from "express-validator";
import User from "../../models/User.js";
import Role from "../../models/Role.js";
import UserCompany from "../../models/UserCompany.js";
import { expressResultValidator } from "../requestValidator.js";
import { decrypt } from "../../helpers/encrypt.js";
import moment from "moment";
import { redisClient } from "../../config/redis.js";
import Company from "../../models/Company.js";

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
        owner_id: req.owner_id,
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
        let user_company = await UserCompany.findById(value);
        let company = await Company.findById(user_company.company_id).select(
          "created_by"
        );
        if (user_company.user_id.toString() == company.created_by.toString()) {
          throw new Error("Vous ne pouvez pas retirer cet utilisateur");
        }
        if (!user_company) {
          throw new Error("User company n'existe pas");
        }
        return true;
      }
    }),
  expressResultValidator,
];

export const validateAcceptInvitation = [
  body("token")
    .notEmpty()
    .withMessage("Token obligatoire")
    .custom(async (value, { req }) => {
      let token = decrypt(value);

      const blacklist = await redisClient.get(token);
      if (blacklist) {
        throw new Error("Token invalide");
      }

      let tokenData = token.split("@");
      if (!Array.isArray(tokenData) || tokenData.length !== 2) {
        throw new Error("Token invalide");
      }
      const date = moment(tokenData[1], moment.ISO_8601, true);
      if (!date.isValid()) {
        throw new Error("Token invalide");
      }

      let now = moment();
      if (now.isAfter(date)) {
        throw new Error("Le lien d'invitation a expiré");
      }

      let user_company = await UserCompany.findById(tokenData[0]);
      if (!user_company) {
        throw new Error("Données invalides");
      }

      if (user_company.user_id.toString() !== req.user._id.toString()) {
        throw new Error("Invitation invalide");
      }
      req.user_company = tokenData[0];
      req.expiration = date;
      req.token = token;
      return true;
    }),
  expressResultValidator,
];

export const validateAddUserCompany = [
  body("role_id")
    .notEmpty()
    .withMessage("Role obligatoire")
    .custom(async (value, { req }) => {
      let role = await Role.exists({ _id: value, owner_id: req.owner_id });
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
