import { body, param, validationResult } from "express-validator";
import Topic from "../../models/Topic.js";
import _ from "lodash";
import topicService from "../../services/topic/topicService.js";
import Category from "../../models/Category.js";
import { expressResultValidator } from "../requestValidator.js";
const { checkTopicExist, checkCategoryExist } = topicService();

export const validateStoreTopic = [
  body("libelle")
    .notEmpty()
    .withMessage("Le libelle est obligatoire")
    .custom(async (value) => {
      console.log("data", value);

      const topic = await Topic.exists({ libelle: value });
      if (topic) {
        throw new Error("Existe déjà");
      }
      return true;
    }),
];

export const validateStoreCategory = [
  body("topic_id")
    .notEmpty()
    .withMessage("La thématique est obligatoire")
    .custom(async (value) => {
      let exist = await checkTopicExist(value);
      if (!exist) {
        throw new Error("La thématique n'existe pas");
      }
      return true;
    }),

  body("libelle")
    .notEmpty()
    .withMessage("Le libelle est obligatoire")
    .custom(async (value, { req }) => {
      const topic = await Category.exists({
        libelle: value,
        topic_id: req.body.topic_id,
      });
      if (topic) {
        throw new Error("Existe déjà");
      }
      return true;
    }),
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
    .trim()
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
    }),
  expressResultValidator,
];

export const validateUpdateCategory = [
  body("libelle")
    .notEmpty()
    .withMessage("Le libelle est obligatoire")
    .trim()
    .custom(async (value, { req }) => {
      const { topic_id } = req.params;
      const { category_id } = req.body;
      const categ = await Category.exists({
        libelle: value,
        topic_id: topic_id,
        _id: { $nin: [category_id] },
      });
      if (categ) {
        throw new Error("Existe déjà");
      }
      return true;
    }),
  body("topic_id")
    .notEmpty()
    .withMessage("La catégorie est obligatoire")
    .custom(async (value) => {
      let exist = await checkTopicExist(value);
      if (!exist) {
        throw new Error("La thématique n'existe pas");
      }
      return true;
    }),
  expressResultValidator,
];

export const validateFilterTopic = [
  body("search")
    .optional()
    .isString()
    .withMessage("Un chaine de caractère est attendu"),
  expressResultValidator,
];

export const validateFilterCategory = [
  body("search")
    .optional()
    .isString()
    .withMessage("Un chaine de caractère est attendu"),
  expressResultValidator,
];

