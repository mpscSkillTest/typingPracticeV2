import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Columns } from "./DataTable/Column";
import { DataTable } from "./DataTable/Table";
import type { Subject, Result, TypingMode } from "../../../../types";
import axios from "../../../../config/customAxios";

type Props = {
  subject: Subject;
  mode: TypingMode;
};

const RecentResults = (props: Props) => {
  const { subject, mode } = props;
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [studentResults, setStudentResults] = useState<Result[]>([]);

  const getStudentResults = async () => {
    let updatedStudentResults = [];
    setShowLoader(true);
    try {
      const { data } = await axios.post("/student/recent-results/", {
        subject,
        mode,
      });
      const { results } = data || {};
      if (!results) {
        throw new Error("No Results Found");
      }
      updatedStudentResults = results;
    } catch (error) {
      updatedStudentResults = [];
      console.error(error);
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

  useEffect(() => {
    getStudentResults();
  }, [subject, mode]);

  return (
    <Card className="col-span-8">
      <CardHeader>
        <CardTitle>Recent Results</CardTitle>
      </CardHeader>
      <CardContent>{getTableDom()}</CardContent>
    </Card>
  );
};

export default RecentResults;
