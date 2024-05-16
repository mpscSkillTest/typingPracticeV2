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
import { Icons } from "@/components/ui/icons";
import userLoginSchema, { type UserLoginSchema } from "./LoginSchema";
import axios from "../../../config/customAxios";

function Login() {
  const [loader, setLoader] = useState<boolean>(false);
  const [shouldDisableForgotPassword, setShouldDisableForgotPassword] =
    useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);

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

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

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
              onClick={togglePasswordVisibility}
              className="absolute top-12 transform -translate-y-1/2 right-2 px-2 focus:outline-none"
            >
              {showPassword ? (
                <Icons.Eye height={16} width={16} />
              ) : (
                <Icons.EyeOff height={16} width={16} />
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
