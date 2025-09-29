import Company from "../../models/Company.js";
import User from "../../models/User.js";

export default function companyService() {

  const companyData = async (company_id) => {
    try {
      let company = await Company.findById(company_id)
        .populate({
          path: "created_by",
          model: User,
          select: "firstname lastname",
        })
        .exec();
      return company;
    } catch (err) {
      throw new Error(err);
    }
  };

  const checkCompanyExist = async (company) => {
    try {
      let exist = await Company.exists({ _id: company }).exec();
      return exist;
    } catch (err) {
      throw new Error(err);
    }
  };


  return {
    checkCompanyExist,
    companyData,
  };
}
