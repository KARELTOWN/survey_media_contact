import express from "express";
const DirectionRouter = express.Router();
import {
  validateStoreDirection,
  validateIdDirection,
  validateUpdateDirection,
  validateFilterDirection,
} from "../../validator/direction/directionValidator.js";

import directionController from "../../controllers/direction/directionController.js";
const {
  createDirection,
  getDirections,
  getFonctionsInDirection,
  filterDirections,
  updateDirection,
} = directionController();
import paginateData from "../../helpers/pagination.js";
import { validatePaginationQuery } from "../../validator/generalValidator.js";

DirectionRouter.post(
  "/create",
  validateStoreDirection,
  createDirection
);
DirectionRouter.get(
  "/get",
  validatePaginationQuery,
  paginateData,
  getDirections
);

DirectionRouter.put(
  "/update/:project_id",
  validateUpdateDirection,
  updateDirection
);

DirectionRouter.post(
  "/filter",
  validatePaginationQuery,
  paginateData,
  validateFilterDirection,
  filterDirections
);

DirectionRouter.get(
  "/fonctions/:direction_id",
  validateIdDirection,
  getFonctionsInDirection
);

export default DirectionRouter;
