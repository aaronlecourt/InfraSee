import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateSubModeratorMutation } from "@/slices/users-api-slice";

const schema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Invalid email address."),
  password: z
    .string()
    .min(1, "Password is required.")
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/\d/, "Password must contain at least one number.")
    .regex(/[\W_]/, "Password must contain at least one special character."),
  infrastructureType: z.string().min(1, "Infrastructure type is required."),
  assignedModeratorId: z.string().min(1, "Assigned Moderator is required."),
});

export function SubModRegisterForm({ onClose }) {
  const [createSubModerator] = useCreateSubModeratorMutation();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      infrastructureType: "",
      assignedModeratorId: "",
    },
  });
  const { userInfo } = useSelector((state) => state.auth);
  const { handleSubmit, control, setValue, setError } = form;
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [infrastructureTypes, setInfrastructureTypes] = useState([]);

  useEffect(() => {
    const fetchInfrastructureTypes = async () => {
      try {
        const response = await axios.get("/api/infrastructure-types");
        if (userInfo && userInfo.infra_type) {
          const allowedInfraType = userInfo.infra_type._id;
          const filteredTypes = response.data.filter(
            (type) => type._id === allowedInfraType
          );
          setInfrastructureTypes(filteredTypes);
          // Set the infrastructure type to the logged-in user's infra_type
          setValue("infrastructureType", allowedInfraType);
        }
      } catch (error) {
        toast.error("Failed to load infrastructure types.");
      }
    };

    if (userInfo && userInfo.isModerator && userInfo.can_create) {
      console.log("User has permission to add moderator:", userInfo);
      fetchInfrastructureTypes();
      setValue("assignedModeratorId", userInfo._id);
    } else {
      console.log("User does not have permission:", userInfo);
      toast.error("You don't have permission to add a moderator.");
    }
  }, [userInfo, setValue]);

  const checkEmailExists = async (email) => {
    try {
      const response = await axios.get(`/api/users/check-email/${email}`);
      return response.data.exists;
    } catch (error) {
      toast.error("Error checking email availability.");
      return false;
    }
  };

  const onSubmit = async (data) => {
    const { name, email, password, infrastructureType } = data;

    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      setError("email", {
        type: "manual",
        message: "Email is already in use.",
      });
      return;
    }

    try {
      await createSubModerator({
        name,
        email,
        password,
        infra_type: infrastructureType,
      });

      toast.success("Moderator account added successfully!");
      onClose();
      form.reset();
    } catch (err) {
      console.log(err);
      const errorMessage =
        err.response?.data?.message || "An error occurred during registration.";
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Name</FormLabel>
                  <FormMessage className="text-right" />
                </div>
                <FormControl>
                  <Input
                    placeholder="Sample Sub Moderator"
                    autoComplete="username"
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
                  <FormLabel>Email</FormLabel>
                  <FormMessage className="text-right" />
                </div>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="user.sub.infrasee@gmail.com"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Manually create a gmail account for this account.
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Password</FormLabel>
                  <FormMessage className="text-right" />
                </div>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={passwordVisible ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className="absolute inset-y-0 right-3 flex items-center text-sm"
                    >
                      {passwordVisible ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormDescription className="text-xs">
                  This account must have the same password as its GMail
                  password.
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="infrastructureType"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Infrastructure Type</FormLabel>
                  <FormMessage className="text-right" />
                </div>
                <FormControl>
                  {/* Display read-only value instead of select */}
                  <Input
                    value={
                      infrastructureTypes.find(
                        (type) => type._id === field.value
                      )?.infra_name || "Loading..."
                    }
                    readOnly
                    className="bg-gray-100"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="assignedModeratorId"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Assigned Moderator</FormLabel>
                  <FormMessage className="text-right" />
                </div>
                <FormControl>
                  {/* Display read-only value instead of select */}
                  <Input
                    value={userInfo.name}
                    readOnly
                    className="bg-gray-100"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full mt-4">
            Register
          </Button>
        </form>
      </Form>
    </div>
  );
}
