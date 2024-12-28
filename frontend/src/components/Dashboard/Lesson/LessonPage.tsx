import React, { useState, useRef, useEffect } from "react";
import {
  QuestionPassage,
  AnswerPassage,
  HighlightedPassage,
  PassingInfoMessage,
} from "../shared";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OnKeyDownArgs } from "../shared/AnswerPassage";
import { Button } from "@/components/ui/button";

const passages = [
  { passageId: "1", passageText: "This is the first passage text." },
  { passageId: "2", passageText: "This is the second passage text." },
  { passageId: "3", passageText: "This is the third passage text." },
];

const LessonPage = ({ subject = "MARATHI" }: { subject?: string }) => {
  const [keystrokesCount, setKeystrokesCount] = useState<number>(0);
  const [backspacesCount, setBackspacesCount] = useState<number>(0);
  const [userInputText, setUserInputText] = useState<string>("");
  const [totalTypedWords, setTotalTypedWords] = useState<number>(0);
  const [currentPassageDetails, setCurrentPassageDetails] = useState(
    passages[0]
  );
  const [selectedPassageId, setSelectedPassageId] = useState<string>("");


  const userInputRef = useRef<HTMLTextAreaElement>(null);

 

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

  const onUserInputChange = ({ updatedUserInputText = "" }: any) => {
    setUserInputText(updatedUserInputText);
  };

  const focusOnAnswerPassage = () => {
    userInputRef.current?.focus();
  };

  const onQuestionPassageSelect = (selectedPassageId: string) => {
    setSelectedPassageId(selectedPassageId);
  };

  useEffect(() => {
    const selectedPassage = passages.find(
      (passage) => passage.passageId === selectedPassageId
    );
    if (selectedPassage) {
      setCurrentPassageDetails(selectedPassage);
    }
  }, [selectedPassageId]);


  const getAnswerPassageDom = () => (
    <AnswerPassage
      subject={subject}
      onKeyDown={onUserInputKeyDown}
      onChange={onUserInputChange}
      totalTypedWords={totalTypedWords}
      keystrokesCount={keystrokesCount}
      backspacesCount={backspacesCount}
      userInputText={userInputText}
      userInputRef={userInputRef}
    />
  );

  const getQuestionPassageDom = () => (
    <QuestionPassage
      selectedPassageId={currentPassageDetails?.passageId}
      questionPassage={currentPassageDetails?.passageText}
      onScrollFocus={focusOnAnswerPassage}
    />
  );

  return (
    <div className="grid grid-cols-1 gap-[20px] xl:grid-cols-5">
      <div className="col-span-3">
        <div className="flex flex-col gap-5 p-4">
          <Select
            value={selectedPassageId}
            onValueChange={onQuestionPassageSelect}
          >
            <SelectTrigger className="w-[50%]">
              <SelectValue placeholder="Select Question Passage" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {passages.map(({ passageId, passageText }) => (
                  <SelectItem key={passageId} value={passageId}>
                    {passageText}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {getQuestionPassageDom()}
          <div className="flex gap-[10px] flex-col items-center">
            {getAnswerPassageDom()}
            <PassingInfoMessage subject={subject} />
          </div>
          <Button>Submit Passage</Button>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
