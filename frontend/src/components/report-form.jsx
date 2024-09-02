import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Define the schema for the report form with file validation
const formSchema = z.object({
  fullName: z.string().min(1, 'Full Name is required.'),
  contactNumber: z.string().min(1, 'Contact Number is required.'),
  description: z.string().min(1, 'Description is required.'),
  email: z.string().email('Invalid email address.').optional(),
  file: z.instanceof(FileList).optional().refine((files) => files.length > 0, 'File is required.')
    .refine((files) => files[0] && files[0].size <= 5 * 1024 * 1024, 'File size should be less than 5MB.')
    .refine((files) => files[0] && ['image/jpeg', 'image/png'].includes(files[0].type), 'Only JPEG and PNG formats are allowed.'),
  accountNumber: z.string().min(1, 'Account Number is required.').optional(),
});

export default function ReportForm() {
  const [preview, setPreview] = useState(null);
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      contactNumber: '',
      description: '',
      email: '',
      file: null,
      accountNumber: '',
    },
  });

  const { handleSubmit, setValue, register, formState: { errors } } = form;

  const onSubmit = (data) => {
    const files = data.file ? Array.from(data.file) : [];
    console.log('Form submitted:', { ...data, file: files });
  };

  const handleFileChange = (e) => {
    const fileList = e.target.files;
    setValue('file', fileList); // Update react-hook-form's file field

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

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name Field */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormMessage>{errors.fullName?.message}</FormMessage>
            </FormItem>
          )}
        />

        {/* Contact Number Field */}
        <FormField
          control={form.control}
          name="contactNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter your contact number" {...field} />
              </FormControl>
              <FormMessage>{errors.contactNumber?.message}</FormMessage>
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Enter a description" {...field} />
              </FormControl>
              <FormMessage>{errors.description?.message}</FormMessage>
            </FormItem>
          )}
        />

        {/* Email Address Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email address" {...field} />
              </FormControl>
              <FormMessage>{errors.email?.message}</FormMessage>
            </FormItem>
          )}
        />

        {/* File Upload Field */}
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File Upload</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  ref={field.ref}
                />
              </FormControl>
              <FormMessage>{errors.file?.message}</FormMessage>
            </FormItem>
          )}
        />

        {/* Preview Image */}
        {preview && (
          <div className="mt-4">
            <img src={preview} alt="Preview" className="w-full h-auto object-cover" />
          </div>
        )}

        {/* Account Number Field */}
        <FormField
          control={form.control}
          name="accountNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter your account number" {...field} />
              </FormControl>
              <FormMessage>{errors.accountNumber?.message}</FormMessage>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full mt-4">Submit</Button>
      </form>
    </Form>
  );
}
