import { useState, useRef, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  QuestionPassage,
  AnswerPassage,
  HighlightedPassage,
  Result,
} from "../shared";
import type { OnChangeArgs, OnKeyDownArgs } from "../shared/AnswerPassage";
import type {
  Subject,
  UserDetails,
  MockTestDetails,
  Passage,
} from "../../../types";
import axios from "../../../config/customAxios";
import Timer from "../../shared/timer";
import classes from "./styles.module.scss";

type Props = {
  subject?: Subject;
  userDetails: UserDetails;
  mockTestDetails?: MockTestDetails;
};

type UserResult = {
  accuracy?: number;
  totalErrorCount?: number;
  totalTypedWords?: number;
  correctWordIndices?: number[];
};

type TestStage =
  | "KEYBOARD"
  | "KEYBOARD_BREAK"
  | "PRACTICE"
  | "PRACTICE_BREAK"
  | "TEST";

const TimerDetails = {
  KEYBOARD: {
    initialValue: 300,
    isCountDown: true,
  },
  KEYBOARD_BREAK: {
    initialValue: 300,
    isCountDown: true,
  },
  PRACTICE: {
    initialValue: 600,
    isCountDown: true,
  },
  PRACTICE_BREAK: {
    initialValue: 120,
    isCountDown: true,
  },
  TEST: {
    initialValue: 600,
    isCountDown: true,
  },
};

const PASSAGE_KEY_TO_MODE = {
  KEYBOARD: "keyboardTestPassageDetails",
  PRACTICE: "practicePassageDetails",
  TEST: "testPassageDetails",
};

const BREAK_SESSIONS = ["KEYBOARD_BREAK", "PRACTICE_BREAK"];

const TEST_STAGES: TestStage[] = [
  "KEYBOARD_BREAK",
  "PRACTICE",
  "PRACTICE_BREAK",
  "TEST",
];

