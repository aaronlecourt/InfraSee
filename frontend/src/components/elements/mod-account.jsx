import React, { useState, useEffect } from "react";
import { useUpdateUserMutation } from "@/slices/users-api-slice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
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
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { UserRoundXIcon } from "lucide-react";
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";


// Validation schema
const formSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Invalid email address."),
  infrastructureType: z.string().min(1, "Infrastructure type is required."),
});

const fetchInfrastructureTypes = async () => {
  const response = await axios.get("/api/infrastructure-types");
  return response.data;
};

export function ModAccount({ user, userInfo }) {
  const [infrastructureTypes, setInfrastructureTypes] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  // const [logoutApiCall] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loadInfrastructureType = async () => {
    try {
      const data = await fetchInfrastructureTypes();
      setInfrastructureTypes(data);
    } catch (error) {
      toast.error("Failed to load infrastructure types.");
    }
  };

  useEffect(() => {
    loadInfrastructureType();
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      infrastructureType: user?.infra_type?._id || "",
    },
  });

  const getInfraName = (value) => {
    return infrastructureTypes.find((type) => type._id === value)?.infra_name;
  };

  const { handleSubmit, control, reset } = form;

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        infrastructureType: user.infra_type?._id || "",
      });
    }
  }, [user, reset]);

  // const handleLogout = async () => {
  //   try {
  //     await logoutApiCall().unwrap();
  //     dispatch(logout());
  //     navigate("/moderator/login");
  //   } catch (err) {
  //     console.log(err);
  //     toast.error("Failed to log out.");
  //   }
  // };

  const onSubmit = async (data) => {
    const { name, email, infrastructureType } = data;

    try {
      // Update user information
      await updateUser({
        name,
        email,
        infra_type: infrastructureType,
      }).unwrap();

      // Notify the user of a successful update
      toast.success("Account updated successfully!");

      // Initiate the countdown before logging out
      // startLogoutCountdown(3);

    } catch (err) {
      handleUpdateError(err);
    }
  };

  // Function to manage logout countdown
  // const startLogoutCountdown = (seconds) => {
  //   let countdown = seconds;

  //   const countdownInterval = setInterval(() => {
  //     if (countdown <= 0) {
  //       clearInterval(countdownInterval);
  //       toast.dismiss();
  //       toast.info("You have been logged out to apply changes.");
  //       handleLogout(); 
  //     } else {
  //       toast.dismiss();
  //       toast(`Logging out in ${countdown} seconds to apply changes.`);
  //       countdown -= 1; 
  //     }
  //   }, 1000);
  // };

  const handleUpdateError = (error) => {
    const errorMessage = error?.data?.message || "An error occurred during the update.";
    toast.error(errorMessage);
  };
  
  
  // const handleDeactivate = async () => {
  //   try {
  //     await axios.delete("/api/deactivate-account");
  //     toast.success("Account deactivated successfully!");
  //     setIsDialogOpen(false);
  //   } catch (err) {
  //     const errorMessage =
  //       err.response?.data?.message || "An error occurred during deactivation.";
  //     toast.error(errorMessage);
  //   }
  // };

  // Find the selected infrastructure name
  
  return (
    <div>
      <h1 className="text-xl font-bold mb-2">Account</h1>
      <p className="text-gray-500 text-sm mb-4">
        View your account details here. As per policy, your details can only be edited by the one who created your account.
      </p>
      <hr className="mb-4" />

      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 md:w-1/2 w-full"
        >
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
                    readOnly
                    className="cursor-not-allowed bg-gray-100 text-gray-500" 
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
                    readOnly
                    className="cursor-not-allowed bg-gray-100 text-gray-500" 
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
                  <FormLabel className="font-bold">
                    Infrastructure Type
                  </FormLabel>
                  <FormMessage className="text-right" />
                </div>
                <FormControl>
                  <Input
                    value={
                      getInfraName(user?.infra_type?._id) ||
                      "No Infrastructure Type"
                    }
                    readOnly
                    className="cursor-not-allowed bg-gray-100 text-gray-500" 
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* <Button type="submit" className="w-full mt-4" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Account"}
          </Button> */}

          {/* Moved DialogTrigger inside Dialog */}
          {!userInfo.isSubModerator && (
          <Dialog>
            {/* <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex gap-x-2 w-full text-destructive font-semibold"
              >
                <UserRoundXIcon size={15} />
                Deactivate Account
              </Button>
            </DialogTrigger> */}

            {/* Confirmation Dialog */}
            <DialogPortal>
              <DialogOverlay />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Account Deactivation</DialogTitle>
                  <DialogDescription>
                    Account deactivation and reactivation is requested via email
                    to i.iirs.infrasee@gmail.com. Deactivating your account
                    removes your login privileges but does not remove any
                    records made under your account.
                  </DialogDescription>
                </DialogHeader>
                {/* <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button variant="destructive" onClick={handleDeactivate}>
                    Deactivate Account
                  </Button>
                </DialogFooter> */}
              </DialogContent>
            </DialogPortal>
          </Dialog>
          )}
        </form>
      </Form>
    </div>
  );
}
