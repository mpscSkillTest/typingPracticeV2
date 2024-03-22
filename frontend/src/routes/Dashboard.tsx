import Student from "../components/Dashboard/Student/Student";
import Institute from "../components/Dashboard/Institute/Institute";

type Props = {
  type: "student" | "institute";
};

function Dashboard({ type }: Props) {
  let componentToRender = <Student />;

  if (type === "institute") {
    componentToRender = <Institute />;
  }

  return (
    <div className="flex h-[inherit] w-[inherit]">{componentToRender}</div>
  );
}

export default Dashboard;
