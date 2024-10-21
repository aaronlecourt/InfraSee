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
import { Textarea } from "@/components/ui/textarea";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from 'sonner';
import { DateTimePicker } from "./datetimepicker";

// Base validation schema for report status
const baseSchema = z.object({
  status: z.string().nonempty("Status is required"),
  remarks: z.string().min(1, "Remarks are required").max(150, "Remarks must be at most 150 characters"),
});

// Function to get validation schema including time_resolved based on status
const getSchema = (status) => {
  const dateTimeSchema = status === 'resolved'
    ? z.object({
        time_resolved: z.date().optional().refine((date) => date !== null, {
          message: "Date and time are required when status is resolved.",
        }),
      })
    : z.object({
        time_resolved: z.date().optional(),
      });

  return baseSchema.merge(dateTimeSchema);
};

export function UpdateStatusDialog({ isOpen, onClose, data }) {
  const [statusOptions, setStatusOptions] = useState([]);
  const [currentStatus, setCurrentStatus] = useState(data?.report_status?._id || "");

  const methods = useForm({
    resolver: zodResolver(getSchema(currentStatus)),
    defaultValues: {
      status: currentStatus,
      remarks: "",
      time_resolved: null,
    },
  });

  const { handleSubmit, setValue, control, formState: { errors } } = methods;

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
      setValue("status", data.report_status._id);
      setCurrentStatus(data.report_status._id);
    }
  }, [data, setValue]);

  useEffect(() => {
    methods.reset({
      status: currentStatus,
      remarks: "",
      time_resolved: null,
    });
  }, [currentStatus, methods]);

  const onSubmit = async (formData) => {
    const reportId = data._id;
    try {
      const response = await axios.put(`/api/reports/status/${reportId}`, {
        report_status: formData.status,
        status_remark: formData.remarks,
        status_time: formData.time_resolved ? formData.time_resolved.toISOString() : null,
      });
      toast.success("Report status updated successfully!");
      onClose();
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
            Update the reporter's report status here. An SMS notification is sent to their contact number immediately.
          </DialogDescription>
          {data ? (
            <div className="w-full pt-2">
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                  <label htmlFor="status" className="hidden text-sm font-medium text-gray-700">
                    Update Status
                  </label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setCurrentStatus(value);
                        }} 
                        value={field.value} 
                        className="w-full"
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Status Options</SelectLabel>
                            {statusOptions.map((option) => (
                              <SelectItem key={option._id} value={option._id}>
                                {option.stat_name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  
                  <FormItem>
                    <FormLabel className="font-bold">Remarks</FormLabel>
                    <Controller
                      name="remarks"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          id="remarks"
                          placeholder="Enter remarks (required, max 150 characters)"
                          className="mt-1"
                          rows="3"
                        />
                      )}
                    />
                    {errors.remarks && <FormMessage>{errors.remarks.message}</FormMessage>}
                  </FormItem>

                  {currentStatus === '66d25906baae7f52f54793f5' && (
                    <FormItem>
                      <FormLabel className="font-bold">Date-Time Resolved</FormLabel>
                      <Controller
                        name="time_resolved"
                        control={control}
                        render={({ field }) => (
                          <DateTimePicker
                            value={field.value}
                            onChange={(date) => field.onChange(date)} 
                          />
                        )}
                      />
                      {errors.time_resolved && <FormMessage>{errors.time_resolved.message}</FormMessage>}
                    </FormItem>
                  )}

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
