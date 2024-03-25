import type { BaseSyntheticEvent } from "react";
import { Button } from "@/components/ui/button";
import { AUTH_TOKEN_KEY } from "../../../utils/constant";
import { getCookieHandlers } from "../../../utils/utils";
import axios from "../../../config/customAxios";

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
    <div>
      Hello User
      <Button onClick={handleSignOutUSer} className="ml-[10px]">
        Sign Me Out
      </Button>
    </div>
  );
};

export default StudentDashboard;
