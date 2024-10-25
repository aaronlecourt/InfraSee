import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAdminLoginMutation } from "../slices/users-api-slice";
import { setCredentials } from "../slices/auth-slice";
import { toast } from "sonner"; // Import Sonner toast for consistency
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Lock } from "lucide-react"; // Import Lucide icons
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Helmet, HelmetProvider } from "react-helmet-async";

// Validation schema
const formSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required.") // Ensure email is not empty
    .email({ message: "Invalid email address." }), // Validate email format
  password: z
    .string()
    .min(1, "Password is required.") // Ensure password is not empty
    .min(8, { message: "Password must be at least 8 characters long." }) // Minimum length
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/\d/, { message: "Password must contain at least one number." })
    .regex(/[\W_]/, {
      message: "Password must contain at least one special character.",
    }),
});

function AdminLoginScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login] = useAdminLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit, control } = form;
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility

  useEffect(() => {
    if (userInfo && userInfo?.isAdmin) {
      navigate("/admin/dashboard");
    }
  }, [navigate, userInfo]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await login(data).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/admin/dashboard");
      toast.success("Login successful!"); 
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <HelmetProvider>
      <div>
        <Helmet>
          <title>{"InfraSee | Admin Login"}</title>
        </Helmet>
        <header className="fixed top-0 right-0 p-4 flex items-center justify-between z-50 w-full ">
          <div
            className="w-[6rem] mt-1 cursor-pointer"
            onClick={handleLogoClick}
          >
            <img src="/infrasee_black.png" alt="Infrasee Logomark" />
          </div>
        </header>

        <main className="flex items-center justify-center min-h-screen bg-[url('/bg.jpg')] bg-cover bg-no-repeat bg-top">
          <div className="backdrop-blur-md border p-8 rounded-lg w-full max-w-md">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
              Admin Login
            </h1>

            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Enter your password"
                            autoComplete="current-password"
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing In..." : "Sign In"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </main>
      </div>
    </HelmetProvider>
  );
}

export default AdminLoginScreen;
