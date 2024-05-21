import { Toaster } from "@/components/ui/toaster";
import DashboardLayout from "../components/layout/dashboard-layout";
import Student from "../components/Dashboard/Student/Student";
import Practice from "../components/Dashboard/Practice/Practice";
import MockTestsWrapper from "../components/Dashboard/MockTests/MockTestsWrapper";
import Payment from "../components/Dashboard/Payment/Payment";
import PaymentHistory from "../components/Dashboard/PaymentHistory/PaymentHistory";

type Props = {
  page:
    | "dashboard"
    | "practice"
    | "speedTest"
    | "subscription"
    | "transaction"
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

    case "transaction":
      containerDom = <PaymentHistory />;
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
