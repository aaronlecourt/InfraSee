import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const otpSchema = z.object({
  otp: z.string()
    .length(6, "OTP must be 6 digits long.")
    .regex(REGEXP_ONLY_DIGITS_AND_CHARS, "Invalid OTP format."),
});

export default function OTPForm({ onClose }) {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const onSubmit = async (data) => {
    console.log("Submitted OTP:", data);

    try {
      toast.success("OTP verified successfully!");
      reset();
      onClose();
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Failed to verify OTP.");
    }
  };

  return (
    <DialogContent className="flex flex-col items-center justify-center">
      <DialogTitle>Enter OTP</DialogTitle>
      <DialogDescription>
        Please enter the OTP sent to your email.
      </DialogDescription>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col items-center">
        <FormItem>
          <FormLabel className="font-bold hidden">OTP</FormLabel>
          <FormControl className="flex justify-center">
            <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
              <InputOTPGroup className="flex">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <Controller
                    key={index}
                    name={`otp.${index}`}
                    control={control}
                    render={({ field }) => (
                      <InputOTPSlot
                        index={index}
                        {...field}
                      />
                    )}
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
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
