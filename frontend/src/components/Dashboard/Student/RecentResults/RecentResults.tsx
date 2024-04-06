import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Columns } from "./DataTable/Column";
import { DataTable } from "./DataTable/Table";
import type { Subject, Result, TypingMode } from "../../../../types";
import axios from "../../../../config/customAxios";

type Props = {
  subject: Subject;
};

const RecentResults = (props: Props) => {
  const { subject } = props;
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [studentResults, setStudentResults] = useState<Result[]>([]);
  const [selectedMode, setSelectedMode] = useState<TypingMode>("TEST");

  const getStudentResults = async () => {
    let updatedStudentResults = [];
    setShowLoader(true);
    try {
      const { data } = await axios.post("/student/recent-results/", {
        subject,
        mode: selectedMode,
      });
      const { results } = data || {};
      if (!results) {
        throw new Error("No Results Found");
      }
      updatedStudentResults = results;
    } catch (error) {
      updatedStudentResults = [];
      console.log(error);
    } finally {
      setShowLoader(false);
    }
    setStudentResults(updatedStudentResults);
  };

  const getTableDom = () => {
    if (showLoader) {
      return (
        <div className="h-full flex items-center justify-center">
          <Icons.spinner height={48} width={48} className="animate-spin" />
        </div>
      );
    }
    return <DataTable columns={Columns} data={studentResults} />;
  };

  const getTypingModeInput = () => {
    return (
      <Tabs
        value={selectedMode}
        onValueChange={setSelectedMode}
        className=" flex-1 space-y-4"
      >
        <TabsList>
          <TabsTrigger value="TEST">Test</TabsTrigger>
          <TabsTrigger value="PRACTICE">Practice</TabsTrigger>
        </TabsList>
      </Tabs>
    );
  };

  useEffect(() => {
    getStudentResults();
  }, [subject, selectedMode]);

  return (
    <Card className="col-span-8">
      <CardHeader>
        <CardTitle>
          <div className="flex gap-4 items-center">
            Recent Results
            {getTypingModeInput()}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>{getTableDom()}</CardContent>
    </Card>
  );
};

export default RecentResults;
