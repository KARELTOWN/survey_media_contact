import Feature from "../models/Feature.js";
import Module from "../models/Module.js";
import Permission from "../models/Permission.js";
import UserCompany from "../models/UserCompany.js";
export default function permissionCheck(featureCode) {
  return async (req, res, next) => {
    try {
      let account_type = req.account_type_ref;
      let account_id = req.owner_id;
      let feature = await Feature.findOne({ code: featureCode }).select([
        "_id",
        "module_id",
      ]);
      if (!feature) {
        return res.status(403).json({ message: "Permission denied" });
      }

      if (account_type === "Company") {
        let user_id = req.user._id;
        let user_company = await UserCompany.findOne({
          company_id: account_id,
          user_id: user_id,
        }).select("role_id");
        if (!user_company) {
          return res.status(403).json({ message: "Permission denied" });
        }
        if (featureCode === "RRC") {
          if (user_company.user_id === req.user._id) {
            next();
          }
        }
        if (user_company.is_active === false) {
          return res.status(403).json({ message: "Permission denied" });
        }
        let permission = await Permission.findOne({
          feature_id: feature._id,
          role_id: user_company.role_id,
        }).select("is_active");
        if (permission.is_active === false) {
          return res.status(403).json({ message: "Permission denied" });
        }
      } else if (account_type === "User") {
        let module = await Module.findById(feature.module_id).select("libelle");
        if (module && ["Collaborateur", "Role"].includes(module.libelle)) {
          return res.status(403).json({ message: "Permission denied" });
        }
      }
      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };
}
