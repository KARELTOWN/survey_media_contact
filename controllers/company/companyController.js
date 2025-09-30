import { matchedData, validationResult } from "express-validator";
import companyService from "../../services/company/companyService.js";
import SurveyConfig from "../../models/SurveyConfig.js";
import roleService from "../../services/user/roleService.js";
const { createRole } = roleService();
const { companyData } = companyService();
const { getActiveAccountData } = userService();

import Company from "../../models/Company.js";
import UserCompany from "../../models/UserCompany.js";
import userService from "../../services/user/userService.js";

export default function companyController() {
  const createCompany = async (req, res, next) => {
    try {
      const data = matchedData(req);
      let company = new Company({ ...data, created_by: req.user._id });
      await company.save();

      let active_account_data = getActiveAccountData(req);
      let created_by = {created_by: req.user._id}
      let role = await createRole({
        libelle: "Administrateur",
        ...active_account_data,
        created_by,
      });

      if (role) {
        await UserCompany.insertOne({
          user_id: req.user._id,
          company_id: company._id,
          role_id: role._id,
          is_active: true,
          created_by,
        });

        await SurveyConfig.insertOne({
          ...data,
          owner_id: company._id,
          account_type_ref: "Company",
        });

        return res.status(200).json({
          message: "Sociétée créé",
          data: company,
        });
      }
      return res.status(500).json({
        message: "Erreur enregistrement",
      });
    } catch (error) {
      next(error);
    }
  };

  const getCompanies = async (req, res, next) => {
    try {
      let user_companies = await UserCompany.find({
        user_id: req.user._id,
        is_active: true,
      }).populate("company_id");
      let companies = user_companies.map((e) => e.company_id);

      return res.status(200).json({
        message: "Sociétés",
        data: companies,
      });
    } catch (error) {
      next(error);
    }
  };

  const showCompany = async (req, res, next) => {
    try {
      const data = matchedData(req);
      let company = await companyData(data.company_id);
      return res.status(200).json({
        message: "Société récupérée",
        data: company,
      });
    } catch (error) {
      next(error);
    }
  };

  const updateCompany = async (req, res, next) => {
    try {
      const data = matchedData(req);
      let company = await Company.findByIdAndUpdate(
        data.company_id,
        {
          ...data,
        },
        {
          new: true,
        }
      );

      return res.status(200).json({
        message: "Société modifiée",
        data: company,
      });
    } catch (error) {
      next(error);
    }
  };

  return {
    createCompany,
    updateCompany,
    getCompanies,
    showCompany,
  };
}
