import express from "express";
const TopicRouter = express.Router();
import {
  validateStoreTopic,
  validateIdTopic,
  validateIdCategory,
  validateFilterTopic,
  validateFilterCategory,
  validateStoreCategory,
  validateUpdateTopic,
  validateUpdateCategory
} from "../../validator/topic/topicValidator.js";

import topicController from "../../controllers/topic/topicController.js";

const {
  createTopic,
  getTopics,
  filterTopics,
  updateTopic,
  getCategoryInTopic,
  createCategory,
  deleteTopic,
  updateCategory,
  deleteCategory,
  getAllCategory,
  filterCategory
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

TopicRouter.get("/get", validatePaginationQuery, paginateData, getTopics);

TopicRouter.put(
  "/update/:topic_id",
  permissionCheck("MT"),
  validateIdTopic,
  validateUpdateTopic,
  updateTopic
);

TopicRouter.delete(
  "/delete/:topic_id",
  permissionCheck("ST"),
  validateIdTopic,
  deleteTopic
);

TopicRouter.post(
  "/filter",
  validatePaginationQuery,
  paginateData,
  validateFilterTopic,
  filterTopics
);

TopicRouter.get("/category/:topic_id", validateIdTopic, getCategoryInTopic);

TopicRouter.get("/category-get", validatePaginationQuery, paginateData, getAllCategory);


TopicRouter.post(
  "/category/create",
  permissionCheck("AC"),
  validateStoreCategory,
  createCategory
);

TopicRouter.post(
  "/category/filter",
  validatePaginationQuery,
  paginateData,
  validateFilterCategory,
  filterCategory
);

TopicRouter.put(
  "/category/:category_id/update",
  permissionCheck("MC"),
  validateIdCategory,
  validateUpdateCategory,
  updateCategory
);

TopicRouter.delete(
  "/category/:category_id/delete",
  permissionCheck("SC"),
  validateIdCategory,
  deleteCategory
);

export default TopicRouter;
