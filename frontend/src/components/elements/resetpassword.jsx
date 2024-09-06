import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
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

// Define the schema for validation
const resetPasswordSchema = z.object({
  accountEmail: z.string().min(1, "Account email is required.").email("Invalid email address."),
  answer: z.string().min(1, "Answer is required."),
});

export default function ResetPassword({ onClose }) {
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [questionAns, setQuestionAns] = useState(""); // State to store the answer
  const [loading, setLoading] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [emailExistenceMessage, setEmailExistenceMessage] = useState("");
  const [answerMatchError, setAnswerMatchError] = useState("");

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      accountEmail: "",
      answer: "",
    },
  });

  const accountEmail = watch("accountEmail");
  const answer = watch("answer");

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
            setQuestionAns(""); // Clear the answer
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
            setQuestionAns(response.data.answer); // Store the answer for comparison
          } else {
            setSecurityQuestion("This account has not set any security questions.");
            setQuestionAns(""); // Clear the answer
          }
        } catch (error) {
          setSecurityQuestion("This account has not set any security questions.");
          setQuestionAns(""); // Clear the answer
        }
      };

      checkEmailExists();
    } else {
      // Reset states if email is empty
      setEmailExists(false);
      setEmailExistenceMessage("");
      setSecurityQuestion("");
      setQuestionAns(""); // Clear the answer
      setAnswerMatchError("");
    }
  }, [accountEmail]);

  useEffect(() => {
    if (answer && questionAns && answer !== questionAns) {
      setAnswerMatchError("Your answer does not match the one you previously set.");
    } else {
      setAnswerMatchError("");
    }
  }, [answer, questionAns]);

  const onSubmit = async (data) => {
    console.log("Submit Data:", data); // Debugging: Log the form data
    if (!emailExists) {
      toast.error("An account with that email address does not exist.");
      return;
    }

    if (answer !== questionAns) {
      setAnswerMatchError("Your answer does not match the one you previously set.");
      return;
    }

    try {
      console.log("Simulating password reset..."); // Debugging: Indicate start of simulation
      // Simulate success
      toast.success("Reset instructions sent!");
      onClose(); // Close dialog after action
    } catch (error) {
      console.error("Error during password reset:", error); // Debugging: Log errors
      toast.error("Failed to send reset instructions.");
    }
  };

  const isButtonDisabled = !emailExists || !answer || answerMatchError;

  return (
    <DialogContent>
      <DialogTitle>Forgot your Password?</DialogTitle>
      <DialogDescription>
        Provide your account email, then answer your set security question to
        receive a password reset link.
      </DialogDescription>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormItem>
          <FormLabel className="font-bold">Account Email</FormLabel>
          <FormControl>
            <Controller
              name="accountEmail"
              control={control}
              render={({ field }) => (
                <Input
                  type="email"
                  placeholder="Enter your account email"
                  {...field}
                />
              )}
            />
          </FormControl>
          <FormMessage>{errors.accountEmail?.message}</FormMessage>
          {emailExistenceMessage && (
            <FormMessage>{emailExistenceMessage}</FormMessage>
          )}
        </FormItem>

        {emailExists && securityQuestion && (
          <>
            <p className="font-bold">{securityQuestion}</p>
            {securityQuestion !== "This account has not set any security questions." && (
              <FormItem className="flex flex-col">
                <div className="flex items-center justify-between">
                  <FormLabel className="font-bold">Your Answer</FormLabel>
                  <FormMessage>{errors.answer?.message}</FormMessage>
                  {answerMatchError && <FormMessage>{answerMatchError}</FormMessage>}
                </div>
                <FormControl>
                  <Controller
                    name="answer"
                    control={control}
                    render={({ field }) => (
                      <textarea
                        placeholder="Enter your answer"
                        className="flex h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                        {...field}
                        disabled={!accountEmail}
                      />
                    )}
                  />
                </FormControl>
                <div className="flex gap-2 text-muted-foreground items-start">
                  <InfoIcon size={18} />
                  <FormDescription>
                    Please ensure that the answer you provide matches the security question you set up earlier.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          </>
        )}

        <Button
          type="submit"
          className="w-full flex gap-2 items-center"
          disabled={isButtonDisabled}
        >
          Reset my Password
          <ArrowRight size={16} />
        </Button>
      </form>
    </DialogContent>
  );
}
