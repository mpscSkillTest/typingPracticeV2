import { Navigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getHashParams } from "../utils/utils";
import Registration from "../components/Authentication/Register/Registration";
import Login from "../components/Authentication/Login/Login";
import ResetPassword from "../components/Authentication/ResetPassword/ResetPassword";

type Props = {
  type: "signin" | "signup" | "confirm-signup" | "reset-password";
};

function Authentication({ type = "signin" }: Props) {
  const hasParams = getHashParams();

  const confirmationUrl = hasParams["confirmation_url"] || "";
  const accessTokenFromUrl = hasParams["accessToken"] || "";

  const redirectToDashboard = () => {
    if (confirmationUrl) {
      window.location.href = confirmationUrl;
      return;
    }
  };

  if (!accessTokenFromUrl && type === "reset-password") {
    return <Navigate to="/signin" replace />;
  }

  const getUserDetailsComponent = () => {
    if (type === "signin" || type === "signup") {
      return (
        <Tabs
          defaultValue={type}
          className="self-center min-w-[300px] min-h-[300px]"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent className="h-[400px]" value="signin">
            <Login />
          </TabsContent>
          <TabsContent className="h-[400px]" value="signup">
            <Registration />
          </TabsContent>
        </Tabs>
      );
    }
    if (type === "reset-password") {
      return (
        <div className="h-full flex flex-col gap-5 justify-center items-center">
          <Label>Reset Password</Label>
          <ResetPassword accessToken={accessTokenFromUrl} />
        </div>
      );
    }
    return null;
  };

  if (type === "confirm-signup") {
    return (
      <Button
        className="relative m-5 top-[50%] left-[50%]"
        onClick={redirectToDashboard}
      >
        Confirm Your Email
      </Button>
    );
  }

  return (
    <div className="flex h-dvh w-dvw overflow-hidden">
      <div className="h-[inherit] bg-primary w-0 md:w-[50%]"></div>
      <div className="flex align-middle justify-center w-[100%] md:w-[50%] h-[inherit]">
        {getUserDetailsComponent()}
      </div>
      <Toaster />
    </div>
  );
}

export default Authentication;
