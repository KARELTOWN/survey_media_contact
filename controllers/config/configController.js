import { matchedData } from "express-validator";
import Config from "../../models/Config.js";

export default function configController() {
  const updateConfig = async (req, res, next) => {
    try {
      const data = matchedData(req);
      const count = await Config.countDocuments();
      if (count > 0) {
        let config = await Config.findOne({});
        await config.updateOne({ survey_header: data });
      } else {
        await Config.create({ survey_header: data });
      }
      return res.status(200).json({ message: "Configuration modifiée" });
    } catch (err) {
      next(err);
    }
  };

  const getConfig = async (req, res, next) => {
    try {
      const config = await Config.findOne({});
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
  };
}
