import {
  useState,
  useRef,
  useEffect,
  type BaseSyntheticEvent,
  KeyboardEvent,
  ChangeEventHandler,
} from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { handleEnglishKeyDown } from "./utils/handleEnglishKeydown";
import { handleMarathiKeyDown } from "./utils/handleMarathiKeydown";
import type { Subject, UserDetails, TypingMode, Passage } from "../../../types";
import axios from "../../../config/customAxios";
import Result from "./Result";
import Timer from "../../shared/timer";
import classes from "./styles.module.scss";

type Props = {
  userDetails: UserDetails;
  subject: Subject;
  mode: TypingMode;
};

type UserResult = Record<string, number | number[]>;

const TimerDetails = {
  PRACTICE: {
    initialValue: 0,
    isCountDown: false,
  },
  TEST: {
    initialValue: 600,
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

  const userInputRef = useRef<HTMLTextAreaElement>(null);

  const englishInputText = useRef<string>("");

  const { userId } = userDetails || {};

  const toast = useToast();

  const totalWords = useRef<number>(0);

  const restrictActions = (event: BaseSyntheticEvent) => {
    event?.preventDefault?.();
    return false;
  };

  const onUserInputKeyDown = (event: KeyboardEvent) => {
    if (!shouldStartTimer) {
      setShouldStartTimer(true);
    }
    if (subject === "ENGLISH") {
      const { updatedBackspacesCount, updatedKeystrokesCount } =
        handleEnglishKeyDown({
          event,
          inputText: userInputText,
          currentBackspacesCount: backspacesCount,
          currentKeystrokesCount: keystrokesCount,
        });

      setBackspacesCount(updatedBackspacesCount);
      setKeystrokesCount(updatedKeystrokesCount);
    }

    if (subject === "MARATHI") {
      const marathiTranslationDetails = handleMarathiKeyDown({
        event,
        userInputRef: userInputRef.current,
        EnglishTextReal: englishInputText.current,
        currentBackspacesCount: backspacesCount,
        currentKeystrokesCount: keystrokesCount,
        currentTypedWordsCount: totalTypedWords,
      });
      const {
        updatedBackspacesCount,
        translatedMarathiText,
        updatedEnglishTextInput,
        updatedCursorPosition,
        updatedTypedWordsCount,
        updatedKeystrokesCount,
      } = marathiTranslationDetails || {};
      englishInputText.current = updatedEnglishTextInput;
      if (userInputRef.current) {
        userInputRef.current.selectionStart = updatedCursorPosition;
      }
      let totalPendingWordsClone =
        totalWords.current - updatedTypedWordsCount || 0;

      totalPendingWordsClone =
        totalPendingWordsClone >= 0 ? totalPendingWordsClone : 0;

      setTotalPendingWords(totalPendingWordsClone);
      setKeystrokesCount(updatedKeystrokesCount);
      setTotalTypedWords(updatedTypedWordsCount);
      setBackspacesCount(updatedBackspacesCount);
      setUserInputText(translatedMarathiText);
    }
  };

  const onUserInputChange: ChangeEventHandler<HTMLTextAreaElement> = (
    event
  ) => {
    if (subject === "MARATHI") {
      event.preventDefault?.();
      return;
    }
    if (subject === "ENGLISH") {
      const updatedInputText = event.target.value || "";
      const totalTypedWordsClone = updatedInputText.trim().split(" ").length;
      let totalPendingWordsClone = totalWords.current - totalTypedWordsClone;
      totalPendingWordsClone =
        totalPendingWordsClone >= 0 ? totalPendingWordsClone : 0;
      setTotalTypedWords(totalTypedWordsClone);
      setTotalPendingWords(totalPendingWordsClone);
      setUserInputText(updatedInputText);
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
        duration,
      });
      const { result } = response?.data || {};
      if (!result) {
        throw new Error("No Passages Available");
      }
      userResult.current = result;
    } catch (error: unknown) {
      userResult.current = {};
      const errorMessage = error?.response?.data?.error || "Something wrong";
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: errorMessage,
        className: "my-[10px]",
      });
    } finally {
      setShouldShowLoader(false);
    }
    setShouldShowResult(true);
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
      <Textarea
        spellCheck={false}
        ref={userInputRef}
        value={userInputText}
        onKeyDown={onUserInputKeyDown}
        onChange={onUserInputChange}
        onCut={restrictActions}
        onPaste={restrictActions}
        onCopy={restrictActions}
        onWheel={restrictActions}
        disabled={!!userResult.current?.totalTypedWords}
        className={`h-[200px] resize-none font-normal text-md text-black ${classes.userSelect}`}
        placeholder="Type your passage here."
      />
    );
  };

  const getUserPassage = () => {
    if (!shouldShowResult) {
      return (
        <Textarea
          readOnly
          className={`resize-none h-[200px] font-medium text-md text-black ${classes.passageText} ${classes.userSelect}`}
          disabled
          onChange={restrictActions}
          onPaste={restrictActions}
          onCopy={restrictActions}
          value={questionPassage}
        />
      );
    }
    const expectedWords = questionPassage?.trim?.()?.split(" ").filter(Boolean);

    return (
      <div
        className={` w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50  overflow-y-auto flex flex-wrap gap-1 rounded-md focus-visible:ring-offset-2 h-[200px] font-medium text-md text-black ${classes.passageText}`}
      >
        {expectedWords.map((word, index) => {
          if (userResult.current?.correctWordIndices?.includes(index)) {
            return <span className="text-[16px]  text-green-500">{word}</span>;
          }
          return <span className="text-[16px] text-red-500">{word}</span>;
        })}
      </div>
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
              <h4 className="align-middle text-lg max-w-max m-auto">
                This passage will be submitted automatically in
                <span
                  className={`text-red-400 font-bold ${classes.animateBlink}`}
                >{` ${
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
          </div>
        </div>
      </div>
      <div className="col-span-3 xl:col-span-1">
        <Result
          totalWordsCount={totalWords.current}
          keystrokesCount={keystrokesCount}
          backspaceCount={backspacesCount}
          accuracy={userResult.current.accuracy || 0}
          errorCount={userResult.current.totalErrorCount || 0}
          typedWordsCount={totalTypedWords}
          pendingWordsCount={totalPendingWords}
        />
      </div>
    </div>
  );
};

export default EnglishPracticeArea;
