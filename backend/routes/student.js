import { Router } from "express";
import {
	getStudentDetails,
	getPassages,
	submitResults,
	getStudentRecentResults,
	getStudentResultReport,
	getPaymentHistory,
	getMockTestDetails,
	submitUserFeedback,
	getAllLessons,
	getStudentProgress,
	getLessonDetails,
	updateLessonProgress,
} from "../controllers/index.js";
import { validateUser } from "../middlewares/index.js";

const StudentDetailsRouter = Router();

StudentDetailsRouter.post("/details", validateUser(), getStudentDetails);
StudentDetailsRouter.post("/passages", validateUser(), getPassages);
StudentDetailsRouter.post("/submit-result", submitResults);
StudentDetailsRouter.post("/recent-results", getStudentRecentResults);
StudentDetailsRouter.get("/payment-history", validateUser(), getPaymentHistory);
StudentDetailsRouter.post("/reports", getStudentResultReport);
StudentDetailsRouter.post("/mock-tests", getMockTestDetails);
StudentDetailsRouter.post("/submit-feedback", submitUserFeedback);
StudentDetailsRouter.post("/lessons", getAllLessons);
StudentDetailsRouter.post("/lesson-results", getStudentProgress);
StudentDetailsRouter.post("/lesson-details", getLessonDetails);
StudentDetailsRouter.post("/submit-lesson", updateLessonProgress);

export default StudentDetailsRouter;
