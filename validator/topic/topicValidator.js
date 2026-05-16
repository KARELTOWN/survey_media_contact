import { body, param } from "express-validator";
import Topic from "../../models/Topic.js";
import topicService from "../../services/topic/topicService.js";
import Category from "../../models/Category.js";
import { expressResultValidator } from "../requestValidator.js";
import striptags from "striptags";

const { checkTopicExist, checkCategoryExist } = topicService();

export const validateStoreTopic = [
  body("libelle")
    .notEmpty()
    .withMessage("Le libelle est obligatoire")
    .custom(async (value) => {
      const topic = await Topic.exists({ libelle: value });
      if (topic) {
        throw new Error("Existe déjà");
      }
      return true;
    })
    .trim()
    .customSanitizer((value) => striptags(value)),
];

export const validateStoreCategory = [
  body("libelle")
    .notEmpty()
    .withMessage("Le libelle est obligatoire")
    .custom(async (value, { req }) => {
      const category = await Category.exists({
        libelle: value,
        owner_id: req.owner_id,
        account_type_ref: req.account_type_ref,
      });
      if (category) {
        throw new Error("Existe déjà");
      }
      return true;
    })
    .trim()
    .customSanitizer((value) => striptags(value)),
  expressResultValidator,
];

export const validateIdTopic = [
  param("topic_id")
    .notEmpty()
    .withMessage("La thématique est obligatoire")
    .custom(async (value) => {
      let exist = await checkTopicExist(value);
      if (!exist) {
        throw new Error("La thématique n'existe pas");
      }
      return true;
    }),
  expressResultValidator,
];

export const validateIdCategory = [
  param("category_id")
    .notEmpty()
    .withMessage("La catégorie est obligatoire")
    .custom(async (value) => {
      let exist = await checkCategoryExist(value);
      if (!exist) {
        throw new Error("La catégorie n'existe pas");
      }
      return true;
    }),
  expressResultValidator,
];

export const validateUpdateTopic = [
  body("libelle")
    .notEmpty()
    .withMessage("Le libelle est obligatoire")
    .custom(async (value, { req }) => {
      const { topic_id } = req.params;
      const topic = await Topic.exists({
        libelle: value,
        _id: { $nin: [topic_id] },
      });
      if (topic) {
        throw new Error("Existe déjà");
      }
      return true;
    })
    .trim()
    .customSanitizer((value) => striptags(value)),
  expressResultValidator,
];

export const validateUpdateCategory = [
  body("libelle")
    .notEmpty()
    .withMessage("Le libelle est obligatoire")
    .trim()
    .custom(async (value, { req }) => {
      const { category_id } = req.body;
      const categ = await Category.exists({
        libelle: value,
        owner_id: req.owner_id,
        account_type_ref: req.account_type_ref,
        _id: { $nin: [category_id] },
      });
      if (categ) {
        throw new Error("Existe déjà");
      }
      return true;
    })
    .trim()
    .customSanitizer((value) => striptags(value)),
  expressResultValidator,
];

export const validateFilterTopic = [
  body("search")
    .optional()
    .isString()
    .withMessage("Une chaine de caractère est attendue")
    .trim()
    .customSanitizer((value) => striptags(value)),
  expressResultValidator,
];

export const validateFilterCategory = [
  body("search")
    .optional()
    .isString()
    .withMessage("Une chaine de caractère est attendue")
    .trim()
    .customSanitizer((value) => striptags(value)),
  expressResultValidator,
];
