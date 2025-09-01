import { body, param } from "express-validator";
import Topic from "../../models/Topic.js";
import _ from "lodash";
import { checkTopicExist } from "../../services/topic/topicService.js";

export const validateStoreTopic = [
  body("libelle")
    .notEmpty()
    .withMessage("Le libelle est obligatoire")
    .custom(async (value) => {
      const topic = await checkTopicExist(value);
      if (topic) {
        throw new Error("Existe déjà");
      }
      return true;
    }),
];

export const validateIdTopic = [
  param("topic_id")
    .notEmpty()
    .withMessage("La thématique est obligatoire")
    .custom(async (value) => {
      let exist = await checkTopicExist(value);
      if (!exist) {
        throw new Error("La thématique existe pas");
      }
      return true;
    }),
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
];

export const validateFilterTopic = [
  body("search")
    .optional()
    .isString()
    .withMessage("Un chaine de caractère est attendu"),
];
