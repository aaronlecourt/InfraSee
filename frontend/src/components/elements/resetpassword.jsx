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
import { useRequestResetPasswordMutation } from "@/slices/users-api-slice";
import axios from "axios";

const resetPasswordSchema = z.object({
  email: z.string().min(1, "Account email is required.").email("Invalid email address."),
});

export default function ResetPassword({ onClose }) {
  const [emailExistenceMessage, setEmailExistenceMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [requestResetPassword] = useRequestResetPasswordMutation();

  const { control, handleSubmit, reset, formState: { errors, isValid } } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange", // This enables real-time validation as the user types
    defaultValues: { email: "" },
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.get(`/api/users/check-email/${data.email}`);
      const emailExists = response.data.exists;
  
      if (!emailExists) {
        toast.error("An account with that email address does not exist.");
        return;
      }
      
      const res = await requestResetPassword(data).unwrap();
      toast.success("OTP link sent to your email!");
      reset();
      onClose();
  
    } catch (error) {
      console.error("Error during OTP link sending:", error);
      toast.error("Failed to send OTP link.");
    }
  };

  const isButtonDisabled = !isValid || loading;

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
              name="email"
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
          <FormMessage>{errors.email?.message}</FormMessage>
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
