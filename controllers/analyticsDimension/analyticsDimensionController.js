import { matchedData } from "express-validator";
import Formation from "../../models/Formation.js";
import TrainingModule from "../../models/TrainingModule.js";
import Chapter from "../../models/Chapter.js";
import Trainer from "../../models/Trainer.js";
import TrainingSession from "../../models/TrainingSession.js";
import SurveyTemplate from "../../models/SurveyTemplate.js";
import SurveyModel from "../../models/SurveyModel.js";

const tenantQuery = (req) => ({
  owner_id: req.owner_id,
  account_type_ref: req.account_type_ref,
});

const tenantFields = (req) => ({
  owner_id: req.owner_id,
  account_type_ref: req.account_type_ref,
  created_by: req.user._id,
});

const dimensionInUse = async (field, id, req) =>
  Boolean(
    (await SurveyTemplate.exists({ [field]: id, ...tenantQuery(req) })) ||
      (await SurveyModel.exists({ [field]: id, ...tenantQuery(req) }))
  );

export default function analyticsDimensionController() {
  const list = async (req, res, next) => {
    try {
      const query = tenantQuery(req);
      const [formations, modules, chapters, trainers, sessions] =
        await Promise.all([
          Formation.find(query).sort({ createdAt: -1 }).lean(),
          TrainingModule.find(query)
            .populate({ path: "formation_id", select: "nom" })
            .sort({ createdAt: -1 })
            .lean(),
          Chapter.find(query)
            .populate({
              path: "module_id",
              select: "nom formation_id",
              populate: { path: "formation_id", select: "nom" },
            })
            .sort({ createdAt: -1 })
            .lean(),
          Trainer.find(query).sort({ createdAt: -1 }).lean(),
          TrainingSession.find(query)
            .populate({ path: "formation_id", select: "nom" })
            .sort({ date_debut: -1 })
            .lean(),
        ]);

      return res.status(200).json({
        message: "Dimensions analytiques recuperees",
        data: { formations, modules, chapters, trainers, sessions },
      });
    } catch (error) {
      next(error);
    }
  };

  const createFormation = async (req, res, next) => {
    try {
      const data = matchedData(req);
      const formation = await Formation.create({ ...data, ...tenantFields(req) });
      return res.status(200).json({ message: "Formation creee", data: formation });
    } catch (error) {
      next(error);
    }
  };

  const updateFormation = async (req, res, next) => {
    try {
      const data = matchedData(req);
      const formation = await Formation.findOneAndUpdate(
        { _id: data.id, ...tenantQuery(req) },
        { nom: data.nom, description: data.description || "" },
        { new: true }
      );
      return res.status(200).json({ message: "Formation modifiee", data: formation });
    } catch (error) {
      next(error);
    }
  };

  const deleteFormation = async (req, res, next) => {
    try {
      const data = matchedData(req);
      const isUsed =
        (await TrainingModule.exists({ formation_id: data.id, ...tenantQuery(req) })) ||
        (await TrainingSession.exists({ formation_id: data.id, ...tenantQuery(req) })) ||
        (await dimensionInUse("formation_id", data.id, req));
      if (isUsed) {
        return res.status(500).json({
          message: "Formation utilisee par un module ou une session",
        });
      }
      await Formation.deleteOne({ _id: data.id, ...tenantQuery(req) });
      return res.status(200).json({ message: "Formation supprimee" });
    } catch (error) {
      next(error);
    }
  };

  const createModule = async (req, res, next) => {
    try {
      const data = matchedData(req);
      const module = await TrainingModule.create({ ...data, ...tenantFields(req) });
      return res.status(200).json({ message: "Module cree", data: module });
    } catch (error) {
      next(error);
    }
  };

  const updateModule = async (req, res, next) => {
    try {
      const data = matchedData(req);
      const module = await TrainingModule.findOneAndUpdate(
        { _id: data.id, ...tenantQuery(req) },
        { nom: data.nom, formation_id: data.formation_id },
        { new: true }
      );
      return res.status(200).json({ message: "Module modifie", data: module });
    } catch (error) {
      next(error);
    }
  };

  const deleteModule = async (req, res, next) => {
    try {
      const data = matchedData(req);
      const isUsed =
        (await Chapter.exists({ module_id: data.id, ...tenantQuery(req) })) ||
        (await dimensionInUse("module_id", data.id, req));
      if (isUsed) {
        return res.status(500).json({ message: "Module utilise par un chapitre" });
      }
      await TrainingModule.deleteOne({ _id: data.id, ...tenantQuery(req) });
      return res.status(200).json({ message: "Module supprime" });
    } catch (error) {
      next(error);
    }
  };

  const createChapter = async (req, res, next) => {
    try {
      const data = matchedData(req);
      const chapter = await Chapter.create({ ...data, ...tenantFields(req) });
      return res.status(200).json({ message: "Chapitre cree", data: chapter });
    } catch (error) {
      next(error);
    }
  };

  const updateChapter = async (req, res, next) => {
    try {
      const data = matchedData(req);
      const chapter = await Chapter.findOneAndUpdate(
        { _id: data.id, ...tenantQuery(req) },
        { nom: data.nom, module_id: data.module_id },
        { new: true }
      );
      return res.status(200).json({ message: "Chapitre modifie", data: chapter });
    } catch (error) {
      next(error);
    }
  };

  const deleteChapter = async (req, res, next) => {
    try {
      const data = matchedData(req);
      if (await dimensionInUse("chapter_id", data.id, req)) {
        return res.status(500).json({ message: "Chapitre utilise par une enquete" });
      }
      await Chapter.deleteOne({ _id: data.id, ...tenantQuery(req) });
      return res.status(200).json({ message: "Chapitre supprime" });
    } catch (error) {
      next(error);
    }
  };

  const createTrainer = async (req, res, next) => {
    try {
      const data = matchedData(req);
      const trainer = await Trainer.create({ ...data, ...tenantFields(req) });
      return res.status(200).json({ message: "Formateur cree", data: trainer });
    } catch (error) {
      next(error);
    }
  };

  const updateTrainer = async (req, res, next) => {
    try {
      const data = matchedData(req);
      const trainer = await Trainer.findOneAndUpdate(
        { _id: data.id, ...tenantQuery(req) },
        { nom: data.nom, email: data.email || "" },
        { new: true }
      );
      return res.status(200).json({ message: "Formateur modifie", data: trainer });
    } catch (error) {
      next(error);
    }
  };

  const deleteTrainer = async (req, res, next) => {
    try {
      const data = matchedData(req);
      if (await dimensionInUse("trainer_id", data.id, req)) {
        return res.status(500).json({ message: "Formateur utilise par une enquete" });
      }
      await Trainer.deleteOne({ _id: data.id, ...tenantQuery(req) });
      return res.status(200).json({ message: "Formateur supprime" });
    } catch (error) {
      next(error);
    }
  };

  const createSession = async (req, res, next) => {
    try {
      const data = matchedData(req);
      const session = await TrainingSession.create({ ...data, ...tenantFields(req) });
      return res.status(200).json({ message: "Session creee", data: session });
    } catch (error) {
      next(error);
    }
  };

  const updateSession = async (req, res, next) => {
    try {
      const data = matchedData(req);
      const session = await TrainingSession.findOneAndUpdate(
        { _id: data.id, ...tenantQuery(req) },
        {
          formation_id: data.formation_id,
          libelle: data.libelle,
          date_debut: data.date_debut,
          date_fin: data.date_fin,
        },
        { new: true }
      );
      return res.status(200).json({ message: "Session modifiee", data: session });
    } catch (error) {
      next(error);
    }
  };

  const deleteSession = async (req, res, next) => {
    try {
      const data = matchedData(req);
      if (await dimensionInUse("session_id", data.id, req)) {
        return res.status(500).json({ message: "Session utilisee par une enquete" });
      }
      await TrainingSession.deleteOne({ _id: data.id, ...tenantQuery(req) });
      return res.status(200).json({ message: "Session supprimee" });
    } catch (error) {
      next(error);
    }
  };

  return {
    list,
    createFormation,
    updateFormation,
    deleteFormation,
    createModule,
    updateModule,
    deleteModule,
    createChapter,
    updateChapter,
    deleteChapter,
    createTrainer,
    updateTrainer,
    deleteTrainer,
    createSession,
    updateSession,
    deleteSession,
  };
}
