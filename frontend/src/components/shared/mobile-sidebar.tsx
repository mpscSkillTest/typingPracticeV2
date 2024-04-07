import { Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { navItems } from "../../utils/constant";
import DashboardNav from "./dashboard-nav";
import Logout from "./logout";

type TMobileSidebarProps = {
  className?: string;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  sidebarOpen: boolean;
};
export default function MobileSidebar({
  setSidebarOpen,
  sidebarOpen,
}: TMobileSidebarProps) {
  return (
    <>
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="left"
          className="bg-primary"
          closeIconProps={{
            className: "w-7 h-7 stroke-secondary",
          }}
        >
          <div className="space-y-4 py-4 h-full">
            <div className="flex flex-col space-y-4 px-3 py-2 h-full">
              <Link to="/" className="py-2 text-2xl font-bold text-white ">
                Logo
              </Link>
              <div className="flex flex-1 flex-col justify-between space-y-8 px-2">
                <DashboardNav items={navItems} setOpen={setSidebarOpen} />
                <Logout />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
