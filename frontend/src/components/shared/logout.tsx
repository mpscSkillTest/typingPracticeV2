import type { BaseSyntheticEvent } from "react";
import { Button } from "@/components/ui/button";
import { AUTH_TOKEN_KEY } from "../../utils/constant";
import { getCookieHandlers } from "../../utils/utils";
import axios from "../../config/customAxios";

export default function Logout() {
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
    <Button
      className="w-[100%]"
      onClick={handleSignOutUSer}
      variant="secondary"
    >
      Sign Out
    </Button>
  );
}
