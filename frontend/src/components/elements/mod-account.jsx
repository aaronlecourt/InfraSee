import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "../ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Validation schema
const formSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Invalid email address."),
  // .regex(
  //   /@m\.infrasee\.com$/,
  //   "Email must be from the domain @m.infrasee.com"
  // ),
  infrastructureType: z.string().min(1, "Infrastructure type is required."),
});

export function ModAccount({ user }) {
  const [infrastructureTypes, setInfrastructureTypes] = useState([]);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      infrastructureType: user?.infra_type || "",
    },
  });

  const { handleSubmit, control, setValue, reset, watch } = form;
  const selectedInfrastructureType = watch("infrastructureType");

  // Fetch infrastructure types from the API
  useEffect(() => {
    const fetchInfrastructureTypes = async () => {
      try {
        const response = await axios.get("/api/infrastructure-types");
        setInfrastructureTypes(response.data);
      } catch (error) {
        toast.error("Failed to load infrastructure types.");
      }
    };

    fetchInfrastructureTypes();
  }, []);

  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        infrastructureType: user.infra_type || "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    const { name, email, infrastructureType } = data;

    try {
      // Replace with actual update API call
      await axios.put("/api/update-account", {
        name,
        email,
        infra_type: infrastructureType,
      });

      toast.success("Account updated successfully!");
    } catch (err) {
      console.log(err);
      const errorMessage =
        err.response?.data?.message || "An error occurred during the update.";
      toast.error(errorMessage);
    }
  };

  // Find the selected infrastructure name
  const getInfraName = (value) => {
    return (
      infrastructureTypes.find((type) => type._id === value)?.infra_name
    );
  };

  return (
    <div className="sm:w-1/2 w-full">
      <h1 className="text-xl font-bold mb-2">Account</h1>
      <p className="text-gray-500 text-sm mb-4">
        Update your account settings here.
      </p>
      <hr className="mb-4" />

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel className="font-bold">Name</FormLabel>
                  <FormMessage className="text-right" />
                </div>
                <FormControl>
                  <Input
                    placeholder="Enter a new moderator name"
                    autoComplete="name"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel className="font-bold">Email</FormLabel>
                  <FormMessage className="text-right" />
                </div>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter a new email address"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="infrastructureType"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel className="font-bold">Infrastructure Type</FormLabel>
                  <FormMessage className="text-right" />
                </div>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value) =>
                      setValue("infrastructureType", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          field.value
                            ? getInfraName(field.value)
                            : getInfraName(user?.infra_type)
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {infrastructureTypes.length === 0 ? (
                        <SelectItem value="notypes" disabled>
                          No types available
                        </SelectItem>
                      ) : (
                        <>
                          {infrastructureTypes.map((type) => (
                            <SelectItem key={type._id} value={type._id}>
                              {type.infra_name}
                            </SelectItem>
                          ))}
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full mt-4">
            Update Account
          </Button>
        </form>
      </Form>
    </div>
  );
}
