import express from "express";
const CompanyRouter = express.Router();
import {
  validateStoreCompany,
  validateIdCompany,
  validateUpdateCompany,
} from "../../validator/company/companyValidator.js";

import companyController from "../../controllers/company/companyController.js";
import permissionCheck from "../../middleware/permissionCheck.js";
const { createCompany, showCompany, getCompanies, updateCompany } =
  companyController();

CompanyRouter.post(
  "/create",
  permissionCheck("AS"),
  validateStoreCompany,
  createCompany
)

CompanyRouter.get("/get", getCompanies);
CompanyRouter.get("/show/:company_id", permissionCheck('DS'), validateIdCompany, showCompany);
CompanyRouter.put(
  "/update/:company_id",
  permissionCheck("MS"),
  validateUpdateCompany,
  validateIdCompany,
  updateCompany
);
export default CompanyRouter;
