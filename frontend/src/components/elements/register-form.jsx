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
import { useRegisterMutation } from "@/slices/users-api-slice";
import { useCreateModeratorMutation } from "@/slices/users-api-slice";

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
});

export function RegisterForm({ onClose }) {
  const [registerUser] = useRegisterMutation();
  const [createModerator] = useCreateModeratorMutation();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      infrastructureType: "",
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

        if (userInfo && userInfo.isAdmin) {
          // If the user is an admin, use all infrastructure types and set a default value
          setInfrastructureTypes(response.data);
          if (response.data.length > 0) {
            setValue("infrastructureType", response.data[0]._id); // Set default value to the first item
          }
        } else if (userInfo && userInfo.infra_type) {
          // If the user is a moderator, filter by allowed infra_type
          const allowedInfraType = userInfo.infra_type._id;
          const filteredTypes = response.data.filter(
            (type) => type._id === allowedInfraType
          );
          setInfrastructureTypes(filteredTypes);
          setValue("infrastructureType", allowedInfraType); // Automatically set the selected infra_type
        }
      } catch (error) {
        toast.error("Failed to load infrastructure types.");
      }
    };

    if (
      userInfo &&
      (userInfo.isAdmin || (userInfo.isModerator && userInfo.can_create))
    ) {
      console.log("User has permission to add moderator:", userInfo);
      fetchInfrastructureTypes();
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
      if (userInfo.isAdmin) {
        await registerUser({
          name,
          email,
          password,
          infra_type: infrastructureType,
        }).unwrap();
        toast.success("User account added successfully!");
      } else if (userInfo.isModerator && userInfo.can_create) {
        await createModerator({
          name,
          email,
          password,
          infra_type: infrastructureType,
        }).unwrap();
        toast.success("Moderator account added successfully!");
      } else {
        toast.error("You don't have permission to perform this action.");
        return;
      }
  
      // Close the form and reset after successful operation
      onClose();
      form.reset();
    } catch (err) {
      console.log(err);
      const errorMessage =
        err.data?.message || "An error occurred during registration.";
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
                    placeholder="Sample Moderator (SM)"
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
                    placeholder="user@gmail.com"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                
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
                  {userInfo.isModerator ? (
                    // Render the Input when the user is a moderator (read-only)
                    <Input
                      value={
                        infrastructureTypes.find(
                          (type) => type._id === field.value
                        )?.infra_name || "Loading..."
                      }
                      readOnly
                      className="bg-gray-100"
                    />
                  ) : (
                    // Render the Select when the user is not a moderator
                    <Select
                      value={field.value}
                      onValueChange={(value) =>
                        setValue("infrastructureType", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select infrastructure type" />
                      </SelectTrigger>
                      <SelectContent>
                        {infrastructureTypes.length === 0 ? (
                          <SelectItem value="notypes" disabled>
                            No types available
                          </SelectItem>
                        ) : (
                          infrastructureTypes.map((type) => (
                            <SelectItem key={type._id} value={type._id}>
                              {type.infra_name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  )}
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
