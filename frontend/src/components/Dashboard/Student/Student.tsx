import { ReactElement, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Icons } from "@/components/ui/icons";
import { useToast } from "@/components/ui/use-toast";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  Subject,
  TypingMode,
  UserDetails,
  DurationOption,
} from "../../../types";
import { Duration } from "../../../enums/Duration";
import axios from "../../../config/customAxios";
import PageHead from "../../shared/page-head";
import OverviewWrapper from "./Overview/OverviewWrapper";
import RecentResults from "./RecentResults/RecentResults";

const StudentDashboard = () => {
  const [showLoader, setShowLoader] = useState<boolean>(true);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [selectedMode, setSelectedMode] = useState<TypingMode>("TEST");
  const [selectedSubject, setSelectedSubject] = useState<Subject>("MARATHI");
  const [selectedDuration, setSelectedDuration] =
    useState<DurationOption>("TODAY");

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

  const updateSelectedMode = (updatedMode: TypingMode) => {
    if (updatedMode && updatedMode !== selectedMode) {
      setSelectedMode(updatedMode);
    }
  };

  const updateSelectedSubject = (updatedSubject: Subject) => {
    if (updatedSubject && updatedSubject !== selectedSubject) {
      setSelectedSubject(updatedSubject);
    }
  };

  const onDurationSelectionChange = (updatedDuration: DurationOption) => {
    setSelectedDuration(updatedDuration);
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

  const getSubjectSelection = () => {
    return (
      <div className="flex flex-col gap-[10px]">
        <Label>Subject</Label>
        <ToggleGroup
          value={selectedSubject}
          onValueChange={updateSelectedSubject}
          type="single"
          className="border-2 rounded-sm gap-0"
        >
          <ToggleGroupItem
            className="rounded-none data-[state=on]:bg-primary data-[state=on]:text-white data-[state=on]:rounded-md"
            value="MARATHI"
          >
            Marathi
          </ToggleGroupItem>
          <ToggleGroupItem
            className="rounded-none data-[state=on]:bg-primary data-[state=on]:text-white data-[state=on]:rounded-md"
            value="ENGLISH"
          >
            English
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    );
  };

  const getTypingModeSelection = () => {
    return (
      <div className="flex flex-col gap-[10px]">
        <Label>Typing Mode</Label>
        <ToggleGroup
          value={selectedMode}
          onValueChange={updateSelectedMode}
          type="single"
          className="border-2 rounded-sm gap-0"
        >
          <ToggleGroupItem
            className="rounded-none data-[state=on]:bg-primary data-[state=on]:text-white data-[state=on]:rounded-md"
            value="TEST"
          >
            Speed Test
          </ToggleGroupItem>
          <ToggleGroupItem
            className="rounded-none data-[state=on]:bg-primary data-[state=on]:text-white data-[state=on]:rounded-md"
            value="PRACTICE"
          >
            Practice
          </ToggleGroupItem>
          <ToggleGroupItem
            className="rounded-none data-[state=on]:bg-primary data-[state=on]:text-white data-[state=on]:rounded-md"
            value="MOCK"
          >
            Mock Tests
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    );
  };

  const getDurationOptionsDom = () => {
    const optionsDom: ReactElement<typeof Select>[] = [];

    Object.entries(Duration).forEach(
      ([currentDuration, currentDurationEnum]) => {
        optionsDom.push(
          <SelectItem key={currentDuration} value={currentDuration}>
            {currentDurationEnum.name}
          </SelectItem>
        );
      }
    );

    return (
      <Select
        value={selectedDuration}
        onValueChange={onDurationSelectionChange}
      >
        <SelectTrigger className="w-[max-content] gap-3">
          <SelectValue className="p-3" placeholder="Select Question Passage" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>{optionsDom}</SelectGroup>
        </SelectContent>
      </Select>
    );
  };

  const getDurationSelection = () => {
    return (
      <div className="flex flex-col gap-[10px]">
        <Label>Duration</Label>
        {getDurationOptionsDom()}
      </div>
    );
  };

  const getContentDom = () => {
    return (
      <div className="h-full space-y-4">
        <OverviewWrapper
          duration={selectedDuration}
          mode={selectedMode}
          subject={selectedSubject}
        />
        <RecentResults mode={selectedMode} subject={selectedSubject} />
      </div>
    );
  };

  return (
    <>
      <PageHead title="Dashboard" />
      <div className="h-full flex-1 space-y-8 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Hi {userDetails?.name || ""}, Welcome back 👋
          </h2>
        </div>
        <div className="flex flex-col flex-1 space-y-8">
          <div className="flex gap-6 flex-wrap">
            {getSubjectSelection()}
            {getTypingModeSelection()}
            {getDurationSelection()}
          </div>
          {getContentDom()}
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
