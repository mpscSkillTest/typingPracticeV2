import { useEffect, useState } from "react";
import type {
  Subject,
  Result,
  TypingMode,
  DurationOption,
  DurationValue,
} from "../../../../types";
import { Duration } from "../../../../enums/Duration";
import axios from "../../../../config/customAxios";
import OverView from "./OverView";

type Props = {
  subject: Subject;
  mode: TypingMode;
  duration: DurationOption;
};

const OverviewWrapper = (props: Props) => {
  const { subject, mode, duration } = props;
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [studentResults, setStudentResults] = useState<Result[]>([]);

  const getStudentResults = async () => {
    let updatedStudentResults = [];
    const durationDetails: DurationValue = Duration[duration];
    setShowLoader(true);
    try {
      const { data } = await axios.post("/student/reports/", {
        subject,
        mode,
        duration: durationDetails.value,
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

  // to capitalize string with first letter as Capital
  const toProperCase = (txt: string) => {
    return txt.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  useEffect(() => {
    getStudentResults();
  }, [subject, mode, duration]);

  const customLabel = `${toProperCase(subject)} ${toProperCase(mode)}s`;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12">
      <OverView
        results={studentResults}
        type="GENERAL_KEYSTROKES_CONFIG"
        title="Keystrokes Vs Backspaces Count"
        showLoader={showLoader}
        label={customLabel}
        duration={duration}
      />
      <OverView
        type="GENERAL_ACCURACY_CONFIG"
        title="Accuracy Percentage Vs Error Count"
        showLoader={showLoader}
        results={studentResults}
        label={customLabel}
        duration={duration}
      />
    </div>
  );
};

export default OverviewWrapper;
