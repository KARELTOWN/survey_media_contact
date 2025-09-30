import { matchedData } from "express-validator";
import SurveyConfig from "../../models/SurveyConfig.js";
import SurveyTemplate from "../../models/SurveyTemplate.js";

export default function configController() {
  const updateConfig = async (req, res, next) => {
    try {
      const data = matchedData(req);
      let config = await SurveyConfig.findOne({ owner_id: req.ownerId });
      if (config) {
        await config.updateOne({ ...data });
      } else {
        data.owner_id = req.ownerId;
        data.account_type_ref = req.account_type_ref;
        await SurveyConfig.create({ ...data });
      }
      return res.status(200).json({ message: "Configuration modifiée" });
    } catch (err) {
      next(err);
    }
  };

  const getConfig = async (req, res, next) => {
    try {
      const config = await SurveyConfig.findOne({ owner_id: req.ownerId });
      return res
        .status(200)
        .json({ data: config, message: "Configuration récupérée" });
    } catch (err) {
      next(err);
    }
  }

  const getConfigFromSurveyId = async (req, res, next) => {
    try {
      const data = matchedData(req);
      let survey_template = await SurveyTemplate.findById(data.survey_id);
      const config = await SurveyConfig.findOne({
        owner_id: survey_template.owner_id,
      });
      return res
        .status(200)
        .json({ data: config, message: "Configuration récupérée" });
    } catch (err) {
      next(err);
    }
  };
  return {
    getConfig,
    updateConfig,
    getConfigFromSurveyId,
  };
}
