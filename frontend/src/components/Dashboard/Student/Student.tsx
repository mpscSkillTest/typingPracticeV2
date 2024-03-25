import type { BaseSyntheticEvent } from "react";
import { Button } from "@/components/ui/button";
import { AUTH_TOKEN_KEY } from "../../../utils/constant";
import { getCookieHandlers } from "../../../utils/utils";
import axios from "../../../config/customAxios";
import PageHead from "../../shared/page-head";

const StudentDashboard = () => {
  const { removeCookie: removeAccessToken } =
    getCookieHandlers(AUTH_TOKEN_KEY)();

  const handleSignOutUSer = async (event: BaseSyntheticEvent) => {
    event.preventDefault();
    if (typeof removeAccessToken === "function") {
      await axios.post("/authorize/logout/");
      removeAccessToken();
      window.history.replaceState("", document.title, window.location.pathname);
      window.location.reload();
    }
  };

  return (
    <>
      <PageHead title="Dashboard" />
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Hi, Welcome back 👋
          </h2>
        </div>
        <Button onClick={handleSignOutUSer} className="ml-[10px]">
          Sign Me Out
        </Button>
      </div>
    </>
  );
};

export default StudentDashboard;
