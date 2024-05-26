import { useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "../../config/customAxios";

type Props = {
  toggleOpen: () => void;
  shouldOpen: boolean;
};

const ContactForm = ({ toggleOpen, shouldOpen }: Props) => {
  const [feedback, setFeedback] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [showLoader, setShowLoader] = useState<boolean>(false);

  const { toast } = useToast();

  const onFeedbackChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback(event?.target?.value);
  };

  const onTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event?.target?.value);
  };

  const onSubmitFeedback = async () => {
    setShowLoader(true);
    try {
      const response = await axios.post("/student/submit-feedback/", {
        title,
        feedback,
      });
      const { feedbackSubmitted } = response?.data || {};
      if (!response?.data) {
        throw new Error("Error occurred while submitting user feedback");
      }

      if (feedbackSubmitted) {
        toast({
          title: "Thank you for submitting your Feedback",
          description:
            "We will have a look at your feedback and will connect with you. Thanks!",
          duration: 4000,
          className: "absolute",
        });
        toggleOpen();
      }
    } catch (error: unknown) {
      const errorMessage = error?.response?.data?.error || "Something wrong";
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: errorMessage,
      });
    } finally {
      setShowLoader(false);
    }
  };

  return (
    <Dialog onOpenChange={toggleOpen} open={shouldOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Feedback</DialogTitle>
          <DialogDescription>
            Help us improve by submitting your query or feedback
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 mt-3">
          <div className="flex flex-col gap-2 mt-3">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={onTitleChange}
              placeholder="title of your query or feedback"
              className="mt-2"
            />
          </div>
          <div className="flex flex-col gap-2 mt-3">
            <Label htmlFor="feedback">Query / Feedback</Label>
            <Textarea
              id="feedback"
              placeholder="Please enter your query or feedback"
              className="min-h-[200px] text-base mt-2 resize-none"
              onChange={onFeedbackChange}
              value={feedback}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={!feedback?.trim?.()?.length || !title?.trim?.()?.length}
            showLoader={showLoader}
            onClick={onSubmitFeedback}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContactForm;
