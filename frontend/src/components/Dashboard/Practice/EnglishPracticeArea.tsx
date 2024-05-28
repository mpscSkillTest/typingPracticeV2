import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icons } from "@/components/ui/icons";
import {
  QuestionPassage,
  AnswerPassage,
  HighlightedPassage,
  Result,
  PassingInfoMessage,
} from "../shared";
import {
  DEFAULT_ENGLISH_KEYSTROKES_COUNT,
  DEFAULT_MARATHI_KEYSTROKES_COUNT,
} from "../../../utils/constant";
import type { OnChangeArgs, OnKeyDownArgs } from "../shared/AnswerPassage";
import type { Subject, UserDetails, TypingMode, Passage } from "../../../types";
import axios from "../../../config/customAxios";
import Timer from "../../shared/timer";

type Props = {
  userDetails: UserDetails;
  subject: Subject;
  mode: TypingMode;
};

type UserResult = {
  accuracy?: number;
  totalErrorCount?: number;
  totalTypedWords?: number;
  correctWordIndices?: number[];
};

const TimerDetails = {
  PRACTICE: {
    initialValue: 0,
    isCountDown: false,
  },
  TEST: {
    initialValue: 600,
    isCountDown: true,
  },
  MOCK: {
    initialValue: 300,
    isCountDown: true,
  },
};

