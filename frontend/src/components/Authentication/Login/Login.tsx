"use client";
import { useState } from "react";
import type { BaseSyntheticEvent, HTMLInputTypeAttribute } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AUTH_TOKEN_KEY } from "../../../utils/constant";
import type { UserLoginSchema } from "./LoginSchema";
import axios from "../../../config/customAxios";
import userLoginSchema from "./LoginSchema";
import useCookie from "../../../utils/hooks/useCookie";
import classes from "./login.module.scss";

function Login() {
  const [loader, setLoader] = useState<boolean>(false);
  const { setCookieValue: setAccessToken } = useCookie(AUTH_TOKEN_KEY);

  const navigate = useNavigate();

  const registrationForm = useForm<UserLoginSchema>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      emailId: "smarttypehub@gmail.com",
      password: "1234567",
    },
    mode: "onBlur",
  });

  const {
    formState: { isDirty, isValid },
    getValues: getFormFieldValues,
  } = registrationForm;

  const onLoginUser = async (userInput: UserLoginSchema) => {
    try {
      setLoader(true);
      const response = await axios.post("/authorize/login/", userInput);
      setLoader(false);
      const { data } = response || {};
      if (
        data &&
        data.user &&
        typeof data.accessToken === "string" &&
        typeof setAccessToken === "function"
      ) {
        setAccessToken(data.accessToken);
        navigate("/student/122/dashboard");
      }
    } catch (error) {
      setLoader(false);
      console.error(error);
    }
  };

  const handleForgotPassword = async (event: BaseSyntheticEvent) => {
    event.preventDefault();
    try {
      await axios.post("/authorize/forgotPassword/", {
        email: getFormFieldValues("emailId"),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const shouldDisableSubmit = () => {
    return !isDirty && !isValid;
  };

  const redirectToSignup = () => {
    navigate("/register");
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
          <FormItem className="flex flex-col">
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
            {fieldType === "password" ? (
              <Button
                onClick={handleForgotPassword}
                className="justify-end pl-[0px]"
                variant="link"
              >
                Forgot password?
              </Button>
            ) : null}
          </FormItem>
        )}
      />
    );
  };

  return (
    <Card className="w-full h-full bg-white flex flex-col items-center justify-center">
      <CardHeader className="space-y-0 p-[10px]">
        <CardTitle>Student Registration</CardTitle>
      </CardHeader>
      <Form {...registrationForm}>
        <form
          onSubmit={registrationForm.handleSubmit(onLoginUser)}
          className={`min-w-[300px] px-[10px] m-0 box-content overflow-y-auto ${classes.formBackground}`}
        >
          {getTextFormField("emailId", "Email Id", "text")}
          {getTextFormField("password", "Password", "password")}
          <Button
            showLoader={loader}
            disabled={shouldDisableSubmit()}
            style={{ marginTop: "10px", marginBottom: "10px" }}
            className="w-full"
            type="submit"
          >
            Log in
          </Button>
        </form>
      </Form>
      <CardFooter>
        Don't have an account?
        <Button
          onClick={redirectToSignup}
          className="pl-[5px] relative bottom-[1px]"
          variant="link"
        >
          Sign up
        </Button>
      </CardFooter>
    </Card>
  );
}

export default Login;
