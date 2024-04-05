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
import { Subject, UserDetails, TypingMode, Passage } from "@/types";
import { handleEnglishKeyDown } from "./utils/handleEnglishKeydown";
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
  const [duration, setDuration] = useState<number>(0);

  const userResult = useRef<UserResult>({});

  const { userId } = userDetails;

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
    const { updatedBackspacesCount, updatedKeystrokesCount } =
      handleEnglishKeyDown({
        event,
        inputText: userInputText,
        currentBackspacesCount: backspacesCount,
        currentKeystrokesCount: keystrokesCount,
      });
    setBackspacesCount(updatedBackspacesCount);
    setKeystrokesCount(updatedKeystrokesCount);
  };

  const onUserInputChange: ChangeEventHandler = (event) => {
    if (subject === "MARATHI") {
      return;
    }
    if (subject === "ENGLISH") {
      const updatedInputText = event.target.value || "";
      const totalTypedWordsClone = updatedInputText.trim().split(" ").length;
      const totalPendingWordsClone = totalWords.current - totalTypedWordsClone;
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
            {availablePassages.map(({ passageId }: Passage, index: number) => {
              return (
                <SelectItem key={passageId} value={passageId}>
                  Passage {index + 1}
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
    }
    return newPassages;
  };

  const getUserInputPassage = () => {
    return (
      <Textarea
        unselectable="on"
        spellCheck={false}
        value={userInputText}
        onKeyDown={onUserInputKeyDown}
        onChange={onUserInputChange}
        onCut={restrictActions}
        onPaste={restrictActions}
        onCopy={restrictActions}
        onWheel={restrictActions}
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
    setKeystrokesCount(0);
    setBackspacesCount(0);
    setTotalTypedWords(0);
    setTotalPendingWords(updatedTotalWords);
    setDuration(0);
    setUserInputText("");
    setShouldStartTimer(false);
    setShouldShowResult(false);
    setShouldShowLoader(false);
  };

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

  return (
    <>
      <div className="grid grid-cols-1 gap-[20px] xl:grid-cols-4">
        <div className="col-span-3">
          <div className="flex items-center justify-center">
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
    </>
  );
};

export default EnglishPracticeArea;