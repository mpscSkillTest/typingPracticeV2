import { useState } from "react";
import type { HTMLInputTypeAttribute } from "react";
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
import resetPasswordSchema, {
  type UserPasswordResetSchema,
} from "./ResetPasswordSchema";
import axios from "../../../config/customAxios";

type Props = {
  accessToken?: string;
};

function ResetPassword({ accessToken }: Props) {
  const [loader, setLoader] = useState<boolean>(false);
  const { toast } = useToast();
  const { setCookieValue: setAccessToken } =
    getCookieHandlers(AUTH_TOKEN_KEY)();

  const navigate = useNavigate();

  const forgotPasswordForm = useForm<UserPasswordResetSchema>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
  });

  const {
    formState: { isDirty, isValid },
  } = forgotPasswordForm;

  const onUpdatePassword = async (userInput: UserPasswordResetSchema) => {
    try {
      setLoader(true);
      const response = await axios.post("/authorize/reset-password/", {
        ...userInput,
        accessToken,
      });
      setLoader(false);
      const { data } = response || {};
      if (
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

  const shouldDisableSubmit = () => {
    return !isDirty && !isValid;
  };

  const getTextFormField = (
    fieldName: keyof UserPasswordResetSchema,
    fieldLabel: string,
    fieldType: HTMLInputTypeAttribute
  ) => {
    return (
      <FormField
        control={forgotPasswordForm.control}
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
      <Form {...forgotPasswordForm}>
        <form
          onSubmit={forgotPasswordForm.handleSubmit(onUpdatePassword)}
          className="min-w-[300px] px-[10px] m-0 box-content overflow-y-auto"
        >
          {getTextFormField("password", "Password", "password")}
          {getTextFormField("confirmPassword", "Confirm Password", "text")}
          <Button
            showLoader={loader}
            disabled={shouldDisableSubmit()}
            style={{ marginBottom: "10px" }}
            className="w-full"
            type="submit"
          >
            Update Password
          </Button>
        </form>
      </Form>
    </Card>
  );
}

export default ResetPassword;
