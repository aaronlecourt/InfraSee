import React from "react";
import { useForm, Controller } from "react-hook-form";
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
} from "@/components/ui/form";
import {
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

const resetPasswordSchema = z.object({
  accountEmail: z
    .string()
    .min(1, "Account email is required.")
    .email({ message: "Invalid email address." }),
  securityQuestion: z.string().min(1, "Security question is required."),
  answer: z.string().min(1, "Answer is required."),
  emailtoSend: z
    .string()
    .min(1, "Email is required.")
    .email({ message: "Invalid email address." }),
});

function ResetPassword({ onClose }) {
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
  } = form;

  // Watch the value of the accountEmail field
  const accountEmail = watch("accountEmail");

  const onSubmit = async (data) => {
    try {
      // Implement your password reset logic here
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
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="securityQuestion"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel
                  className={`font-bold ${
                    !accountEmail ? "text-gray-400" : ""
                  }`}
                >
                  Security Question
                </FormLabel>
                <FormMessage>{errors.securityQuestion?.message}</FormMessage>
              </div>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter your security question"
                  className="text-sm"
                  {...field}
                  disabled={!accountEmail}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="answer"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <div className="flex items-center justify-between">
                <FormLabel
                  className={`font-bold ${
                    !accountEmail ? "text-gray-400" : ""
                  }`}
                >
                  Answer
                </FormLabel>
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
            </FormItem>
          )}
        />

        <Button
          type="button"
          onClick={handleSubmit(onSubmit)}
          className="w-full flex gap-2 items-center"
          disabled={!accountEmail}
        >
          Reset my Password
          <ArrowRight size={16} />
        </Button>
      </Form>
    </DialogContent>
  );
}

export default ResetPassword;
