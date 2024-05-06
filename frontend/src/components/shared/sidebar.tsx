import { Link } from "react-router-dom";
import { navItems } from "../../utils/constant";
import DashboardNav from "./dashboard-nav";
import Logout from "./logout";
import logo from "../../assets/Typing.png";

export default function Sidebar() {
  return (
    <aside className="hidden h-screen w-64 flex-col overflow-y-auto overflow-x-hidden rounded-tr-[90px] border-r bg-primary py-8 pl-5 dark:bg-background lg:flex">
      <Link to="/" className="text-3xl font-bold text-white">
        <img src={logo} alt="Logo" className="border-red-500 w-40 h-40 text-white " />
      </Link>
      <div className=" mx-[20px] flex flex-1 flex-col justify-between">
        <DashboardNav items={navItems} />
        <Logout />
      </div>
    </aside>
  );
}
