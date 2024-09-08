import React, { useState } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { useRequestResetPasswordMutation } from "@/slices/users-api-slice";
import axios from "axios";

const resetPasswordSchema = z.object({
  email: z.string().min(1, "Account email is required.").email("Invalid email address."),
});

export default function ResetPasswordForm({ open, onClose }) {
  const methods = useForm({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: { email: "" },
  });

  const [emailExistenceMessage, setEmailExistenceMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [requestResetPassword] = useRequestResetPasswordMutation();

  const { control, handleSubmit, reset, formState: { errors, isValid } } = methods;

  const onOtpSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/users/check-email/${data.email}`);
      const emailExists = response.data.exists;
  
      if (!emailExists) {
        setEmailExistenceMessage("An account with that email address does not exist.");
        return;
      }
      
      const res = await requestResetPassword(data).unwrap();
      toast.success("OTP link sent to your email!");
      reset();
      onClose();
  
    } catch (error) {
      console.error("Error during OTP link sending:", error);
      toast.error("Failed to send OTP link.");
    } finally {
      setLoading(false);
    }
  };

  const isButtonDisabled = !isValid || loading;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Forgot your Password?</DialogTitle>
        <DialogDescription>
          Provide your account email to receive an OTP link for password reset.
        </DialogDescription>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onOtpSubmit)}>
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
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
