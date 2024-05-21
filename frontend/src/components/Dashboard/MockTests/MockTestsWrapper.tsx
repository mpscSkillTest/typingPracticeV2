import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Icons } from "@/components/ui/icons";
import { useToast } from "@/components/ui/use-toast";
import { Instructions } from "./Instructions";
import type { Subject, UserDetails, MockTestDetails } from "../../../types";
import axios from "../../../config/customAxios";
import PageHead from "../../shared/page-head";
import MockTests from "./MockTests";

type Props = {
  title: "Practice" | "Speed Test" | "Mock Test";
};

const Practice = ({ title }: Props) => {
  const [showLoader, setShowLoader] = useState<boolean>(true);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [hasExamStarted, setHasExamStarted] = useState<boolean>(false);

  const [selectedSubject, setSelectedSubject] = useState<Subject | undefined>(
    undefined
  );

  const [mockTestDetails, setMockTestDetails] = useState<
    MockTestDetails | undefined
  >(undefined);

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

  const getMockTestDetails = async (subject: Subject) => {
    setShowLoader(true);
    try {
      const { data } = await axios.post("/student/mock-tests/", {
        subject,
      });
      const { passageDetails, accessLimitReached, error } = data || {};

      if (accessLimitReached) {
        toast({
          variant: "destructive",
          title: "You have exhausted your free trial limit",
          description:
            "To give unlimited mock tests and to use our other exciting features, please consider to subscribe our Premium Package",
          duration: 5000,
          className: "absolute",
        });
        return;
      }

      if (error || !passageDetails) {
        throw new Error("No Mock Tests Available");
      }
      setMockTestDetails(passageDetails);
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

  const toggleMockTestView = async (subject: Subject) => {
    await getMockTestDetails(subject);
    setSelectedSubject(subject);
  };

  useEffect(() => {
    getStudentDetails();
  }, []);

  useEffect(() => {
    if (mockTestDetails) {
      setHasExamStarted((prevExamStarted) => !prevExamStarted);
    }
  }, [mockTestDetails]);

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

  if (!hasExamStarted) {
    return (
      <div className="flex-1 h-full space-y-4 p-4 pt-6 lg:p-8">
        <Instructions onStartTest={toggleMockTestView} />
      </div>
    );
  }

  return (
    <>
      <PageHead title={title} />
      <div className="flex-1 h-full space-y-4 p-4 pt-6 lg:p-8">
        <MockTests
          userDetails={userDetails}
          subject={selectedSubject}
          mockTestDetails={mockTestDetails}
        />
      </div>
    </>
  );
};

export default Practice;
