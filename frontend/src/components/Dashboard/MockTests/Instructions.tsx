import { FormEventHandler, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Subject } from "../../../types";

type Props = {
  onStartTest: (subject: Subject) => void;
};

export const Instructions = ({ onStartTest }: Props) => {
  const [hasReadInstructions, setHasReadInstructions] =
    useState<boolean>(false);

  const toggleCheckbox = (isChecked: boolean) => {
    setHasReadInstructions(isChecked);
  };

  return (
    <div className="w-full mb-[10px]">
      <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
        📜 Important Instructions
      </h3>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        This is a mock test designed to familiarize you with the MPSC test
        pattern. Please read following instructions thoroughly to avoid
        disqualification, errors, and loss of time. Once you have read and
        understood the instructions, check the box to proceed.
      </p>

      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        <li>
          For Marathi Typing, use the Marathi <b>Remington GAIL</b> Keyboard
          layout
        </li>
        <li>
          For English Typing, use the <b>English (US)</b> Keyboard layout
        </li>
        <li>
          <b>Do not</b> use any keys or key combinations other than those
          required to type the given text
        </li>
        <li>
          <b>Do not</b> enter any special characters or symbols other than those
          specified in the provided text, as this may cause word skips, typing
          errors, and be counted as mistakes
        </li>
        <li>
          <b>Do not</b> switch between languages or keyboard inputs for any
          reason
        </li>
        <li>
          <b>Do not</b> press any keys after submitting the test and viewing the
          summary
        </li>
      </ul>
      <div className="flex items-center space-x-2 my-4">
        <Checkbox
          checked={hasReadInstructions}
          onCheckedChange={toggleCheckbox}
          id="instructions"
          className="rounded-[4px]"
        />
        <label
          htmlFor="instructions"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I have read and understood the instructions
        </label>
      </div>
      <div className="flex gap-2  flex-wrap">
        <Button
          disabled={!hasReadInstructions}
          onClick={onStartTest.bind(this, "MARATHI")}
        >
          Start Marathi Mock Test
        </Button>

        <Button
          disabled={!hasReadInstructions}
          onClick={onStartTest.bind(this, "ENGLISH")}
        >
          Start English Mock Test
        </Button>
      </div>
    </div>
  );
};
