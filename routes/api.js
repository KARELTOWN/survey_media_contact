import express from "express";
const router = express.Router();
import AuthRouter from "./auth/AuthRouter.js";
import isauthentificate from "../middleware/isAuthentificate.js";
import { blacklist } from "../middleware/blacklist.js";
// import statRouter from "./stat/statRouter.js";
import DirectionRouter from "./direction/directionRouter.js";
import TopicRouter from "./topic/topicRouter.js";
import UserRouter from "./user/userRouter.js";
import SurveyRouter from "./survey/surveyRouter.js";

router.use("/auth/", AuthRouter);
// router.use("/stat/", isauthentificate, blacklist, statRouter);
router.use("/direction/", isauthentificate, blacklist, DirectionRouter);
router.use("/topic/", isauthentificate, blacklist, TopicRouter);
router.use("/user/", isauthentificate, blacklist, UserRouter);
router.use("/survey/", SurveyRouter);

export default router;
