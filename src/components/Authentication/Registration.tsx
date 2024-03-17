"use client";
import type { HTMLInputTypeAttribute } from "react";
import { Button } from "@/components/ui/button";
import { TypographyH3 } from "@/components/ui/typography";
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
import { useForm } from "react-hook-form";
import type { UserRegistrationSchema } from "./RegistrationSchema";
import userRegistrationSchema from "./RegistrationSchema";
import classes from "./registration.module.scss";

function Registration() {
  const registrationForm = useForm<UserRegistrationSchema>({
    resolver: zodResolver(userRegistrationSchema),
    defaultValues: {
      userName: "",
      gender: "male",
    },
    mode: "onBlur",
  });

  const {
    formState: { isDirty, isValid },
  } = registrationForm;

  const onSubmitRegistration = (userInputs: UserRegistrationSchema) => {
    console.log({ userInputs });
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

  return (
    <div className="w-full h-full bg-white flex flex-col items-center justify-center">
      <TypographyH3 text="Student Registration" />
      <Form {...registrationForm}>
        <form
          onSubmit={registrationForm.handleSubmit(onSubmitRegistration)}
          className={`min-w-[300px] m-[10px] box-content p-[20px] overflow-y-auto ${classes.formBackground}`}
        >
          {getTextFormField("userName", "User Name", "text")}
          {getTextFormField("contactNumber", "Contact Number", "number")}
          {getTextFormField("emailId", "Email Id", "text")}
          {getTextFormField("city", "City", "text")}
          {getGenderField()}
          {getCoursesField("selectedCourses.english", "English")}
          {getCoursesField("selectedCourses.marathi", "Marathi")}
          {getTextFormField("password", "Password", "password")}
          <Button
            disabled={shouldDisableSubmit()}
            style={{ marginTop: "10px", marginBottom: "10px" }}
            className="w-full"
            type="submit"
          >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default Registration;
