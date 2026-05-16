import express from "express";
import analyticsDimensionController from "../../controllers/analyticsDimension/analyticsDimensionController.js";
import {
  validateChapter,
  validateFormation,
  validateId,
  validateModule,
  validateSession,
  validateTrainer,
} from "../../validator/analyticsDimension/analyticsDimensionValidator.js";

const router = express.Router();
const controller = analyticsDimensionController();

router.get("/", controller.list);

router.post("/formations", validateFormation, controller.createFormation);
router.put("/formations/:id", validateId, validateFormation, controller.updateFormation);
router.delete("/formations/:id", validateId, controller.deleteFormation);

router.post("/modules", validateModule, controller.createModule);
router.put("/modules/:id", validateId, validateModule, controller.updateModule);
router.delete("/modules/:id", validateId, controller.deleteModule);

router.post("/chapters", validateChapter, controller.createChapter);
router.put("/chapters/:id", validateId, validateChapter, controller.updateChapter);
router.delete("/chapters/:id", validateId, controller.deleteChapter);

router.post("/trainers", validateTrainer, controller.createTrainer);
router.put("/trainers/:id", validateId, validateTrainer, controller.updateTrainer);
router.delete("/trainers/:id", validateId, controller.deleteTrainer);

router.post("/sessions", validateSession, controller.createSession);
router.put("/sessions/:id", validateId, validateSession, controller.updateSession);
router.delete("/sessions/:id", validateId, controller.deleteSession);

export default router;
