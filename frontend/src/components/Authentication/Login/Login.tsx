import { useState } from "react";
import type { BaseSyntheticEvent, HTMLInputTypeAttribute } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { AUTH_TOKEN_KEY } from "../../../utils/constant";
import { getCookieHandlers } from "../../../utils/utils";
import userLoginSchema, { type UserLoginSchema } from "./LoginSchema";
import axios from "../../../config/customAxios";

function Login() {
  const [loader, setLoader] = useState<boolean>(false);
  const [shouldDisableForgotPassword, setShouldDisableForgotPassword] =
    useState<boolean>(false);

  const { toast } = useToast();
  const { setCookieValue: setAccessToken } =
    getCookieHandlers(AUTH_TOKEN_KEY)();

  const navigate = useNavigate();

  const registrationForm = useForm<UserLoginSchema>({
    resolver: zodResolver(userLoginSchema),
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
        data?.user &&
        typeof data?.accessToken === "string" &&
        typeof setAccessToken === "function"
      ) {
        setAccessToken(data.accessToken);
        navigate("/");
      }
    } catch (error: unknown) {
      const errorMessage = error?.response?.data?.error || "Something wrong";
      setLoader(false);
      console.error(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: errorMessage,
        duration: 3000,
      });
    }
  };

  const handleForgotPassword = async (event: BaseSyntheticEvent) => {
    event.preventDefault();
    setShouldDisableForgotPassword(true);
    try {
      const { data } = await axios.post("/authorize/forgot-password/", {
        emailId: getFormFieldValues("emailId"),
      });
      if (data?.msg) {
        toast({
          title: "Password Reset Link Sent",
          description:
            "Please check your spam or junk folder if you don't see the email in your inbox. ",
          duration: 6000,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
      });
    } finally {
      setShouldDisableForgotPassword(false);
    }
  };

  const shouldDisableSubmit = () => {
    return !isDirty && !isValid;
  };

  const getTextFormField = (
    fieldName: keyof UserLoginSchema,
    fieldLabel: string,
    fieldType: HTMLInputTypeAttribute
  ) => {
    return (
      <FormField
        control={registrationForm.control}
        name={fieldName}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="my-[5px]">{fieldLabel}</FormLabel>
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
  
  const [showPassword, setShowPassword] = useState(false);
  return (
    <Card className="rounded-md">
      <Form {...registrationForm}>
        <form
          onSubmit={registrationForm.handleSubmit(onLoginUser)}
          className="min-w-[300px] px-[10px] m-0 box-content overflow-y-auto"
        >
          {getTextFormField("emailId", "Email", "text")}
          <div className="relative">
            {getTextFormField(
              "password",
              "Password",
              showPassword ? "text" : "password"
            )}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-12 transform -translate-y-1/2 right-2 px-2 focus:outline-none"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-black-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2c-3.682 0-6.945 2.037-8.667 5.333C3.055 9.38 4.487 11.51 6.307 13c.697.6 1.5 1 2.367 1 .867 0 1.67-.4 2.367-1 1.82-1.49 3.252-3.62 4.974-5.667C16.945 4.037 13.682 2 10 2zM10 15c-1.56 0-2.997-.7-4-1.834C4.003 11.6 5.44 9.5 7.5 8c1.002-.834 2.44-1.834 4-1.834s2.998.7 4 1.834c2.06 1.5 3.497 3.6 3.5 5.166C16.998 14.3 13.56 15 10 15zM10 6a3 3 0 100 6 3 3 0 000-6z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-black-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.5 6a.5.5 0 01.5.5c0 .177-.04.346-.108.5H11c1.104 0 2 .896 2 2v1a2 2 0 01-2 2H9.392c.068.154.108.323.108.5a.5.5 0 01-.5.5.5.5 0 01-.5-.5c0-.177.04-.346.108-.5H7c-1.104 0-2-.896-2-2V9c0-1.104.896-2 2-2h.5a.5.5 0 110-1h-.5C6.673 6 6 6.673 6 7.5S6.673 9 7.5 9h1c.827 0 1.5-.673 1.5-1.5a.5.5 0 01.5-.5zM10 2c-3.682 0-6.945 2.037-8.667 5.333C3.055 9.38 4.487 11.51 6.307 13c.697.6 1.5 1 2.367 1 .867 0 1.67-.4 2.367-1 1.82-1.49 3.252-3.62 4.974-5.667C16.945 4.037 13.682 2 10 2zm0 11c-1.56 0-2.997-.7-4-1.834C4.003 11.6 5.44 9.5 7.5 8c1.002-.834 2.44-1.834 4-1.834s2.998.7 4 1.834c2.06 1.5 3.497 3.6 3.5 5.166C16.998 14.3 13.56 15 10 15zm0-9a3 3 0 100 6 3 3 0 000-6z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>
          <Button
            showLoader={loader}
            disabled={shouldDisableSubmit()}
            style={{ marginBottom: "10px" }}
            className="w-full"
            type="submit"
          >
            Sign in
          </Button>
          <Button
            onClick={handleForgotPassword}
            className="relative right-0 w-full"
            variant="link"
            disabled={shouldDisableForgotPassword}
          >
            Forgot password?
          </Button>
        </form>
      </Form>
    </Card>
  );
}

export default Login;
