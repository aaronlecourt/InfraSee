import React, { useState } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Eye, EyeOff } from 'lucide-react';
import { FormItem, FormMessage } from '@/components/ui/form'; // Adjust path as necessary
import { useResetPasswordMutation } from '@/slices/users-api-slice';

// Validation schema
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
      .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
      .regex(/\d/, { message: "Password must contain at least one number." })
      .regex(/[\W_]/, { message: "Password must contain at least one special character." }),
    confirmPassword: z.string().min(8, "Confirmation password must be at least 8 characters long."),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export function ModSecurity() {
  const methods = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const { control, handleSubmit, reset, formState: { errors } } = methods;
  const [resetPass] = useResetPasswordMutation();
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);

  const onSubmit = async (data) => {
    try {
      await resetPass(data).unwrap();
      toast.success("Password updated successfully!");
      reset();
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password.");
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="sm:w-1/2 w-full">
        <h1 className="text-xl font-bold mb-2">Security</h1>
        <p className="text-gray-500 text-sm mb-4">Change your password.</p>
        <hr className="mb-4" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormItem>
            <label className="font-bold">Current Password</label>
            <div className="relative">
              <Controller
                name="currentPassword"
                control={control}
                render={({ field }) => (
                  <>
                    <Input
                      type={currentPasswordVisible ? "text" : "password"}
                      placeholder="Enter current password"
                      autoComplete="current-password"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setCurrentPasswordVisible(!currentPasswordVisible)}
                      className="absolute inset-y-0 right-3 flex items-center text-sm"
                    >
                      {currentPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </>
                )}
              />
              {errors.currentPassword && <FormMessage>{errors.currentPassword.message}</FormMessage>}
            </div>
          </FormItem>

          <FormItem>
            <label className="font-bold">New Password</label>
            <div className="relative">
              <Controller
                name="newPassword"
                control={control}
                render={({ field }) => (
                  <>
                    <Input
                      type={newPasswordVisible ? "text" : "password"}
                      placeholder="Enter new password"
                      autoComplete="new-password"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setNewPasswordVisible(!newPasswordVisible)}
                      className="absolute inset-y-0 right-3 flex items-center text-sm"
                    >
                      {newPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </>
                )}
              />
              {errors.newPassword && <FormMessage>{errors.newPassword.message}</FormMessage>}
            </div>
          </FormItem>

          <FormItem>
            <label className="font-bold">Confirm Password</label>
            <div className="relative">
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <>
                    <Input
                      type={confirmPasswordVisible ? "text" : "password"}
                      placeholder="Confirm new password"
                      autoComplete="confirm-password"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                      className="absolute inset-y-0 right-3 flex items-center text-sm"
                    >
                      {confirmPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </>
                )}
              />
              {errors.confirmPassword && <FormMessage>{errors.confirmPassword.message}</FormMessage>}
            </div>
          </FormItem>

          <Button type="submit" className="w-full mt-3">Update Password</Button>
        </form>
      </div>
    </FormProvider>
  );
}
