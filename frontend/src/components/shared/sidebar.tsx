import { Link } from "react-router-dom";
import { navItems } from "../../utils/constant";
import DashboardNav from "./dashboard-nav";
import Logout from "./logout";
import logo from "../../assets/mpsc.in_logo.png";

export default function Sidebar() {
  return (
    <aside className="hidden h-screen w-64 flex-col overflow-y-auto overflow-x-hidden rounded-tr-[90px] border-r bg-primary py-8 pl-5 dark:bg-background lg:flex">
      <Link to="/" className="text-2xl font-bold text-white">
        <img src={logo}  alt="Logo" className =" w-32  mx-5" />
      </Link>
      <div className=" mx-[20px] flex flex-1 flex-col justify-between mt-7">
        <DashboardNav items={navItems} />
        <Logout />
      </div>
    </aside>
  );
}
