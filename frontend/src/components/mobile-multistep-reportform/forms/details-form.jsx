import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const DetailsForm = ({ onClose }) => {
  const { control, handleSubmit, formState: { errors } } = useFormContext();

  return (
    <form onSubmit={handleSubmit(onClose)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* File Upload Field */}
      <div className="flex flex-col">
        <FormItem>
          <FormLabel className="font-bold">Upload File</FormLabel>
          <FormControl>
            <Controller
              name="file"
              control={control}
              render={({ field }) => (
                <input
                  type="file"
                  {...field}
                  onChange={(e) => field.onChange(e.target.files[0])}
                />
              )}
            />
          </FormControl>
        </FormItem>
      </div>

      {/* Other Fields */}
      <div className="flex flex-col">
        {/* Full Name Field */}
        <FormItem>
          <FormLabel className="font-bold">Full Name</FormLabel>
          <FormControl>
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  placeholder="Enter your name"
                  {...field}
                />
              )}
            />
          </FormControl>
          {errors.fullName && (
            <FormMessage>{errors.fullName.message}</FormMessage>
          )}
        </FormItem>

        {/* Contact Number Field */}
        <FormItem>
          <FormLabel className="font-bold">Contact Number</FormLabel>
          <FormControl>
            <Controller
              name="contactNumber"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  placeholder="Enter contact number"
                  {...field}
                />
              )}
            />
          </FormControl>
          {errors.contactNumber && (
            <FormMessage>{errors.contactNumber.message}</FormMessage>
          )}
        </FormItem>

        {/* Description Field */}
        <FormItem>
          <FormLabel className="font-bold">Description</FormLabel>
          <FormControl>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  placeholder="Enter description"
                  {...field}
                />
              )}
            />
          </FormControl>
          {errors.description && (
            <FormMessage>{errors.description.message}</FormMessage>
          )}
        </FormItem>
      </div>
    </form>
  );
};

export default DetailsForm;
