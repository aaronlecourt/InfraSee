// ModeratorLoginScreen.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useModeratorLoginMutation } from "../slices/users-api-slice";
import { setCredentials } from "../slices/auth-slice";
import { toast } from "sonner";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Lock } from "lucide-react";
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
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Menu } from "lucide-react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import MultiStepForm from "@/components/elements/multistep-form";
import TermsAndConditions from "@/components/elements/terms-conditions";

const formSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required.")
    .email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(1, "Password is required.")
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
  const [loginModerator] = useModeratorLoginMutation();
  const [loading, setLoading] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);

  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit, control } = methods;
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isMultiStepFormOpen, setMultiStepFormOpen] = useState(false);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isTermsDialogOpen, setTermsDialogOpen] = useState(false);

  useEffect(() => {
    if (userInfo) {
      const path = userInfo.isModerator
        ? "/moderator/dashboard"
        : userInfo.isSubModerator
        ? "/submoderator/dashboard"
        : null;
      if (path) {
        navigate(path);
      }
    }
  }, [navigate, userInfo]);

  const onLoginSubmit = async (data) => {
    setLoading(true); // Set loading state to true
    try {
      const res = await loginModerator(data).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/moderator/dashboard");
      toast.success("Moderator login successful!");
    } catch (err) {
      if (err?.data?.message) {
        toast.error(err.data.message);
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false); 
    }
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleContactClick = () => {
    navigate("/contact-us");
  };

  return (
    <HelmetProvider>
      <div>
        <Helmet>
          <title>{"InfraSee | Moderator Login"}</title>
        </Helmet>
        <div className="fixed top-0 right-0 p-4 flex items-center justify-between z-50 w-full">
          <div
            className="w-[6rem] mt-1 cursor-pointer"
            onClick={handleLogoClick}
          >
            <img src="/infrasee_white.png" alt="Infrasee Logomark" />
          </div>
          {/* Mobile sheet trigger */}
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" color="white" />
                  <span className="sr-only">Open Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="top">
                <SheetHeader className="hidden">
                  <SheetTitle></SheetTitle>
                  <SheetDescription></SheetDescription>
                </SheetHeader>
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
          <div className="flex flex-col md:flex-row h-screen">
            {/* Left Side */}
            <div className="w-full h-screen md:w-1/2 bg-[url('/bg_dark.png')] bg-no-repeat bg-cover bg-center text-white flex items-center justify-center"></div>

            {/* Right Side */}
            <div className="w-full md:w-1/2 flex items-center justify-center">
              <div className="p-8 rounded-lg w-full max-w-md">
                <div className="mb-5">
                  <h1 className="text-2xl font-bold mb-1 text-gray-900">
                    Login
                  </h1>
                  <p className="text-sm text-gray-500">
                    Enter your account details below to login.
                  </p>
                </div>

                <FormProvider {...methods}>
                  <form
                    onSubmit={handleSubmit(onLoginSubmit)}
                    className="space-y-3"
                  >
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
                                onClick={() =>
                                  setPasswordVisible(!passwordVisible)
                                }
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

                    <div className="w-full flex items-center justify-end text-right">
                      <Button
                        onClick={() => setMultiStepFormOpen(true)}
                        type="button"
                        variant="link"
                        className="flex items-center justify-end text-right"
                      >
                        <span className="flex items-center space-x-2">
                          <Lock size={16} className="text-gray-500" />
                          <span className="text-gray-500">Reset Password</span>
                        </span>
                      </Button>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? "Signing In..." : "Sign In"}
                    </Button>
                  </form>
                </FormProvider>

                <FormProvider>
                  <MultiStepForm
                    open={isMultiStepFormOpen}
                    onClose={() => setMultiStepFormOpen(false)}
                  />
                </FormProvider>

                <div className="mt-3 text-sm text-gray-500 text-center flex flex-col items-center lg:flex-row md:items-center md:justify-center md:space-x-1">
                  <span className="md:mt-2">
                    By clicking sign in, you agree to our
                  </span>
                  <Dialog
                    open={isTermsDialogOpen}
                    onOpenChange={(open) => setTermsDialogOpen(open)}
                  >
                    <DialogTrigger asChild>
                      <a
                        href="#"
                        className="underline hover:text-gray-900 md:mt-2"
                      >
                        Terms and Conditions
                      </a>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle>Terms and Conditions</DialogTitle>
                      <DialogDescription>
                        <TermsAndConditions />
                      </DialogDescription>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </HelmetProvider>
  );
}

export default ModeratorLoginScreen;