const MockTests = ({ subject, mockTestDetails }: Props) => {
  const [keystrokesCount, setKeystrokesCount] = useState<number>(0);
  const [backspacesCount, setBackspacesCount] = useState<number>(0);
  const [userInputText, setUserInputText] = useState<string>("");
  const [shouldShowResult, setShouldShowResult] = useState<boolean>(false);
  const [totalTypedWords, setTotalTypedWords] = useState<number>(0);
  const [shouldShowAutoSubmitWarning, setShouldShowAutoSubmitWarning] =
    useState<boolean>(false);
  const [shouldStartTimer, setShouldStartTimer] = useState<boolean>(false);

  const [currenTestStage, setCurrentTestStage] =
    useState<TestStage>("KEYBOARD");

  const [shouldShowWarningDom, setShouldShowWarningDom] =
    useState<boolean>(false);

  const currentPassageKey: string = PASSAGE_KEY_TO_MODE[currenTestStage] || "";

  const currentPassageDetails: Passage = mockTestDetails?.[currentPassageKey];

  const [duration, setDuration] = useState<number>(0);

  const userResult = useRef<UserResult>({});

  const userInputRef = useRef<HTMLTextAreaElement>(null);

  const englishInputText = useRef<string>("");

  const { toast } = useToast();

  const resetUserActions = () => {
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
    setShouldShowResult(false);
    setShouldStartTimer(false);
    setShouldShowAutoSubmitWarning(false);
  };

  const isBreakSession = BREAK_SESSIONS.includes(currenTestStage);

  const toggleWarningDom = () => {
    if (userResult.current?.totalTypedWords) {
      return;
    }
    setShouldShowWarningDom(true);
    setTimeout(() => {
      window.location.reload();
    }, 5000);
  };

  const getWarningDom = () => {
    if (shouldShowWarningDom) {
      return (
        <div className="flex max-h-max items-center flex-col">
          <DialogHeader>
            <DialogTitle>Mock Test will be ending soon as...</DialogTitle>
            <DialogDescription>
              we have detected an interruption for one or more of the following
              actions:
            </DialogDescription>
          </DialogHeader>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li>
              Attempting to minimize or switch away from the Assessment Console
            </li>
            <li>
              Pressing restricted special keys on your keyboard during the
              Assessment
            </li>
            <li>
              Navigating away from the Assessment Console, which is not allowed
            </li>
            <li>Attempting to refresh the page</li>
          </ul>
        </div>
      );
    }
    return null;
  };

  const onUserInputKeyDown = ({
    updatedBackspacesCount = 0,
    updatedTypedWordsCount = 0,
    updatedKeystrokesCount = 0,
    updatedUserInputText = "",
  }: OnKeyDownArgs) => {
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
    try {
      const response = await axios.post("/student/submit-result/", {
        mode: "MOCK",
        subject,
        inputText: userInputText,
        passageText: currentPassageDetails?.passageText,
        keystrokesCount,
        backspacesCount,
        passageId: currentPassageDetails?.passageId,
        duration,
      });
      const { result, accessLimitReached } = response?.data || {};
      if (!result) {
        throw new Error("Error occurred while saving result data");
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
    }
    setShouldShowResult(true);
  };

  const getAutoSubmitWarningDom = () => {
    if (currenTestStage !== "TEST" || !shouldShowAutoSubmitWarning) {
      return null;
    }

    return (
      <h4 className="align-middle text-lg max-w-max m-auto">
        This passage will be submitted automatically in
        <span className={`text-red-400 font-bold ${classes.animateBlink}`}>{` ${
          TimerDetails.TEST.initialValue - duration
        } Seconds`}</span>
      </h4>
    );
  };

  const getAnswerPassageDom = () => {
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

  const getQuestionPassageDom = () => {
    if (!shouldShowResult) {
      return (
        <QuestionPassage
          selectedPassageId={currentPassageDetails?.passageId}
          questionPassage={currentPassageDetails?.passageText}
        />
      );
    }

    return (
      <HighlightedPassage
        correctWordIndices={userResult.current?.correctWordIndices || []}
        selectedPassageId={currentPassageDetails?.passageId}
        questionPassage={currentPassageDetails?.passageText}
      />
    );
  };

  const getResultDom = () => {
    if (!shouldShowResult) {
      return null;
    }

    const updatedTotalWords =
      currentPassageDetails?.passageText?.split(" ")?.length || 0;

    let totalPendingWordsClone = updatedTotalWords - totalTypedWords || 0;
    totalPendingWordsClone =
      totalPendingWordsClone >= 0 ? totalPendingWordsClone : 0;

    return (
      <div className="col-span-3 xl:col-span-1">
        <Result
          totalWordsCount={updatedTotalWords}
          keystrokesCount={keystrokesCount}
          backspaceCount={backspacesCount}
          accuracy={userResult.current.accuracy || 0}
          errorCount={userResult.current.totalErrorCount || 0}
          typedWordsCount={totalTypedWords}
          pendingWordsCount={totalPendingWordsClone}
        />
      </div>
    );
  };

  const getPassageWrapperDom = () => {
    if (isBreakSession || !currentPassageDetails?.passageId) {
      return null;
    }

    return (
      <div className="grid grid-cols-1 gap-[20px] xl:grid-cols-4">
        <div className="col-span-3">
          <div className="flex flex-col gap-5">
            {getQuestionPassageDom()}
            <div className="flex gap-[10px] flex-col">
              {getAnswerPassageDom()}
              {getAutoSubmitWarningDom()}
            </div>
          </div>
        </div>
        {getResultDom()}
      </div>
    );
  };

  const getContentDom = () => {
    if (shouldShowWarningDom) {
      return null;
    }
    let currentStageTitle = "";
    let currentDescription = "";
    switch (currenTestStage) {
      case "PRACTICE":
      case "KEYBOARD":
        currentStageTitle = `Passage for ${currenTestStage.toLocaleLowerCase()}`;
        currentDescription =
          "You will have trial passages to make yourself familiar with keyboard and exam pattern. These passages won't be consider for result";
        break;
      case "KEYBOARD_BREAK":
      case "PRACTICE_BREAK":
        currentStageTitle = "Break Session";
        currentDescription =
          "You will have short break in between different sessions before attempting final test";
        break;
      case "TEST":
        currentStageTitle = "Passage for final exam test";
        currentDescription =
          "This passage will be considered for final result. Best of luck 👍";
        break;
      default:
        break;
    }

    const headerDom = (
      <DialogHeader>
        <DialogTitle>{currentStageTitle}</DialogTitle>
        <DialogDescription>{currentDescription}</DialogDescription>
      </DialogHeader>
    );

    if (isBreakSession) {
      return (
        <div className="flex flex-col gap-5 h-full items-center justify-center">
          {headerDom}
          <Timer
            interval={1000}
            initialValue={timerInitialValue}
            shouldResetTimer={currentPassageDetails?.passageId || "test"}
            isCountdown
            shouldStart={shouldStartTimer}
            updateDuration={setDuration}
          />
        </div>
      );
    }

    return (
      <div>
        {headerDom}
        <div className="flex gap-5 items-center justify-center">
          <Timer
            interval={1000}
            initialValue={timerInitialValue}
            shouldResetTimer={currentPassageDetails?.passageId || "test"}
            isCountdown
            shouldStart={shouldStartTimer}
            updateDuration={setDuration}
          />
        </div>
        {getPassageWrapperDom()}
      </div>
    );
  };

  const timerInitialValue = TimerDetails?.[currenTestStage]?.initialValue || 0;

  const remainingTime = timerInitialValue - duration || 0;

  useEffect(() => {
    if (currenTestStage === "TEST") {
      // auto submit on time up
      if (remainingTime && remainingTime < 60 && !shouldShowAutoSubmitWarning) {
        setShouldShowAutoSubmitWarning(true);
      } else if (userInputText && remainingTime === 0) {
        onSubmitPassage();
        setShouldShowAutoSubmitWarning(false);
      }
      return;
    }

    if (remainingTime === 0) {
      const nextTestStage = TEST_STAGES.shift();
      if (nextTestStage) {
        setCurrentTestStage(nextTestStage);
      }
      resetUserActions();
    }
  }, [remainingTime]);

  useEffect(() => {
    setShouldStartTimer(true);
  }, [currenTestStage]);

  useEffect(() => {
    window.addEventListener("beforeunload", toggleWarningDom);
    document.addEventListener("visibilitychange", toggleWarningDom);
    window.addEventListener("resize", toggleWarningDom);

    return () => {
      window.removeEventListener("beforeunload", toggleWarningDom);
      document.removeEventListener("visibilitychange", toggleWarningDom);
      window.removeEventListener("resize", toggleWarningDom);
    };
  }, []);

  return (
    <Dialog open>
      <DialogContent
        shouldShowCloseOption={false}
        className="min-w-[calc(100dvw-30px)] h-[calc(100dvh-30px)]"
      >
        {getContentDom()}
        {getWarningDom()}
      </DialogContent>
    </Dialog>
  );
};

export default MockTests;
