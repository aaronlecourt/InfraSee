import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
  FormDescription
} from "@/components/ui/form";
import {
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ArrowRight, InfoIcon } from "lucide-react";
import axios from "axios";

const resetPasswordSchema = z.object({
  accountEmail: z
    .string()
    .min(1, "Account email is required.")
    .email({ message: "Invalid email address." }),
  securityQuestion: z.string().optional(), // Optional field
  answer: z.string().min(1, "Answer is required.").optional(), // Optional field
  emailtoSend: z
    .string()
    .min(1, "Email is required.")
    .email({ message: "Invalid email address." }),
});

function ResetPassword({ onClose }) {
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [loading, setLoading] = useState(false); // Adjusted initial state
  const [emailExists, setEmailExists] = useState(false);
  const [emailExistenceMessage, setEmailExistenceMessage] = useState("");

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      accountEmail: "",
      securityQuestion: "",
      answer: "",
      emailtoSend: "",
    },
  });

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
    setValue,
  } = form;

  const accountEmail = watch("accountEmail");

  useEffect(() => {
    if (accountEmail) {
      setLoading(true);
      const checkEmailExists = async () => {
        try {
          const response = await axios.get(`/api/users/check-email/${accountEmail}`);
          const exists = response.data.exists;
          setEmailExists(exists);
          setEmailExistenceMessage(
            exists ? "" : "An account with that email address does not exist."
          );

          if (exists) {
            // Fetch security question only if email exists
            fetchSecurityQuestion();
          } else {
            setSecurityQuestion("");
          }
        } catch (error) {
          toast.error("Failed to check if email exists.");
        } finally {
          setLoading(false);
        }
      };

      const fetchSecurityQuestion = async () => {
        try {
          const response = await axios.get(`/api/users/security-question/${accountEmail}`);
          if (response.data.question) {
            setSecurityQuestion(response.data.question);
          } else {
            setSecurityQuestion("This account has not set any security questions.");
          }
        } catch (error) {
          setSecurityQuestion("This account has not set any security questions.");
        }
      };

      checkEmailExists();
    } else {
      // Reset states if email is empty
      setEmailExists(false);
      setEmailExistenceMessage("");
      setSecurityQuestion("");
    }
  }, [accountEmail]);

  const onSubmit = async (data) => {
    if (!emailExists) {
      toast.error("An account with that email address does not exist.");
      return;
    }

    try {
      // Implement password reset logic here
      toast.success("Reset instructions sent!");
      onClose(); // Close dialog after action
    } catch (error) {
      toast.error("Failed to send reset instructions.");
    }
  };

  return (
    <DialogContent>
      <DialogTitle>Forgot your Password?</DialogTitle>
      <DialogDescription>
        Provide your account email, then answer your set security question to
        receive a password reset link.
      </DialogDescription>

      <Form {...form}>
        <FormField
          control={control}
          name="accountEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Account Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your account email"
                  {...field}
                />
              </FormControl>
              <FormMessage>{errors.accountEmail?.message}</FormMessage>
              {emailExistenceMessage && (
                <FormMessage>{emailExistenceMessage}</FormMessage>
              )}
            </FormItem>
          )}
        />
        {emailExists && securityQuestion && (
          <>
            <FormField
              control={control}
              name="securityQuestion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Security Question</FormLabel>
                  <FormControl>
                    <Input type="text" value={securityQuestion} disabled />
                  </FormControl>
                  <FormMessage>{errors.securityQuestion?.message}</FormMessage>
                </FormItem>
              )}
            />
            {securityQuestion !== "This account has not set any security questions." && (
              <FormField
                control={control}
                name="answer"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <div className="flex items-center justify-between">
                      <FormLabel className="font-bold">Your Answer</FormLabel>
                      <FormMessage>{errors.answer?.message}</FormMessage>
                    </div>
                    <FormControl>
                      <textarea
                        placeholder="Enter your answer"
                        className="flex h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                        {...field}
                        disabled={!accountEmail}
                      />
                    </FormControl>
                    <div className="flex gap-2 text-muted-foreground items-start">
                    <InfoIcon size={18}/>
                    <FormDescription>Please ensure that the answer you provide matches the security question you set up earlier.</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            )}
          </>
        )}
        <Button
          type="button"
          onClick={handleSubmit(onSubmit)}
          className="w-full flex gap-2 items-center"
          disabled={!emailExists || (securityQuestion === "This account has not set any security questions." && !watch("answer"))}
        >
          Reset my Password
          <ArrowRight size={16} />
        </Button>
      </Form>
    </DialogContent>
  );
}

export default ResetPassword;
