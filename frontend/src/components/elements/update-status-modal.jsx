"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';

// Define your Zod schema
const schema = z.object({
  status: z.string().nonempty("Status is required"),
});

export function UpdateStatusDialog({ isOpen, onClose, data }) {
  const [statusOptions, setStatusOptions] = useState([]);
  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      status: data?.report_status?._id || "", // Use _id for default value
    },
  });

  const { handleSubmit, setValue, control } = methods;

  useEffect(() => {
    if (isOpen) {
      const fetchStatusOptions = async () => {
        try {
          const response = await axios.get("/api/status/");
          setStatusOptions(response.data);
        } catch (error) {
          console.error("Failed to fetch status options", error);
          toast.error("Failed to fetch status options.");
        }
      };
      fetchStatusOptions();
    }
  }, [isOpen]);

  useEffect(() => {
    if (data && data.report_status) {
      setValue("status", data.report_status._id); // Set the _id as the default value
    }
  }, [data, setValue]);

  const onSubmit = async (formData) => {
    console.log("Updated status ID:", formData.status);
    const reportId = data._id; // Assuming data contains the report ID
    try {
      const response = await axios.put(`/api/reports/status/${reportId}`, { report_status: formData.status });
      console.log(response.data.message);
      toast.success("Report status updated successfully!");
      onClose(); // Close dialog after success
    } catch (error) {
      console.error("Error updating report status:", error);
      toast.error("Error updating report status.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Report Status</DialogTitle>
          <DialogDescription>
            Update the reporter's report status here. An SMS notification is
            sent to their contact number immediately.
          </DialogDescription>
          {data ? (
            <div className="w-full pt-2">
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                  <label
                    htmlFor="status"
                    className="hidden text-sm font-medium text-gray-700"
                  >
                    Update Status
                  </label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange} // Handle value change
                        value={field.value} // Set current value
                        className="w-full"
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Status Options</SelectLabel>
                            {statusOptions.map((option) => (
                              <SelectItem
                                key={option._id}
                                value={option._id} // Use _id as the value
                              >
                                {option.stat_name} {/* Display stat_name */}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <Button type="submit" className="mt-4 w-full">
                    Update Status
                  </Button>
                </form>
              </FormProvider>
            </div>
          ) : (
            <p>No data available.</p>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
