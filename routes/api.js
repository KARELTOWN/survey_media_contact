import express from "express";
const router = express.Router();
import AuthRouter from "./auth/AuthRouter.js";
import isauthentificate from "../middleware/isAuthentificate.js";
import { blacklist } from "../middleware/blacklist.js";
// import statRouter from "./stat/statRouter.js";
import CompanyRouter from "./company/companyRouter.js";
import TopicRouter from "./topic/topicRouter.js";
import UserRouter from "./user/userRouter.js";
import ConfigRouter from "./config/ConfigRouter.js";
import SurveyRouter from "./survey/surveyRouter.js";
import checkAccountHeaders from "../middleware/checkAccountHeaders.js";
import RoleRouter from "./user/roleRouter.js";
import fileRouter from './file/fileRouter.js'
import AnalyticsDimensionRouter from "./analyticsDimension/analyticsDimensionRouter.js";

router.use("/auth/", AuthRouter);
router.use("/file/", fileRouter);

router.use(
  "/company/",
  isauthentificate,
  checkAccountHeaders,
  blacklist,
  CompanyRouter
);
router.use(
  "/topic/",
  isauthentificate,
  checkAccountHeaders,
  blacklist,
  TopicRouter
);
router.use(
  "/users/",
  isauthentificate,
  checkAccountHeaders,
  blacklist,
  UserRouter
);

router.use(
  "/roles/",
  isauthentificate,
  checkAccountHeaders,
  blacklist,
  RoleRouter
);

router.use(
  "/analytics-dimensions/",
  isauthentificate,
  checkAccountHeaders,
  blacklist,
  AnalyticsDimensionRouter
);

router.use("/survey/", SurveyRouter);

router.use("/config/", ConfigRouter);
router.get('/welcome', (req, res, next)=> {
  return res.status(200).json({message: 'GOOD'})
})
export default router;
