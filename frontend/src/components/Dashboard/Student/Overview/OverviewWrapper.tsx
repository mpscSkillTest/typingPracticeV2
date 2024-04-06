import { useEffect, useState } from "react";
import type { Subject, Result, TypingMode } from "../../../../types";
import axios from "../../../../config/customAxios";
import OverView from "./OverView";

type Props = {
  subject: Subject;
  mode: TypingMode;
};

const OverviewWrapper = (props: Props) => {
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
      console.log(error);
    } finally {
      setShowLoader(false);
    }
    setStudentResults(updatedStudentResults);
  };

  useEffect(() => {
    getStudentResults();
  }, [subject, mode]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12">
      <OverView
        results={studentResults}
        type="GENERAL_KEYSTROKES_CONFIG"
        title="Keystrokes Vs Backspaces Count"
        showLoader={showLoader}
      />
      <OverView
        type="GENERAL_ACCURACY_CONFIG"
        title="Accuracy Percentage Vs Error Count"
        showLoader={showLoader}
        results={studentResults}
      />
    </div>
  );
};

export default OverviewWrapper;
