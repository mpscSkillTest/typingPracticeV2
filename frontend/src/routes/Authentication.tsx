import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Registration from "../components/Authentication/Register/Registration";
import Login from "../components/Authentication/Login/Login";

type Props = {
  type: "signin" | "signup";
};

function Authentication({ type = "signin" }: Props) {
  return (
    <div className="flex bg-indigo-300 align-middle justify-center h-[inherit] w-[inherit]">
      <Tabs defaultValue={type} className="self-center w-[400px] h[500px]">
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
    </div>
  );
}

export default Authentication;
