import Company from "../models/Company.js";

export default async function checkAccountHeaders(req, res, next) {
  try {
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
      let company = await Company.findById(account_id);
      if (!company) {
        return res.status(500).json({
          message: "La société n'existe pas",
        });
      }
      req.company_data = company;
    }

    req.owner_id = account_type === "enterprise" ? account_id : req.user._id;
    req.account_type_ref = account_type === "enterprise" ? "Company" : "User";
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
