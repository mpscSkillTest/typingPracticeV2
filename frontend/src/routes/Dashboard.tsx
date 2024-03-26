import { Toaster } from "@/components/ui/toaster";
import DashboardLayout from "../components/layout/dashboard-layout";
import Student from "../components/Dashboard/Student/Student";
import Practice from "../components/Dashboard/Practice/Practice";

type Props = {
  page: "dashboard" | "practice";
};

function Dashboard({ page = "dashboard" }: Props) {
  return (
    <DashboardLayout>
      {page === "dashboard" ? <Student /> : null}
      {page === "practice" ? <Practice /> : null}
      <Toaster />
    </DashboardLayout>
  );
}

export default Dashboard;
