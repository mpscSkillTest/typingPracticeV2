import { useState, useRef } from "react";
import type { HTMLInputTypeAttribute } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import axios from "../../../config/customAxios";
import type { UserRegistrationSchema } from "./RegistrationSchema";
import userRegistrationSchema from "./RegistrationSchema";

function Registration() {
  const [loader, setLoader] = useState<boolean>(false);
  const [shouldShowConfirmation, setShouldShowConfirmation] =
    useState<boolean>(false);

  const title = useRef<string>("");
  const description = useRef<string>("");

  const registrationForm = useForm<UserRegistrationSchema>({
    resolver: zodResolver(userRegistrationSchema),
    mode: "onBlur",
  });

  const {
    formState: { isDirty, isValid },
  } = registrationForm;

  const onSubmitUserData = async (userInput: UserRegistrationSchema) => {
    try {
      setLoader(true);
      const response = await axios.post("/authorize/signup/", userInput);
      setLoader(false);
      if (response.data.user) {
        title.current = "Confirmation Mail Sent";
        description.current =
          "Please verify your email address. Wait for sometime and also check your spam or junk folder if you don't see the email in your inbox";
        setShouldShowConfirmation(true);
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.error || "Something broke";
      setLoader(false);
      console.error(error);
      title.current = "Uh oh! Something went wrong";
      description.current = errorMessage;
      setShouldShowConfirmation(true);
    }
  };

  const shouldDisableSubmit = () => {
    return !isDirty || !isValid;
  };

  const getTextFormField = (
    fieldName: any,
    fieldLabel: string,
    fieldType: HTMLInputTypeAttribute
  ) => {
    return (
      <FormField
        control={registrationForm.control}
        name={fieldName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{fieldLabel}</FormLabel>
            <FormControl>
              <Input
                className="focus-visible:ring-offset-0"
                type={fieldType}
                placeholder={fieldLabel}
                autoComplete="off"
                {...field}
              />
            </FormControl>
            <FormMessage className="space-y-[5px]" />
          </FormItem>
        )}
      />
    );
  };

  const toggleConfirmationModal = () => {
    setShouldShowConfirmation(
      (prevShouldShowConfirmation) => !prevShouldShowConfirmation
    );
  };

  const getConfirmationModalDom = () => {
    return (
      <Dialog
        open={shouldShowConfirmation}
        onOpenChange={toggleConfirmationModal}
      >
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col gap-4">
            <div className="text-black font-semibold text-lg">
              {title.current}
            </div>
            <div className="text-black text-xs">{description.current}</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <>
      <Card className="rounded-md">
        <Form {...registrationForm}>
          <form
            onSubmit={registrationForm.handleSubmit(onSubmitUserData)}
            className={`min-w-[300px] px-[10px] m-0 box-content overflow-y-auto`}
          >
            {getTextFormField("userName", "Name", "text")}
            {getTextFormField("contactNumber", "Contact Number", "text")}
            {getTextFormField("emailId", "Email", "text")}
            {getTextFormField("password", "Password", "password")}
            {getTextFormField("confirmPassword", "Confirm Password", "text")}
            <Button
              showLoader={loader}
              disabled={shouldDisableSubmit()}
              style={{ marginTop: "10px", marginBottom: "10px" }}
              className="w-full"
              type="submit"
            >
              Sign up
            </Button>
          </form>
        </Form>
      </Card>
      {getConfirmationModalDom()}
    </>
  );
}

export default Registration;
