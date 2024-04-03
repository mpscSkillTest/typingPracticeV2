import { Router } from "express";
import {
  getStudentDetails,
  getPassages,
  submitResults,
} from "../controllers/index.js";
import { validateUser } from "../middlewares/index.js";

const StudentDetailsRouter = Router();

StudentDetailsRouter.post("/details", validateUser(), getStudentDetails);
StudentDetailsRouter.post("/passages", getPassages);
StudentDetailsRouter.post("/submit-result", submitResults);

export default StudentDetailsRouter;
