import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import axios from "axios";
import OTPForm from "./otp-form";

// Define the schema for validation
const resetPasswordSchema = z.object({
  accountEmail: z.string().min(1, "Account email is required.").email("Invalid email address."),
});

export default function ResetPassword({ onClose }) {
  const [emailExists, setEmailExists] = useState(false);
  const [emailExistenceMessage, setEmailExistenceMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Extract `reset` from useForm
  const { control, handleSubmit, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { accountEmail: "" },
  });

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
        } catch (error) {
          toast.error("Failed to check if email exists.");
        } finally {
          setLoading(false);
        }
      };

      checkEmailExists();
    } else {
      setEmailExists(false);
      setEmailExistenceMessage("");
    }
  }, [accountEmail]);

  const onSubmit = async (data) => {
    console.log("Submit Data:", data); // Debugging: Log the form data
    if (!emailExists) {
      toast.error("An account with that email address does not exist.");
      return;
    }

    try {
      // Simulate success
      toast.success("OTP link sent to your email!");
      reset(); // Reset the form fields
      onClose(); // Close the dialog or take another action
    } catch (error) {
      console.error("Error during OTP link sending:", error); // Debugging: Log errors
      toast.error("Failed to send OTP link.");
    }
  };

  const isButtonDisabled = !emailExists || loading;

  return (
    <DialogContent>
      <DialogTitle>Forgot your Password?</DialogTitle>
      <DialogDescription>
        Provide your account email to receive an OTP link for password reset.
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

        <Button
          type="submit"
          className="w-full flex gap-2 items-center mt-3"
          disabled={isButtonDisabled}
        >
          Send OTP Link
          <ArrowRight size={16} />
        </Button>
      </form>
    </DialogContent>
  );
}
