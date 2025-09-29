import express from "express";
const CompanyRouter = express.Router();
import {
  validateStoreCompany,
  validateIdCompany,
  validateUpdateCompany,
} from "../../validator/company/companyValidator.js";

import companyController from "../../controllers/company/companyController.js";
const { createCompany, showCompany, getCompanies, updateCompany } = companyController();

CompanyRouter.post("/create", validateStoreCompany, createCompany);
CompanyRouter.get("/get", getCompanies);
CompanyRouter.get("/show/:company_id", validateIdCompany, showCompany);
CompanyRouter.put("/update/:company_id", validateUpdateCompany, validateIdCompany, updateCompany);
export default CompanyRouter;
