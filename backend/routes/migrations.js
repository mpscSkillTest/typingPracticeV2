import { Router } from "express";
import { updateResultDate } from "../controllers/index.js";

const MigrationRouter = Router();

MigrationRouter.post("/update-result-date", updateResultDate);

export default MigrationRouter;
