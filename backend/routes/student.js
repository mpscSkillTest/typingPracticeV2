import { Router } from "express";
import { getStudentDetails } from "../controllers/index.js";
import { validateUser } from "../middlewares/index.js";

const StudentDetailsRouter = Router();

StudentDetailsRouter.post("/details", validateUser(), getStudentDetails);

export default StudentDetailsRouter;
