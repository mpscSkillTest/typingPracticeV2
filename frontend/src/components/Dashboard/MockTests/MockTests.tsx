import { useState, useRef, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "@/components/ui/icons";
import { QuestionPassage, AnswerPassage, HighlightedPassage } from "../shared";
import type { OnChangeArgs, OnKeyDownArgs } from "../shared/AnswerPassage";
import type { Subject, Passage, UserDetails } from "../../../types";
import axios from "../../../config/customAxios";
import Timer from "../../shared/timer";

import classes from "./styles.module.scss";

type Props = {
  subject: Subject;
  userDetails: UserDetails;
};

type UserResult = {
  accuracy?: number;
  totalErrorCount?: number;
  totalTypedWords?: number;
  correctWordIndices?: number[];
};

const TimerDetails = {
  MOCK: {
    initialValue: 300,
    isCountDown: true,
  },
};

const MockTests = ({ subject }: Props) => {
  const [keystrokesCount, setKeystrokesCount] = useState<number>(0);
  const [backspacesCount, setBackspacesCount] = useState<number>(0);
  const [userInputText, setUserInputText] = useState<string>("");
  const [availablePassages, setAvailablePassages] = useState<Passage[]>([]);
  const [questionPassage, setQuestionPassage] = useState<string>("");
  const [selectedPassageId, setSelectedPassageId] = useState<string>("");
  const [shouldStartTimer, setShouldStartTimer] = useState<boolean>(false);
  const [shouldShowResult, setShouldShowResult] = useState<boolean>(false);
  const [totalTypedWords, setTotalTypedWords] = useState<number>(0);
  const [shouldShowLoader, setShouldShowLoader] = useState<boolean>(false);
  const [detailsLoading, setDetailsLoading] = useState<boolean>(false);
  const [shouldShowAutoSubmitWarning, setShouldShowAutoSubmitWarning] =
    useState<boolean>(false);

  const [duration, setDuration] = useState<number>(0);

  const userResult = useRef<UserResult>({});

  const userInputRef = useRef<HTMLTextAreaElement>(null);

  const englishInputText = useRef<string>("");

  const { toast } = useToast();

  const totalWords = useRef<number>(0);

  const onUserInputKeyDown = ({
    updatedBackspacesCount = 0,
    updatedTypedWordsCount = 0,
    updatedKeystrokesCount = 0,
    updatedUserInputText = "",
  }: OnKeyDownArgs) => {
    if (!shouldStartTimer) {
      setShouldStartTimer(true);
    }
    if (subject === "ENGLISH") {
      setBackspacesCount(updatedBackspacesCount);
      setKeystrokesCount(updatedKeystrokesCount);
    }

    if (subject === "MARATHI") {
      setKeystrokesCount(updatedKeystrokesCount);
      setTotalTypedWords(updatedTypedWordsCount);
      setBackspacesCount(updatedBackspacesCount);
      setUserInputText(updatedUserInputText);
    }
  };

  const onUserInputChange = ({
    updatedTypedWordsCount = 0,
    updatedUserInputText = "",
  }: OnChangeArgs) => {
    if (subject === "ENGLISH") {
      setTotalTypedWords(updatedTypedWordsCount);
      setUserInputText(updatedUserInputText);
    }
  };

  const onSubmitPassage = async () => {
    if (shouldStartTimer) {
      setShouldStartTimer(false);
    }
    setShouldShowLoader(true);
    try {
      const response = await axios.post("/student/submit-result/", {
        mode: "MOCK",
        subject,
        inputText: userInputText,
        passageText: questionPassage,
        keystrokesCount,
        backspacesCount,
        passageId: selectedPassageId,
        duration,
      });
      const { result, accessLimitReached } = response?.data || {};
      if (!result) {
        throw new Error("No Passages Available");
      }
      userResult.current = result;
      if (accessLimitReached) {
        toast({
          variant: "destructive",
          title: "You have exhausted your free trial limit",
          description:
            "To retain your test and practice results and to use our other exciting features, please consider to subscribe our Premium Package",
          duration: 6000,
          className: "absolute",
        });
      }
    } catch (error: unknown) {
      userResult.current = {};
      const errorMessage = error?.response?.data?.error || "Something wrong";
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: errorMessage,
      });
    } finally {
      setShouldShowLoader(false);
    }
    setShouldShowResult(true);
  };

  const getAvailablePassages = async () => {
    let newPassages = [];
    setDetailsLoading(true);
    try {
      const response = await axios.post("/student/passages/", {
        mode: "MOCK",
        subject,
      });
      if (!response?.data?.passages) {
        throw new Error("No Passages Available");
      }
      newPassages = response?.data?.passages || [];
    } catch (error: unknown) {
      newPassages = [];
      const errorMessage = error?.response?.data?.error || "Something wrong";
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: errorMessage,
        className: "my-[10px]",
      });
    } finally {
      setDetailsLoading(false);
    }
    return newPassages;
  };

  const getUserInputPassage = () => {
    return (
      <AnswerPassage
        subject={subject}
        shouldDisable={!!userResult.current?.totalTypedWords}
        onKeyDown={onUserInputKeyDown}
        onChange={onUserInputChange}
        totalTypedWords={totalTypedWords}
        keystrokesCount={keystrokesCount}
        backspacesCount={backspacesCount}
        userInputText={userInputText}
      />
    );
  };

  const getUserPassage = () => {
    if (!shouldShowResult) {
      return (
        <QuestionPassage
          selectedPassageId={selectedPassageId}
          questionPassage={questionPassage}
        />
      );
    }

    return (
      <HighlightedPassage
        correctWordIndices={userResult.current?.correctWordIndices || []}
        selectedPassageId={selectedPassageId}
        questionPassage={questionPassage}
      />
    );
  };

  const fetchDetails = async () => {
    const updatedPassages = await getAvailablePassages();
    setAvailablePassages(updatedPassages);
  };

  const resetUserActions = (updatedTotalWords: number = 0) => {
    totalWords.current = updatedTotalWords;
    userResult.current = {};
    englishInputText.current = "";
    if (userInputRef.current) {
      userInputRef.current.value = "";
      userInputRef.current.selectionStart = 0;
    }
    setKeystrokesCount(0);
    setBackspacesCount(0);
    setTotalTypedWords(0);
    setDuration(0);
    setUserInputText("");
    setShouldStartTimer(false);
    setShouldShowResult(false);
    setShouldShowLoader(false);
    setShouldShowAutoSubmitWarning(false);
  };

  const remainingTime = TimerDetails.MOCK.initialValue - duration || 0;

  useEffect(() => {
    fetchDetails();
  }, []);

  useEffect(() => {
    const selectedQuestionPassage: Passage | undefined = availablePassages[0];
    const { passageText = "", passageId } = selectedQuestionPassage || {};
    const updatedTotalWords = passageText?.split(" ")?.length || 0;
    resetUserActions(updatedTotalWords);
    setQuestionPassage(passageText || "");
    setSelectedPassageId(passageId);
  }, [availablePassages, selectedPassageId]);

  useEffect(() => {
    // auto submit on time up
    if (remainingTime && remainingTime < 60 && !shouldShowAutoSubmitWarning) {
      setShouldShowAutoSubmitWarning(true);
    } else if (userInputText && remainingTime === 0) {
      onSubmitPassage();
      setShouldShowAutoSubmitWarning(false);
    }
  }, [remainingTime]);

  if (detailsLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Icons.spinner height={48} width={48} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-[20px] xl:grid-cols-4 mx-5">
      <div className="col-span-4">
        <div className="flex gap-2 items-center justify-center">
          <Timer
            interval={1000}
            isCountdown={!!TimerDetails.MOCK.isCountDown}
            initialValue={TimerDetails.MOCK.initialValue}
            shouldStart={shouldStartTimer}
            updateDuration={setDuration}
            shouldResetTimer={selectedPassageId}
          />
        </div>
        <div className="flex flex-col gap-[20px]">
          {getUserPassage()}
          <div className="flex gap-[10px] flex-col">
            {getUserInputPassage()}

            {shouldShowAutoSubmitWarning ? (
              <h4 className="align-middle text-lg max-w-max m-auto">
                This passage will be submitted automatically in
                <span
                  className={`text-red-400 font-bold ${classes.animateBlink}`}
                >{` ${
                  TimerDetails.TEST.initialValue - duration
                } Seconds`}</span>
              </h4>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockTests;
