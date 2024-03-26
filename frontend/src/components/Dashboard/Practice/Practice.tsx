import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Icons } from "@/components/ui/icons";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Subject, UserDetails } from "../../../types";
import axios from "../../../config/customAxios";
import PageHead from "../../shared/page-head";

const Practice = () => {
  const [showLoader, setShowLoader] = useState<boolean>(true);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  const { toast } = useToast();

  const getStudentDetails = async () => {
    setShowLoader(true);
    try {
      const response = await axios.post("/student/details/");
      if (!response?.data?.user?.userId) {
        throw new Error("Invalid User");
      }
      setUserDetails(response.data.user);
    } catch (error: unknown) {
      const errorMessage = error?.response?.data?.error || "Something wrong";
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: errorMessage,
        className: "my-[10px]",
      });
    } finally {
      setShowLoader(false);
    }
  };

  useEffect(() => {
    getStudentDetails();
  }, []);

  if (showLoader) {
    return (
      <div className="h-full flex items-center justify-center">
        <Icons.spinner height={48} width={48} className="animate-spin" />
      </div>
    );
  }

  if (!userDetails) {
    return <Navigate to="/signin" replace />;
  }

  const getTabContentDom = (subject: Subject) => {
    return (
      <TabsContent value={subject} className="h-full space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-8">
          <div>Passage {subject}</div>
          <div>User Input {subject}</div>
        </div>
      </TabsContent>
    );
  };

  return (
    <>
      <PageHead title="Practice" />
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Tabs defaultValue="ENGLISH" className=" flex-1 space-y-4">
          <TabsList>
            <TabsTrigger value="ENGLISH">English</TabsTrigger>
            <TabsTrigger value="MARATHI">Marathi</TabsTrigger>
          </TabsList>
          {getTabContentDom("ENGLISH")}
          {getTabContentDom("MARATHI")}
        </Tabs>
      </div>
    </>
  );
};

export default Practice;
