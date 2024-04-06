import { useState } from "react";
import type { BaseSyntheticEvent, HTMLInputTypeAttribute } from "react";
import { useNavigate } from "react-router-dom";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AUTH_TOKEN_KEY } from "../../../utils/constant";
import { getCookieHandlers } from "../../../utils/utils";
import type { UserLoginSchema } from "./LoginSchema";
import axios from "../../../config/customAxios";
import userLoginSchema from "./LoginSchema";

function Login() {
  const [loader, setLoader] = useState<boolean>(false);
  const { toast } = useToast();
  const { setCookieValue: setAccessToken } =
    getCookieHandlers(AUTH_TOKEN_KEY)();

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
      });
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
    <Card className="rounded-md">
      <Form {...registrationForm}>
        <form
          onSubmit={registrationForm.handleSubmit(onLoginUser)}
          className="min-w-[300px] px-[10px] m-0 box-content overflow-y-auto"
        >
          {getTextFormField("emailId", "Email", "text")}
          {getTextFormField("password", "Password", "password")}
          <Button
            showLoader={loader}
            disabled={shouldDisableSubmit()}
            style={{ marginBottom: "10px" }}
            className="w-full"
            type="submit"
          >
            Sign in
          </Button>
        </form>
      </Form>
    </Card>
  );
}

export default Login;
