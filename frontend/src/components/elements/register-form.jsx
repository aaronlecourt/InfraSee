import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { Checkbox } from "@/components/ui/checkbox";

// Base validation schema for moderator
const baseSchema = z.object({
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

// Function to get validation schema including submoderator fields
const getSchema = (needsSubmod) => {
  const submodSchema = needsSubmod
    ? z.object({
        submodName: z.string().min(1, "Submoderator name is required."),
        submodEmail: z
          .string()
          .min(1, "Submoderator email is required.")
          .email("Invalid email address."),
        submodPassword: z
          .string()
          .min(1, "Submoderator password is required.")
          .min(8, "Password must be at least 8 characters.")
          .regex(
            /[A-Z]/,
            "Password must contain at least one uppercase letter."
          )
          .regex(
            /[a-z]/,
            "Password must contain at least one lowercase letter."
          )
          .regex(/\d/, "Password must contain at least one number.")
          .regex(
            /[\W_]/,
            "Password must contain at least one special character."
          ),
      })
    : z.object({
        submodName: z.string().optional(),
        submodEmail: z.string().optional(),
        submodPassword: z.string().optional(),
      });

  return baseSchema.merge(submodSchema);
};

export function RegisterForm({ onClose }) {
  const navigate = useNavigate();
  const [register] = useRegisterMutation();
  const [needsSubmod, setNeedsSubmod] = useState(false);
  const [submodDetails, setSubmodDetails] = useState({
    submodName: "",
    submodEmail: "",
    submodPassword: "",
  });

  const form = useForm({
    resolver: zodResolver(getSchema(needsSubmod)),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      infrastructureType: "",
      submodName: "",
      submodEmail: "",
      submodPassword: "",
    },
  });

  const { handleSubmit, control, setValue, setError } = form;
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [infrastructureTypes, setInfrastructureTypes] = useState([]);

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

    // Check if the email already exists
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      setError("email", {
        type: "manual",
        message: "Email is already in use.",
      });
      return;
    }

    try {
      // Create the moderator and get the ID
      const moderatorResponse = await register({
        name,
        email,
        password,
        infra_type: infrastructureType,
        needs_submod: needsSubmod, // Include checkbox value in registration
      }).unwrap();

      const modId = moderatorResponse._id; // Extract the moderator ID

      // If a submoderator is needed, send the request to create it
      if (needsSubmod) {
        await axios.post(`/api/users/${modId}/submoderators`, {
          name: submodDetails.submodName,
          email: submodDetails.submodEmail,
          password: submodDetails.submodPassword,
        });
      }

      toast.success("Moderator account added successfully!");
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

          <FormItem className="flex flex-row space-x-3 space-y-0 rounded-md p-2 items-center">
            <FormControl>
              <Checkbox
                checked={needsSubmod}
                onCheckedChange={(checked) => setNeedsSubmod(checked)}
              />
            </FormControl>
            <div className="leading-none">
              <FormLabel className="font-semibold">
                Create a submoderator for this account?
              </FormLabel>
              <FormDescription className="text-xs">
                Before a report is successfully marked 'Resolved', the time
                resolved field will first be verified by this sub moderator.
              </FormDescription>
            </div>
          </FormItem>

          {needsSubmod && (
            <div className="space-y-2">
              <FormField
                control={control}
                name="submodName"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Submoderator Name</FormLabel>
                      <FormMessage className="text-right" />
                    </div>
                    <FormControl>
                      <Input
                        placeholder="Submoderator Name"
                        {...field}
                        onChange={(e) =>
                          setSubmodDetails({
                            ...submodDetails,
                            submodName: e.target.value,
                          })
                        }
                        autoComplete="username"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="submodEmail"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Submoderator Email</FormLabel>
                      <FormMessage className="text-right" />
                    </div>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="submod@gmail.com"
                        {...field}
                        onChange={(e) =>
                          setSubmodDetails({
                            ...submodDetails,
                            submodEmail: e.target.value,
                          })
                        }
                        autoComplete="email"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="submodPassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Submoderator Password</FormLabel>
                      <FormMessage className="text-right" />
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={passwordVisible ? "text" : "password"}
                          placeholder="••••••••"
                          autoComplete="new-password"
                          {...field}
                          onChange={(e) =>
                            setSubmodDetails({
                              ...submodDetails,
                              submodPassword: e.target.value,
                            })
                          }
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
            </div>
          )}

          <Button type="submit" className="w-full mt-4">
            Register
          </Button>
        </form>
      </Form>
    </div>
  );
}
