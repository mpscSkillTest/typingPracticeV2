import { Navigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getHashParams } from "../utils/utils";
import Registration from "../components/Authentication/Register/Registration";
import Login from "../components/Authentication/Login/Login";
import ResetPassword from "../components/Authentication/ResetPassword/ResetPassword";
import logo from "../assets/mpsc.in_logo.png";
import { Link } from "react-router-dom";

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
    <div className="relative min-h-screen w-full overflow-auto">
      <Link to="/"
        className="absolute top-5 left-5 md:top-10 md:left-10 text-2xl font-bold text-white">
        <img src={logo} alt="Logo" className="w-20 md:w-32" />
      </Link>
      <div className="flex h-full">
        <div className="h-full bg-primary w-0 md:w-[50%] text-white">
          <div className="flex items-center justify-center h-screen">
            <div className="left_content px-5 text-xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="container col-span-9 col-span-12 md:col-span-9 w-full md:w-[75%] mt-10">
                <h5 className="text-center text-orange-500">
                  Essential Guidelines for Efficient and Accurate Practice
                </h5>
                <ol className="mt-5 text-sm list-decimal">
                  <li className="mb-5">
                    Start with proper hand placement on the keyboard, using the
                    home row keys as a reference.
                  </li>
                  <li className="mb-5">
                    Begin with basic typing exercises to build muscle memory and
                    improve finger coordination.
                  </li>
                  <li className="mb-5">
                    Focus on accuracy over speed initially, gradually increasing
                    your typing speed as you become more comfortable.
                  </li>
                  <li className="mb-5">
                    Practice regularly, incorporating varied texts and typing
                    challenges to enhance your proficiency.
                  </li>
                  <li>
                    Take short breaks to prevent fatigue and maintain
                    concentration during typing sessions.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="flex align-middle justify-center w-full md:w-[50%] h-full mt-10">
          {getUserDetailsComponent()}
        </div>
        <Toaster />
      </div>
    </div>
  );
}

export default Authentication;
