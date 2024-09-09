import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';

// Schema for OTP verification
const otpSchema = z.object({
  otp: z.string()
    .length(6, "OTP must be 6 digits long.")
    .regex(/^\d+$/, "Invalid OTP format."),
});

export default function OTPForm({ onClose, onOtpVerified }) {
  const { control, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const otpValue = watch("otp");

  const onSubmit = async (data) => {
    console.log("Submitted OTP:", data.otp); // Debugging line

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      toast.success("OTP verified successfully!");
      reset();
      onOtpVerified(); // Notify parent component when OTP is verified
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Failed to verify OTP.");
    }
  };

  // Helper to handle OTP changes
  const handleOtpChange = (value) => {
    setValue('otp', value, { shouldValidate: true });
  };

  return (
    <DialogContent className="flex flex-col items-center justify-center">
      <DialogTitle>Enter OTP</DialogTitle>
      <DialogDescription>
        Please enter the OTP sent to your email.
      </DialogDescription>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col items-center">
        <FormItem>
          <FormLabel className="font-bold">OTP</FormLabel>
          <FormControl>
            <Controller
              name="otp"
              control={control}
              render={({ field }) => (
                <InputOTP
                  maxLength={6}
                  value={otpValue}
                  onChange={(value) => handleOtpChange(value)}
                >
                  <InputOTPGroup>
                    {Array.from({ length: 6 }).map((_, index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        value={otpValue[index] || ''}
                        onChange={(e) => {
                          const newValue = otpValue.slice(0, index) + e.target.value + otpValue.slice(index + 1);
                          handleOtpChange(newValue);
                        }}
                      />
                    ))}
                  </InputOTPGroup>
                  <InputOTPSeparator />
                </InputOTP>
              )}
            />
          </FormControl>
          {errors.otp && <FormMessage>{errors.otp.message}</FormMessage>}
        </FormItem>

        <Button
          type="submit"
          className="w-full mt-3"
        >
          Verify OTP
        </Button>
      </form>
    </DialogContent>
  );
}