const EnglishPracticeArea = ({ userDetails, subject, mode }: Props) => {
  const [keystrokesCount, setKeystrokesCount] = useState<number>(0);
  const [backspacesCount, setBackspacesCount] = useState<number>(0);
  const [userInputText, setUserInputText] = useState<string>("");
  const [availablePassages, setAvailablePassages] = useState<Passage[]>([]);
  const [questionPassage, setQuestionPassage] = useState<string>("");
  const [selectedPassageId, setSelectedPassageId] = useState<string>("");
  const [shouldStartTimer, setShouldStartTimer] = useState<boolean>(false);
  const [shouldShowResult, setShouldShowResult] = useState<boolean>(false);
  const [totalTypedWords, setTotalTypedWords] = useState<number>(0);
  const [totalPendingWords, setTotalPendingWords] = useState<number>(0);
  const [shouldShowLoader, setShouldShowLoader] = useState<boolean>(false);
  const [detailsLoading, setDetailsLoading] = useState<boolean>(false);
  const [shouldShowAutoSubmitWarning, setShouldShowAutoSubmitWarning] =
    useState<boolean>(false);

  const [duration, setDuration] = useState<number>(0);

  const userResult = useRef<UserResult>({});

  const userResultAsPerMPSC = useRef<UserResult>({});

  const userInputRef = useRef<HTMLTextAreaElement>(null);

  const englishInputText = useRef<string>("");

  const { userId } = userDetails || {};

  const { toast } = useToast();

  /**
   * User input till first 1500 keystrokes is only valid for speed test
   */
  const validUserInput = useRef<string>("");

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
      let totalPendingWordsClone =
        totalWords.current - updatedTypedWordsCount || 0;
      totalPendingWordsClone =
        totalPendingWordsClone >= 0 ? totalPendingWordsClone : 0;
      setTotalPendingWords(totalPendingWordsClone);
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
      let totalPendingWordsClone = totalWords.current - updatedTypedWordsCount;
      totalPendingWordsClone =
        totalPendingWordsClone >= 0 ? totalPendingWordsClone : 0;
      setTotalTypedWords(updatedTypedWordsCount);
      setTotalPendingWords(totalPendingWordsClone);
      setUserInputText(updatedUserInputText);
    }
  };

  const shouldDisableUserInputText = () => {
    return (
      typeof userInputText !== "string" ||
      userInputText === "" ||
      userResult.current?.totalTypedWords
    );
  };

  const onQuestionPassageSelect = (selectedPassageId: string) => {
    setSelectedPassageId(selectedPassageId);
  };

  const onSubmitPassage = async () => {
    if (shouldStartTimer) {
      setShouldStartTimer(false);
    }
    setShouldShowLoader(true);
    try {
      const response = await axios.post("/student/submit-result/", {
        mode,
        subject,
        inputText: userInputText,
        passageText: questionPassage,
        keystrokesCount,
        backspacesCount,
        userId,
        passageId: selectedPassageId,
        validUserInput: validUserInput.current,
        duration,
      });
      const { result, accessLimitReached, resultAsPerMPSC } =
        response?.data || {};
      if (!result) {
        throw new Error("No Passages Available");
      }
      userResult.current = result;
      userResultAsPerMPSC.current = resultAsPerMPSC;
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
      userResultAsPerMPSC.current = {};
      const errorMessage = error?.response?.data?.error || "Something wrong";
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: errorMessage,
      });
    } finally {
      setShouldShowLoader(false);
      setShouldShowResult(true);
    }
  };

  const getPassageSelectDropdown = () => {
    return (
      <Select value={selectedPassageId} onValueChange={onQuestionPassageSelect}>
        <SelectTrigger className="w-[50%]">
          <SelectValue placeholder="Select Question Passage" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {availablePassages.map(({ passageId, passageTitle }: Passage) => {
              return (
                <SelectItem key={passageId} value={passageId}>
                  {passageTitle}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  };

  const getAvailablePassages = async () => {
    let newPassages = [];
    setDetailsLoading(true);
    try {
      const response = await axios.post("/student/passages/", {
        mode,
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
    userResultAsPerMPSC.current = {};
    englishInputText.current = "";
    validUserInput.current = "";
    if (userInputRef.current) {
      userInputRef.current.value = "";
      userInputRef.current.selectionStart = 0;
    }
    setKeystrokesCount(0);
    setBackspacesCount(0);
    setTotalTypedWords(0);
    setTotalPendingWords(updatedTotalWords);
    setDuration(0);
    setUserInputText("");
    setShouldStartTimer(false);
    setShouldShowResult(false);
    setShouldShowLoader(false);
    setShouldShowAutoSubmitWarning(false);
  };

  const remainingTime = TimerDetails[mode].initialValue - duration || 0;

  useEffect(() => {
    fetchDetails();
  }, []);

  useEffect(() => {
    if (!selectedPassageId) {
      setSelectedPassageId(availablePassages[0]?.passageId);
    } else {
      const selectedQuestionPassage: Passage | undefined =
        availablePassages.find(({ passageId }: Passage) => {
          return passageId === selectedPassageId;
        });
      const { passageText = "" } = selectedQuestionPassage || {};
      const updatedTotalWords = passageText?.split(" ")?.length || 0;
      resetUserActions(updatedTotalWords);
      setQuestionPassage(passageText || "");
    }
  }, [availablePassages, selectedPassageId]);

  useEffect(() => {
    // auto submit on time up
    if (mode === "TEST") {
      if (remainingTime && remainingTime < 60 && !shouldShowAutoSubmitWarning) {
        setShouldShowAutoSubmitWarning(true);
      } else if (userInputText && remainingTime === 0) {
        onSubmitPassage();
        setShouldShowAutoSubmitWarning(false);
      }
    }
  }, [remainingTime]);

  useEffect(() => {
    let validKeystrokesCount = DEFAULT_MARATHI_KEYSTROKES_COUNT;
    if (subject === "ENGLISH") {
      validKeystrokesCount = DEFAULT_ENGLISH_KEYSTROKES_COUNT;
    }
    if (keystrokesCount <= validKeystrokesCount) {
      validUserInput.current = userInputText;
    }
  }, [keystrokesCount]);

  if (detailsLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Icons.spinner height={48} width={48} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-[20px] xl:grid-cols-4">
      <div className="col-span-3">
        <div className="flex gap-2 items-center justify-center">
          {getPassageSelectDropdown()}
          <Timer
            interval={1000}
            isCountdown={!!TimerDetails[mode].isCountDown}
            initialValue={TimerDetails[mode].initialValue}
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
              <h4 className="align-middle text-lg max-w-max m-auto my-3">
                This passage will be submitted automatically in
                <span className={`text-red-400 font-bold`}>{` ${
                  TimerDetails.TEST.initialValue - duration
                } Seconds`}</span>
              </h4>
            ) : null}
            <Button
              disabled={!!shouldDisableUserInputText()}
              onClick={onSubmitPassage}
              showLoader={shouldShowLoader}
            >
              Submit Passage
            </Button>
            <PassingInfoMessage subject={subject} shouldShowInfo />
          </div>
        </div>
      </div>
      <div className="col-span-3 xl:col-span-1">
        <Result
          subject={subject}
          showResult={shouldShowResult}
          totalWordsCount={totalWords.current}
          keystrokesCount={keystrokesCount}
          backspaceCount={backspacesCount}
          accuracy={userResult.current.accuracy || 0}
          errorCount={userResult.current.totalErrorCount || 0}
          mpscAccuracy={userResultAsPerMPSC.current.accuracy || 0}
          mpscErrorCount={userResultAsPerMPSC.current.totalErrorCount || 0}
          typedWordsCount={totalTypedWords}
          pendingWordsCount={totalPendingWords}
        />
      </div>
    </div>
  );
};

export default EnglishPracticeArea;
