import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Eye, EyeOff } from "lucide-react";
import { useResetPasswordMutation } from "@/slices/users-api-slice";

const newPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, "New password is required.")
      .min(8, "Password must be at least 8 characters long.")
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
      })
      .regex(/\d/, { message: "Password must contain at least one number." })
      .regex(/[\W_]/, {
        message: "Password must contain at least one special character.",
      }),
    confirmPassword: z
      .string()
      .min(1, "Confirm password is required.")
      .min(8, "Confirmation password must be at least 8 characters long."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export default function UpdatePasswordForm({
  onClose,
  onPasswordUpdated,
  email,
  otp,
}) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const [resetPass] = useResetPasswordMutation();
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const onSubmit = async (data) => {
    console.log("Submitted Data:", data);

    try {
      const res = await resetPass({ ...data, email, otp }).unwrap();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Password updated successfully!");
      reset();
      onClose();
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password.");
    }
  };

  return (
    <DialogContent className="flex flex-col items-start p-6">
      <DialogTitle className="text-xl font-bold">Set New Password</DialogTitle>
      <DialogDescription className="text-sm text-gray-500">
        Please enter and confirm your new password.
      </DialogDescription>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
        <FormItem>
          <FormLabel className="font-bold">New Password</FormLabel>
          <FormControl>
            <div className="relative">
              <Controller
                name="newPassword"
                control={control}
                render={({ field }) => (
                  <Input
                    type={newPasswordVisible ? "text" : "password"}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    {...field}
                  />
                )}
              />
              <button
                type="button"
                onClick={() => setNewPasswordVisible(!newPasswordVisible)}
                className="absolute inset-y-0 right-3 flex items-center text-sm"
              >
                {newPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </FormControl>
          {errors.newPassword && (
            <FormMessage>{errors.newPassword.message}</FormMessage>
          )}
        </FormItem>

        <FormItem>
          <FormLabel className="font-bold">Confirm Password</FormLabel>
          <FormControl>
            <div className="relative">
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <Input
                    type={confirmPasswordVisible ? "text" : "password"}
                    placeholder="Confirm new password"
                    autoComplete="confirm-password"
                    {...field}
                  />
                )}
              />
              <button
                type="button"
                onClick={() =>
                  setConfirmPasswordVisible(!confirmPasswordVisible)
                }
                className="absolute inset-y-0 right-3 flex items-center text-sm"
              >
                {confirmPasswordVisible ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </FormControl>
          {errors.confirmPassword && (
            <FormMessage>{errors.confirmPassword.message}</FormMessage>
          )}
        </FormItem>

        <Button type="submit" className="w-full mt-3">
          Update Password
        </Button>
      </form>
    </DialogContent>
  );
}
