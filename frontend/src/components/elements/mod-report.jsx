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
  console.log(user.image_toggled);
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
      <h1 className="text-xl font-bold mb-2">Report Form</h1>
      <p className="text-gray-500 text-sm mb-4">
        Modify and toggle the contents of your report form.
      </p>
      <hr />
      <div className="flex-row sm:flex gap-x-4">
        <div className="p-4 sm:border-r">
          <p className="text-gray-500 text-sm mb-4">
            Your report form must always have:
          </p>

          <h6 className="font-bold text-md">Full Name</h6>
          <p className="text-gray-500 text-sm mb-4">Reporter Identification</p>

          <h6 className="font-bold text-md">Contact Number</h6>
          <p className="text-gray-500 text-sm mb-4">
            Provides a way to contact and notify reporter
          </p>

          <h6 className="font-bold text-md">Description</h6>
          <p className="text-gray-500 text-sm mb-4">
            Provide a detailed description of a report
          </p>
        </div>
        <div className="py-4">
          <p className="text-gray-500 text-sm mb-4">
            You can toggle the following fields:
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-y-4"
          >
            <div className="flex gap-4 items-center">
              <Controller
                name="image_toggle"
                control={control}
                render={({ field }) => (
                  <div>
                    <Switch
                      id="image_toggle-switch"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                )}
              />
              <div>
                <h6 className="font-bold text-md">Image Upload</h6>
                <p className="text-gray-500 text-sm">
                  Allow reporters to upload an image
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <Controller
                name="email_toggle"
                control={control}
                render={({ field }) => (
                  <div>
                    <Switch
                      id="email_toggle-switch"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                )}
              />
              <div>
                <h6 className="font-bold text-md">Email Address</h6>
                <p className="text-gray-500 text-sm">
                  Provide another way to contact the reporter
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <Controller
                name="accntnum_toggle"
                control={control}
                render={({ field }) => (
                  <div>
                    <Switch
                      id="accntnum_toggle-switch"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                )}
              />
              <div>
                <h6 className="font-bold text-md">Account Number</h6>
                <p className="text-gray-500 text-sm">
                  Make sure reports are credible and made by users with an
                  account under your company
                </p>
              </div>
            </div>

            <Button type="submit" className="hidden">Submit</Button> 
            {/* Button is hidden since dapat kada toggle naguupdate na agad may toast success langs */}
          </form>
        </div>
      </div>
    </div>
  );
}
