import { body, param, validationResult } from "express-validator";
import Role from "../../models/Role.js";
import Permission from "../../models/Permission.js";
import { expressResultValidator } from "../requestValidator.js";

export const validateStoreRole = [
  body("libelle")
    .notEmpty()
    .withMessage("Libelle obligatoire")
    .custom(async (value) => {
      let exist = await Role.exists({ libelle: value, owner_id: req.ownerId });
      if (exist) {
        throw new Error("Role existe déjà");
      }
      return true;
    }),
  expressResultValidator,
];

export const validateUpdateRole = [
  param("role_id")
    .notEmpty()
    .withMessage("Role obligatoire")
    .custom(async (value) => {
      let exist = await Role.findOne({ _id: value, owner_id: req.ownerId });
      if (!exist) {
        throw new Error("Role non trouvé");
      }
      return true;
    }),
  body("libelle")
    .notEmpty()
    .withMessage("Libelle obligatoire")
    .custom(async (value, { req }) => {
      let exist = await Role.exists({
        libelle: value,
        _id: { $ne: req.params.role_id },
      });
      if (exist) {
        throw new Error("Role existe déjà");
      }
      return true;
    }),
  expressResultValidator,
];

export const validateRoleId = [
  param("role_id")
    .notEmpty()
    .withMessage("Role obligatoire")
    .custom(async (value) => {
      let exist = await Role.findOne({ _id: value, owner_id: req.ownerId });
      if (!exist) {
        throw new Error("Role non trouvé");
      }
      return true;
    }),
  expressResultValidator,
];

export const validatePermission = [
  param("permission_id")
    .notEmpty()
    .withMessage("Permission obligatoire")
    .custom(async (value) => {
      let exist = await Permission.findById(value);
      if (!exist) {
        throw new Error("Permission non trouvée");
      }
      return true;
    }),
  expressResultValidator,
];
