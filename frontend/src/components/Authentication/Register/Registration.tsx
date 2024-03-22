"use client";
import { useState, useRef } from "react";
import type { HTMLInputTypeAttribute } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "../../../config/customAxios";
import type { UserRegistrationSchema } from "./RegistrationSchema";
import userRegistrationSchema from "./RegistrationSchema";
import classes from "./registration.module.scss";

function Registration() {
  const [loader, setLoader] = useState<boolean>(false);
  const isUserCreated = useRef<boolean>(false);

  const navigate = useNavigate();

  const registrationForm = useForm<UserRegistrationSchema>({
    resolver: zodResolver(userRegistrationSchema),
    defaultValues: {
      userName: "Test",
      contactNumber: 1234567890,
      emailId: "smarttypehub@gmail.com",
      city: "test",
      password: "1234567",
      gender: "male",
      selectedCourses: {
        english: "3",
        marathi: "6",
      },
    },
    mode: "onBlur",
  });

  const {
    formState: { isDirty, isValid },
  } = registrationForm;

  const onSubmitUserData = async (userInput: UserRegistrationSchema) => {
    try {
      setLoader(true);
      const response = await axios.post("/authorize/register/", userInput);
      setLoader(false);
      console.log({ userData: response.data });
      if (response.data.user) {
        isUserCreated.current = true;
      }
    } catch (error) {
      setLoader(false);
      console.error(error);
    }
  };

  const shouldDisableSubmit = () => {
    return !isDirty || !isValid || isUserCreated.current;
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

  const getGenderField = () => {
    return (
      <FormField
        control={registrationForm.control}
        name="gender"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex gap-[20px]"
              >
                <FormItem className="flex items-center">
                  <FormControl>
                    <RadioGroupItem value="male" />
                  </FormControl>
                  <FormLabel className={`font-normal ${classes.genderRadio}`}>
                    Male
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center">
                  <FormControl>
                    <RadioGroupItem value="female" />
                  </FormControl>
                  <FormLabel className={`font-normal ${classes.genderRadio}`}>
                    Female
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center">
                  <FormControl>
                    <RadioGroupItem value="others" />
                  </FormControl>
                  <FormLabel className={`font-normal ${classes.genderRadio}`}>
                    Others
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage className="space-y-[5px]" />
          </FormItem>
        )}
      />
    );
  };

  const getCoursesField = (fieldName: any, courseName: string) => {
    return (
      <FormField
        control={registrationForm.control}
        name={fieldName}
        render={({ field }) => (
          <FormItem className="w-full">
            <Select onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger className="focus:ring-offset-0">
                  <SelectValue
                    placeholder={`Select ${courseName} Course Duration`}
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="3">{`3 Months ${courseName}`}</SelectItem>
                <SelectItem value="6">{`6 Months ${courseName}`}</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage className="space-y-[5px]" />
          </FormItem>
        )}
      />
    );
  };

  const redirectToLogin = () => {
    navigate("/login");
  };

  return (
    <Card className="w-full h-full bg-white flex flex-col items-center justify-center">
      <CardHeader className="space-y-0 p-[10px]">
        <CardTitle>Student Registration</CardTitle>
      </CardHeader>
      <Form {...registrationForm}>
        <form
          onSubmit={registrationForm.handleSubmit(onSubmitUserData)}
          className={`min-w-[300px] px-[10px] m-0 box-content overflow-y-auto ${classes.formBackground}`}
        >
          {getTextFormField("userName", "User Name", "text")}
          {getTextFormField("contactNumber", "Contact Number", "number")}
          {getTextFormField("emailId", "Email Id", "text")}
          {getTextFormField("city", "City", "text")}
          {getGenderField()}
          {getCoursesField("selectedCourses.english", "English")}
          {getCoursesField("selectedCourses.marathi", "Marathi")}
          {getTextFormField("password", "Password", "password")}
          {isUserCreated.current ? (
            <div>Please Confirm Email Address</div>
          ) : null}
          <Button
            showLoader={loader}
            disabled={shouldDisableSubmit()}
            style={{ marginTop: "10px", marginBottom: "10px" }}
            className="w-full"
            type="submit"
          >
            Submit
          </Button>
        </form>
      </Form>
      <CardFooter>
        If already have an account?
        <Button
          onClick={redirectToLogin}
          className="pl-[5px] relative bottom-[1px]"
          variant="link"
        >
          Sign In
        </Button>
      </CardFooter>
    </Card>
  );
}

export default Registration;
