import { Toaster } from "@/components/ui/toaster";
import DashboardLayout from "../components/layout/dashboard-layout";
import Student from "../components/Dashboard/Student/Student";
import Practice from "../components/Dashboard/Practice/Practice";
import Payment from "../components/Dashboard/Payment/Payment";
import Payment_history from "../components/PaymentHistory/paymentHistory";

type Props = {
  page: "dashboard" | "practice" | "speedTest" | "payment" | "payment_history";
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
    case "payment":
      containerDom = <Payment />;
      break;

    case "payment_history":
      containerDom = <Payment_history />;
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
