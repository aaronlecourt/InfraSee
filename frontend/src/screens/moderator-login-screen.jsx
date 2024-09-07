// ModeratorLoginScreen.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useModeratorLoginMutation } from "../slices/users-api-slice";
import { setCredentials } from "../slices/auth-slice";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
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
import { Menu } from "lucide-react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import ResetPassword from "@/components/elements/resetpassword";
import OTPForm from "@/components/elements/otp-form";
import UpdatePasswordForm from "@/components/elements/updatePass-form";


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
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isSheetOpen, setSheetOpen] = useState(false);

  const [isResetPasswordDialogOpen, setResetPasswordDialogOpen] =
    useState(false);
  const [isOTPDialogOpen, setisOTPDialogOpen] = useState(false);
  const [isUpdatePassDialogOpen, setisUpdatePassDialogOpen] = useState(false);

  const [isTermsDialogOpen, setTermsDialogOpen] = useState(false);

  useEffect(() => {
    if (userInfo && userInfo?.isModerator) {
      navigate("/moderator/dashboard");
    }
  }, [navigate, userInfo]);

  const onSubmit = async (data) => {
    try {
      const res = await login(data).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/moderator/dashboard");
      toast.success("Login successful!");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
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
                      {/* <Dialog
                        open={isResetPasswordDialogOpen}
                        onOpenChange={(open) => setResetPasswordDialogOpen(open)}
                      > */}
                      {/* <Dialog
                        open={isOTPDialogOpen}
                        onOpenChange={(open) => setisOTPDialogOpen(open)}
                      > */}
                        <Dialog
                        open={isUpdatePassDialogOpen}
                        onOpenChange={(open) => setisUpdatePassDialogOpen(open)}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="link"
                            className="flex items-center justify-end text-right"
                          >
                            <span className="flex items-center space-x-2">
                              <Lock size={16} className="text-gray-500" />
                              <span className="text-gray-500">
                                Reset Password
                              </span>
                            </span>
                          </Button>
                        </DialogTrigger>

                        {/* <ResetPassword onClose={() => setResetPasswordDialogOpen(false)} /> */}
                        {/* <OTPForm onClose={() => setisOTPDialogOpen(false)} /> */}
                        <UpdatePasswordForm onClose={() => setisUpdatePassDialogOpen(false)}/>
                          
                      </Dialog>
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
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Repudiandae, nobis? Aspernatur a voluptates ut obcaecati
                        repellat, mollitia totam praesentium nesciunt fugiat
                        debitis saepe magnam nostrum quae earum sunt nulla
                        expedita. Dignissimos quae ullam tenetur blanditiis vero
                        qui, neque nesciunt voluptatem. Illo eaque laboriosam
                        saepe fugit. Harum ad in laboriosam nisi tenetur.
                        Reprehenderit recusandae voluptas id aliquam sint, illum
                        odit excepturi. Aspernatur, doloremque odit nostrum
                        expedita deleniti praesentium? Dolores ipsa
                        reprehenderit sed facilis. Corporis ipsa, delectus a
                        aliquam id facere accusamus sit. Praesentium quos ex
                        temporibus dolorum beatae ducimus dolor alias. Dolore in
                        nulla ipsa aperiam deleniti quibusdam? Est impedit ipsam
                        obcaecati officiis debitis, delectus odit, magni, iusto
                        numquam esse explicabo minima provident? Aliquid
                        sapiente quos nobis ipsa incidunt omnis obcaecati.
                        Tempore ullam magni tenetur, sint esse dolore ipsam ut
                        enim numquam dicta vel, aperiam quisquam dolores nulla,
                        quasi suscipit harum molestiae inventore voluptatibus
                        perspiciatis? Neque quaerat illum inventore quas
                        voluptatem. Dignissimos vitae fuga voluptatem error
                        nesciunt ducimus aliquam temporibus est facilis nostrum
                        nobis saepe qui excepturi ipsum, vero omnis sint! Sunt
                        labore exercitationem deserunt numquam quos impedit
                        alias architecto fugit. Temporibus dicta, possimus vero,
                        at vel inventore repudiandae, blanditiis expedita ullam
                        sed a voluptates beatae deserunt dignissimos doloribus
                        doloremque exercitationem reprehenderit nemo nobis
                        nesciunt odio. Labore quos in corrupti! Quaerat. Ut modi
                        et earum natus fugit architecto eius expedita tempore
                        officia quibusdam! Nemo doloribus, consequuntur suscipit
                        quis tenetur et voluptas perferendis eius natus dolorem
                        quo, praesentium debitis officiis porro inventore.
                        Similique excepturi facilis eos dolorem dolor rem sequi
                        odit! Quia ut eligendi beatae repudiandae libero dicta
                        velit saepe iusto quas porro incidunt vero expedita nisi
                        sit quam, id, aliquid officiis? Molestiae est dolore
                        voluptates. Expedita culpa necessitatibus cumque
                        explicabo, numquam quos laborum quo quas aliquid
                        voluptatum, optio in amet sunt! Dolorem assumenda
                        praesentium voluptatibus rerum fugit! Alias id suscipit
                        aperiam. Saepe recusandae ab iste voluptate qui corrupti
                        et natus corporis. Incidunt porro iure vel id recusandae
                        consectetur, vitae eum sed illo repellendus repudiandae
                        amet, repellat tempore, delectus maxime non quod?
                        Molestiae, sunt, earum saepe debitis dignissimos est
                        pariatur ab rem recusandae dolorem, consequatur
                        veritatis nihil sint esse! Animi ipsam autem facilis
                        repudiandae nesciunt! Porro reprehenderit iure
                        repellendus, provident exercitationem optio.
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
