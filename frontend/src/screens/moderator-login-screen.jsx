import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useModeratorLoginMutation } from "../slices/users-api-slice";
import { setCredentials } from "../slices/auth-slice";
import { toast } from "sonner"; // Import Sonner toast
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
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"; // Import Sheet components
import { Menu } from "lucide-react"; // Use Lucide's Menu icon

// Validation schema
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
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

function ModeratorLoginScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login] = useModeratorLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit, control } = form;
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility
  const [isSheetOpen, setSheetOpen] = useState(false); // State to control the Sheet

  useEffect(() => {
    if (userInfo) {
      navigate("/moderator/dashboard");
    }
  }, [navigate, userInfo]);

  const onSubmit = async (data) => {
    try {
      const res = await login(data).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/moderator/dashboard");
      toast.success("Login successful!"); // Success notification with Sonner
    } catch (err) {
      toast.error(err?.data?.message || err.error); // Error notification with Sonner
    }
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleContactClick = () => {
    navigate("/contact-us");
  };

  return (
    <div>
      <div className="fixed top-0 right-0 p-4 flex items-center justify-between z-50 w-full">
        <div className="w-[6rem] mt-1 cursor-pointer" onClick={handleLogoClick}>
          <img src="/infrasee_white.png" alt="Infrasee Logomark" />
        </div>
        {/* Mobile sheet trigger */}
        <div className="md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" color="white" />{" "}
                {/* Lucide Menu Icon */}
                <span className="sr-only">Open Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="top">
              <nav className="grid gap-4 py-1">
                <Button onClick={handleContactClick} variant="ghost">
                  Contact Us
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex">
          <Button onClick={handleContactClick} variant="ghost">
            Contact Us
          </Button>
        </nav>
      </div>

      <main className="">
        {" "}
        {/* Padding top to avoid overlap with fixed header */}
        <div className="flex flex-col md:flex-row h-screen">
          {/* Left Side */}
          <div className="w-full h-screen md:w-1/2 bg-[url('/bg_dark.png')] bg-no-repeat bg-cover bg-center text-white flex items-center justify-center">
            {/* <p className="text-center text-lg">Welcome to our platform</p> */}
          </div>

          {/* Right Side */}
          <div className="w-full md:w-1/2 flex items-center justify-center">
            <div className="p-8 rounded-lg w-full max-w-md">
              <div className="mb-5">
                <h1 className="text-2xl font-bold mb-1 text-gray-900">Login</h1>
                <p className="text-sm text-gray-500">
                  Enter your account details below to login.
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                  <FormField
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email"
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
                              type={passwordVisible ? "text" : "password"} // Toggle between text and password
                              placeholder="Enter your password"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setPasswordVisible(!passwordVisible)
                              } // Toggle password visibility
                              className="absolute inset-y-0 right-3 flex items-center text-sm"
                            >
                              {passwordVisible ? (
                                <EyeOff size={18} /> // Lucide "EyeOff" icon for hiding
                              ) : (
                                <Eye size={18} /> // Lucide "Eye" icon for showing
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="w-full flex items-center justify-end text-right">
                    <Button
                      variant="ghost"
                      className="flex items-center justify-end text-right"
                    >
                      <span className="flex items-center space-x-2">
                        <Lock size={16} className="text-gray-500" />{" "}
                        <span className="text-gray-500">Reset Password</span>
                      </span>
                    </Button>
                  </div>

                  <Button type="submit" className="w-full">
                    Sign In
                  </Button>
                </form>
              </Form>
              <div className="mt-3 text-sm text-gray-500 text-center flex flex-col items-center lg:flex-row md:items-center md:justify-center md:space-x-1">
                <span className="md:mt-2">
                  By clicking sign in, you agree to our
                </span>
                <a
                  href="/terms-and-conditions"
                  className="underline hover:text-gray-900 md:mt-2"
                >
                  Terms and Conditions
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ModeratorLoginScreen;
