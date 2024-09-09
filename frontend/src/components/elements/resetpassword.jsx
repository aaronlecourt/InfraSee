import React, { useState } from 'react';
import { useFormContext, useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useRequestResetPasswordMutation } from '@/slices/users-api-slice';
import { useCheckEmailMutation } from '@/slices/users-api-slice';
import axios from 'axios';

const resetPasswordSchema = z.object({
  email: z.string().min(1, "Account email is required.").email("Invalid email address."),
});

export default function ResetPasswordForm({ onClose, onOtpSubmitted }) {
  const methods = useForm({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: { email: "" },
  });

  const [request] = useRequestResetPasswordMutation();
  const [check] = useCheckEmailMutation();
  const [emailExistenceMessage, setEmailExistenceMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, reset, formState: { errors, isValid } } = methods;

  const onOtpSubmit = async (data) => {
    console.log("Submitted Email:", data.email); // Debugging line
    setLoading(true);
    setEmailExistenceMessage(""); // Reset the email existence message

    try {
      const response = await axios.get(`/api/users/check-email/${data.email}`);
      if (!response.data.exists) {
        setEmailExistenceMessage("An account with that email address does not exist.");
        return;
      }

      const res = await request(data).unwrap();
      toast.success("OTP link sent to your email!");
      reset();
      onOtpSubmitted(data); // Notify parent component when OTP is sent
    } catch (error) {
      console.error("Error during OTP link sending:", error);
      toast.error("Failed to send OTP link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent>
      <DialogTitle>Forgot your Password?</DialogTitle>
      <DialogDescription>
        Provide your account email to receive an OTP link for password reset.
      </DialogDescription>
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
          disabled={loading}
        >
          Send OTP Link
        </Button>
      </form>
    </DialogContent>
  );
}
