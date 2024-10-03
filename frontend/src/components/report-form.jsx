import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// Define the schema for the report form with file validation
const formSchema = z.object({
  fullName: z.string().min(1, "Full Name is required."),
  contactNumber: z.string().min(1, "Contact Number is required."),
  description: z.string().min(1, "Description is required."),
  email: z.string().email("Invalid email address.").optional(),
  file: z
    .any()
    .refine((files) => files?.length == 1, "Image is required.")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg .png files are accepted."
    ),
  accountNumber: z.string().min(1, "Account Number is required.").optional(),
});

export default function ReportForm({ selectedAccount }) {
  const [preview, setPreview] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      contactNumber: "",
      description: "",
      email: "",
      file: null,
      accountNumber: "",
    },
  });

  const {
    handleSubmit,
    setValue,
    register,
    formState: { errors },
  } = form;

  const onSubmit = (data) => {
    const files = data.file ? Array.from(data.file) : [];
    console.log("Form submitted:", { ...data, file: files });
  };

  const handleFileChange = (e) => {
    const fileList = e.target.files;
    setValue("file", fileList); // Update react-hook-form's file field

    if (fileList.length > 0) {
      const file = fileList[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  // Check which fields should be visible based on selectedAccount
  const showField = (field) => selectedAccount[field + '_toggled'];

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* File Upload Field */}
        {showField("image") && (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel className={errors.file?.message ? 'text-red-500' : ''}>
                Image Upload
              </FormLabel>
              <FormMessage>{errors.file?.message}</FormMessage>
            </div>
            <div className="relative flex items-center justify-center min-h-[80px] border border-dashed border-gray-300 rounded-md">
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem className="absolute inset-0 flex flex-col items-center justify-center">
                    <FormControl>
                      <Input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        ref={field.ref}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="z-10 px-4 rounded"
                      onClick={() =>
                        document.querySelector('input[type="file"]').click()
                      }
                    >
                      {preview ? "Change File" : "Choose File"}
                    </Button>
                  </FormItem>
                )}
              />
              {/* Preview Image */}
              {preview && (
                <div
                  className="absolute inset-0 bg-cover bg-center rounded-md"
                  style={{ backgroundImage: `url(${preview})` }}
                />
              )}
            </div>
          </FormItem>
        )}

        {/* Full Name Field */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Full Name</FormLabel>
                <FormMessage>{errors.fullName?.message}</FormMessage>
              </div>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Contact Number Field */}
        <FormField
          control={form.control}
          name="contactNumber"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Contact Number</FormLabel>
                <FormMessage>{errors.contactNumber?.message}</FormMessage>
              </div>
              <FormControl>
                <Input placeholder="Enter your contact number" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Description Field (Text Area) */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <div className="flex items-center justify-between">
                <FormLabel>Description</FormLabel>
                <FormMessage>{errors.description?.message}</FormMessage>
              </div>
              <FormControl>
                <textarea
                  placeholder="Enter a description"
                  className="flex h-24 w-full rounded-md border placeholder-muted-foreground border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Email Address Field */}
        {showField("email") && (
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Email Address</FormLabel>
                  <FormMessage>{errors.email?.message}</FormMessage>
                </div>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        {/* Account Number Field */}
        {showField("accntnum") && (
          <FormField
            control={form.control}
            name="accountNumber"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Account Number</FormLabel>
                  <FormMessage>{errors.accountNumber?.message}</FormMessage>
                </div>
                <FormControl>
                  <>
                  <Input placeholder="Enter your account number" {...field} />
                  <FormDescription className="text-xs">This form requires your account number. Ensure all details above match your account information.</FormDescription>
                  </>
                </FormControl>
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="w-full mt-4">
          Submit
        </Button>
      </form>
    </Form>
  );
}
