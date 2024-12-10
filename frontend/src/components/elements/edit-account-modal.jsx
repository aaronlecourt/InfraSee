"use client";

import React, { useState, useEffect } from "react";
import { useUpdateUserMutation } from "@/slices/users-api-slice";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// Validation schema
const formSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().min(1, "Email is required.").email("Invalid email address."),
  infrastructureType: z.string().min(1, "Infrastructure type is required."),
});

// Fetching infrastructure types
const fetchInfrastructureTypes = async () => {
  const response = await axios.get("/api/infrastructure-types");
  return response.data;
};

export function EditAccountModal({ isOpen, onClose, data }) {
  const [infrastructureTypes, setInfrastructureTypes] = useState([]);
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const { userInfo } = useSelector((state) => state.auth);
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      infrastructureType: "",
    },
  });

  const { handleSubmit, control, reset } = form;

  // Reset form when data changes
  useEffect(() => {
    if (data) {
      reset({
        name: data.name || "",
        email: data.email || "",
        infrastructureType: data.infra_type?._id || "",
      });
    }
  }, [data, reset]);

  // Fetch infrastructure types
  const loadInfrastructureTypes = async () => {
    try {
      const response = await fetchInfrastructureTypes();
      setInfrastructureTypes(response);
    } catch (error) {
      toast.error("Failed to load infrastructure types.");
    }
  };

  useEffect(() => {
    loadInfrastructureTypes();
  }, []);

  const onSubmit = async (formData) => {
    const { name, email, infrastructureType } = formData;
    try {
      await updateUser({
        name,
        email,
        infra_type: infrastructureType,
      }).unwrap();
      toast.success("Account updated successfully!");
      onClose();
    } catch (err) {
      toast.error("Failed to update account.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Account Details</DialogTitle>
          <DialogDescription>
            Update the account information below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Field */}
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter name"
                      autoComplete="name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter email"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {userInfo.isModerator && (
              <>
              {/* Infrastructure Type Field */}
            <FormField
              control={control}
              name="infrastructureType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Infrastructure Type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value} // Controlled value
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Select infrastructure type"
                          value={
                            infrastructureTypes.find(
                              (type) => type._id === field.value
                            )?.infra_name || "Select"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {infrastructureTypes.map((type) => (
                          <SelectItem key={type._id} value={type._id}>
                            {type.infra_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              </>
            )}

            <Button type="submit" className="w-full mt-4" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Account"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
