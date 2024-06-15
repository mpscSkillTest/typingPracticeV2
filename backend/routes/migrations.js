import { Router } from "express";
import {
  updateResultDate,
  addUserWithMonthlySubscriptions,
} from "../controllers/index.js";

const MigrationRouter = Router();

MigrationRouter.post("/update-result-date", updateResultDate);
MigrationRouter.post("/create-new-user", addUserWithMonthlySubscriptions);

export default MigrationRouter;
