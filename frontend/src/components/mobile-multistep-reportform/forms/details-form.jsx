import React, { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useDropzone } from 'react-dropzone';
import { CloudUpload } from 'lucide-react'; // Import the icon

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

const DetailsForm = ({ onClose }) => {
  const { control, handleSubmit, formState: { errors }, setValue, trigger } = useFormContext();
  const [imagePreview, setImagePreview] = useState(null); // State for image preview

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];

    // Check file type and size
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        console.error("File size exceeds the limit of 2 MB.");
        return;
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        console.error("Only JPG and PNG files are allowed.");
        return;
      }

      // Set image preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setValue("file", file); // Set the file directly in the form state

      // Trigger validation to clear the error message
      await trigger("file"); // Manually trigger validation for the file field

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "Infrasee");

      try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/dqiqcbog4/image/upload`, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (data.secure_url) {
          // Optional: Handle the uploaded file URL separately if needed
        } else {
          throw new Error("Upload failed");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [] }, // Accept only JPG and PNG
  });

  return (
    <form onSubmit={handleSubmit(onClose)} className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
      {/* File Upload Field */}
      <div className="flex flex-col h-full">
        <FormItem className="flex-grow">
          <FormLabel className="font-bold hidden">Upload File</FormLabel>
          <FormControl>
            <div {...getRootProps({ className: 'dropzone border-dashed border-2 border-gray-300 p-4 text-center relative rounded-md h-full flex flex-col justify-center items-center' })}>
              <input {...getInputProps()} />
              <CloudUpload size={50} className="text-muted-foreground/50 mb-2" /> {/* Icon in the middle */}
              <p className="text-muted-foreground text-xs font-normal">Drag & drop some files here, or click to select files (max 2 MB)</p>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              {errors.file && <FormMessage>{errors.file.message}</FormMessage>}
            </div>
          </FormControl>
        </FormItem>
      </div>

      {/* Other Fields */}
      <div className="flex flex-col h-full">
        {/* Full Name Field */}
        <FormItem className="flex-grow">
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
          {errors.fullName && <FormMessage>{errors.fullName.message}</FormMessage>}
        </FormItem>

        {/* Contact Number Field */}
        <FormItem className="flex-grow">
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
          {errors.contactNumber && <FormMessage>{errors.contactNumber.message}</FormMessage>}
        </FormItem>

        {/* Description Field */}
        <FormItem className="flex-grow">
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
          {errors.description && <FormMessage>{errors.description.message}</FormMessage>}
        </FormItem>
      </div>
    </form>
  );
};

export default DetailsForm;
