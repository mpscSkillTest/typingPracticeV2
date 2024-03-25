import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { getHashParams } from "../utils/utils";
import Registration from "../components/Authentication/Register/Registration";
import Login from "../components/Authentication/Login/Login";

type Props = {
  type: "signin" | "signup" | "confirm-signup";
};

function Authentication({ type = "signin" }: Props) {
  const hasParams = getHashParams();

  const confirmationUrl = hasParams["confirmation_url"] || "";

  const redirectToDashboard = () => {
    if (confirmationUrl) {
      window.location.href = confirmationUrl;
      return;
    }
  };

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
    return null;
  };

  if (type === "confirm-signup") {
    return (
      <Button
        className="relative top-[50%] left-[50%]"
        onClick={redirectToDashboard}
      >
        Confirm Your Email
      </Button>
    );
  }

  return (
    <div className="flex align-middle w-[inherit] h-[inherit] justify-center">
      <div className="bg-indigo-400  h-[inherit] w-0 md:w-[50%]"></div>
      <div className="flex bg-indigo-100 align-middle justify-center h-[inherit] w-100% md:w-[50%]">
        {getUserDetailsComponent()}
      </div>
      <Toaster />
    </div>
  );
}

export default Authentication;
