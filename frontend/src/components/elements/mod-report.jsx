import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { toast } from "sonner";

// Define the schema for the form
const FormSchema = z.object({
  image_toggle: z.boolean(),
  email_toggle: z.boolean(),
  accntnum_toggle: z.boolean(),
});

export function ModReport({ user }) {
  // Initialize the form with default values based on user prop
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      image_toggle: user.image_toggled,
      email_toggle: user.email_toggled,
      accntnum_toggle: user.accntnum_toggled,
    },
  });

  // Handle form submission
  const onSubmit = (data) => {
    toast.success("You submitted the following values:");
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-2">Report Form</h1>
      <p className="text-gray-600 text-sm mb-4">
        Modify and toggle the contents of your report form.
      </p>
      <hr className="" />

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 p-4 sm:border-r border-gray-300">
          <p className="text-gray-600 text-sm mb-4">
            Your report form must always have:
          </p>

          <div className="mb-6">
            <h6 className="font-bold text-base">Full Name</h6>
            <p className="text-gray-500 text-xs font-normal">Reporter Identification</p>
          </div>

          <div className="mb-6">
            <h6 className="font-bold text-base">Contact Number</h6>
            <p className="text-gray-500 text-xs font-normal">
              Provides a way to contact and notify reporter
            </p>
          </div>

          <div className="mb-6">
            <h6 className="font-bold text-base">Description</h6>
            <p className="text-gray-500 text-xs font-normal">
              Provide a detailed description of a report
            </p>
          </div>
        </div>

        <div className="flex-1 p-4">
          <p className="text-gray-600 text-sm mb-4">
            You can toggle the following fields:
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-4">
              <Controller
                name="image_toggle"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="image_toggle-switch"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <div>
                <h6 className="font-bold text-base">Image Upload</h6>
                <p className="text-gray-500 text-xs font-normal">
                  Allow reporters to upload an image
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Controller
                name="email_toggle"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="email_toggle-switch"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <div>
                <h6 className="font-bold text-base">Email Address</h6>
                <p className="text-gray-500 text-xs font-normal">
                  Provide another way to contact the reporter
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Controller
                name="accntnum_toggle"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="accntnum_toggle-switch"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <div>
                <h6 className="font-bold text-base">Account Number</h6>
                <p className="text-gray-500 text-xs font-normal">
                  Make sure reports are credible and made by users with an
                  account under your company
                </p>
              </div>
            </div>

            <Button type="submit" className="hidden">Submit</Button> 
            {/* Button is hidden since kada toggle naguupdate na agad may toast success langs */}
          </form>
        </div>
      </div>
    </div>
  );
}
