import { Toaster } from "@/components/ui/toaster";
import DashboardLayout from "../components/layout/dashboard-layout";
import Student from "../components/Dashboard/Student/Student";
import Practice from "../components/Dashboard/Practice/Practice";
import MockTestsWrapper from "../components/Dashboard/MockTests/MockTestsWrapper";
import Payment from "../components/Dashboard/Payment/Payment";
import PaymentHistory from "../components/Dashboard/PaymentHistory/PaymentHistory";
import Lesson from "../components/Dashboard/Lesson/Lesson";
import LessonPage from "@/components/Dashboard/Lesson/LessonPage";

type Props = {
	page:
		| "dashboard"
		| "practice"
		| "speedTest"
		| "subscription"
		| "transaction"
		| "lesson"
		| "lessonDetails"
		| "mockTest";
};

function Dashboard({ page = "dashboard" }: Props) {
	let containerDom = null;

	switch (page) {
		case "dashboard":
			containerDom = <Student />;
			break;
		case "practice":
			containerDom = (
				<Practice key="practice" mode="PRACTICE" title="Practice" />
			);
			break;
		case "speedTest":
			containerDom = <Practice key="test" mode="TEST" title="Speed Test" />;
			break;
		case "mockTest":
			containerDom = <MockTestsWrapper key="mock" title="Mock Test" />;
			break;
		case "subscription":
			containerDom = <Payment />;
			break;
		case "lesson":
			containerDom = <Lesson />;
			break;
		case "transaction":
			containerDom = <PaymentHistory />;
			break;
		case "lessonDetails":
			containerDom = <LessonPage />;
			break;
		default:
			break;
	}

	return (
		<DashboardLayout>
			{containerDom}
			<Toaster />
		</DashboardLayout>
	);
}

export default Dashboard;
