import { Router } from "express";
import {
  getStudentDetails,
  getPassages,
  submitResults,
  getStudentRecentResults,
} from "../controllers/index.js";
import { validateUser } from "../middlewares/index.js";

const StudentDetailsRouter = Router();

StudentDetailsRouter.post("/details", validateUser(), getStudentDetails);
StudentDetailsRouter.post("/passages", getPassages);
StudentDetailsRouter.post("/submit-result", submitResults);
StudentDetailsRouter.post("/recent-results", getStudentRecentResults);

export default StudentDetailsRouter;
