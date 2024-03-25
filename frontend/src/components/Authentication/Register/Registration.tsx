"use client";
import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import axios from "../../../config/customAxios";
import type { UserRegistrationSchema } from "./RegistrationSchema";
import userRegistrationSchema from "./RegistrationSchema";

function Registration() {
  const [loader, setLoader] = useState<boolean>(false);
  const { toast } = useToast();

  const registrationForm = useForm<UserRegistrationSchema>({
    resolver: zodResolver(userRegistrationSchema),
    defaultValues: {
      userName: "Test",
      contactNumber: 1234567890,
      emailId: "smarttypehub@gmail.com",
      password: "1234567",
    },
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
        toast({
          title: "Confirmation Mail Sent",
          description: "Please verify your email address",
        });
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.error || "Something broke";
      setLoader(false);
      console.error(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: errorMessage,
      });
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

  return (
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
  );
}

export default Registration;
