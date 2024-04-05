import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Subject, TypingMode } from "../../../types";
import axios from "../../../config/customAxios";

type Props = {
  subject: Subject;
};

type Result = {
  accuracy: number;
  backspacesCount: number;
  date: string;
  duration: number;
  errorsCount: number;
  keystrokesCount: number;
  mode: TypingMode;
  passageId: string;
  subject: Subject;
  totalWordsCount: number;
  typedWordsCount: number;
};

const RecentResults = (props: Props) => {
  const { subject } = props;
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [studentResults, setStudentResults] = useState<Result[]>([]);

  const getStudentResults = async () => {
    let updatedStudentResults = [];
    setShowLoader(true);
    try {
      const { data } = await axios.post("/student/recent-results/", {
        subject,
        mode: "TEST",
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

  useEffect(() => {
    getStudentResults();
  }, [subject]);

  if (showLoader) {
    return <div>Loader</div>;
  }

  console.log({ studentResults });

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Recent Results</CardTitle>
      </CardHeader>
      <CardContent>{subject}</CardContent>
    </Card>
  );
};

export default RecentResults;
