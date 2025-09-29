import express from "express";
const TopicRouter = express.Router();
import {
  validateStoreTopic,
  validateIdTopic,
  validateUpdateTopic,
  validateFilterTopic,
  validateStoreCategory,
} from "../../validator/topic/topicValidator.js";

import topicController from "../../controllers/topic/topicController.js";

const {
  createTopic,
  getTopics,
  filterTopics,
  updateTopic,
  getCategoryInTopic,
  createCategory,
} = topicController();
import paginateData from "../../helpers/pagination.js";
import { validatePaginationQuery } from "../../validator/generalValidator.js";
import permissionCheck from "../../middleware/permissionCheck.js";

TopicRouter.post(
  "/create",
  permissionCheck("AT"),
  validateStoreTopic,
  createTopic
);

TopicRouter.post(
  "/category/create",
  permissionCheck("AC"),
  validateStoreCategory,
  createCategory
);

TopicRouter.get("/get", validatePaginationQuery, paginateData, getTopics);

TopicRouter.put(
  "/update/:project_id",
  permissionCheck("MC"),
  validateUpdateTopic,
  updateTopic
);

TopicRouter.post(
  "/filter",
  validatePaginationQuery,
  paginateData,
  validateFilterTopic,
  filterTopics
);

TopicRouter.get("/category/:topic_id", validateIdTopic, getCategoryInTopic);

export default TopicRouter;
