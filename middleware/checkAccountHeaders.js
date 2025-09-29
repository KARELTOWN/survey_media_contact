import Company from "../models/Company.js";
import User from "../models/User.js";

export default async function checkAccountHeaders(req, res, next) {
  const account_type = req.headers["x-account-type"];
  const account_id = req.headers["x-account-id"];

  if (!["personal", "enterprise"].includes(account_type)) {
    return res.status(500).json({
      message: "Type de compte invalide",
    });
  } else if (account_type == "enterprise") {
    if (!account_id) {
      return res.status(500).json({
        message: "En têtes manquants",
      });
    }
    let company = await Company.exists({ _id: account_id });
    if (!company) {
      return res.status(500).json({
        message: "La société n'existe pas",
      });
    }
  }

  console.log('req.user._id', req.user)

  req.ownerId = account_type === "enterprise" ? account_id : req.user._id;
  if (account_type === "enterprise") {
    account_type === "enterprise"
      ? (req.enterprise_data = await Company.findById(account_id))
      : (req.enterprise_data = null);
  }
  req.account_type_ref = account_type === "enterprise" ? "Company" : "User";
  next();
}
