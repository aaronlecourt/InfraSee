import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import LocationForm from "./forms/location-form";
import InfraTypeForm from "./forms/infratype-form";
import DetailsForm from "./forms/details-form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

const detailsSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full Name is required.")
    .min(5, "Full Name is too short.")
    .max(50, "Full Name must not exceed 50 characters."),
  contactNumber: z
    .string()
    .min(1, "Contact Number is required.")
    .length(11, "Contact Number must be 11 digits long.")
    .regex(/^09\d{9}$/, "Contact Number must start with 09."),
  description: z
    .string()
    .min(1, "Description is required.")
    .min(25, "Description too short.")
    .max(150, "Description must not exceed 150 characters."),
  file: z
    .instanceof(File, { message: "File is required." })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "File size must not exceed 2 MB.",
    })
    .refine((file) => file.type === "image/png" || file.type === "image/jpeg", {
      message: "Only PNG and JPG files are allowed.",
    }),
  fileUrl: z.string().url(),
});

const MultiStepForm = ({ open, onClose }) => {
  const methods = useForm({
    defaultValues: {
      address: "",
      latitude: "",
      longitude: "",
      infraType: "",
      fullName: "",
      contactNumber: "",
      description: "",
      file: null,
      fileUrl: "",
      status: "66d25911baae7f52f54793f6",
    },
    resolver: zodResolver(detailsSchema),
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [hasSetLocation, setHasSetLocation] = useState(false);
  const [locationData, setLocationData] = useState({
    address: "",
    latitude: "",
    longitude: "",
  });
  const [infraType, setInfraType] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const handleNextStep = () => {
    if (currentStep === 1 && !hasSetLocation) {
      toast.error("Please set a location before proceeding.");
      return;
    }
    if (currentStep === 2 && !infraType) {
      toast.error("Please select an infrastructure type.");
      return;
    }
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const onSubmit = (data) => {
    if (!data.file) {
      toast.error("Please upload a file before submitting.");
      return;
    }

    const submitData = {
      address: locationData.address,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      infraType: infraType,
      fullName: data.fullName,
      contactNumber: data.contactNumber,
      description: data.description,
      file: data.file,
      fileUrl: data.fileUrl,
      status: "66d25911baae7f52f54793f6",
    };

    console.log("Submitting report:", submitData);
    handleClose();
    toast.success("Report submitted successfully!", { duration: 3000 });
  };

  const handleClose = () => {
    onClose();
    setCurrentStep(1);
    methods.reset();
    setHasSetLocation(false);
    setLocationData({ address: "", latitude: "", longitude: "" });
    setInfraType("");
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <FormProvider {...methods}>
        <SheetContent className="p-5 rounded-t-xl" side="bottom">
          <SheetHeader className="mt-2 px-0">
            <SheetTitle className="font-bold">
              {currentStep === 1
                ? "Set Location"
                : currentStep === 2
                ? "Select Infrastructure Type"
                : "Provide Report Details"}
            </SheetTitle>
            <SheetDescription className="mb-2">
              {currentStep === 1
                ? "Please search for a landmark or use your current location."
                : currentStep === 2
                ? "Select the appropriate type of infrastructure."
                : "Answer the required fields."}
            </SheetDescription>
            <SheetClose onClick={handleClose} />
          </SheetHeader>

          {currentStep === 1 && (
            <LocationForm
              setHasSetLocation={setHasSetLocation}
              locationData={locationData}
              setLocationData={setLocationData}
            />
          )}
          {currentStep === 2 && (
            <InfraTypeForm infraType={infraType} setInfraType={setInfraType} />
          )}
          {currentStep === 3 && (
            <DetailsForm
              onSubmit={methods.handleSubmit(onSubmit)}
              imagePreview={imagePreview}
              setImagePreview={setImagePreview}
            />
          )}

          <div className="flex justify-between mt-4">
            {currentStep > 1 && (
              <Button
                variant="default"
                type="button"
                onClick={handlePreviousStep}
              >
                Back
              </Button>
            )}
            {currentStep < 3 && (
              <Button
                variant="default"
                type="button"
                onClick={handleNextStep}
                disabled={
                  (currentStep === 1 && !hasSetLocation) ||
                  (currentStep === 2 && !infraType)
                } // Disable Next if no location or infraType is selected
              >
                Next
              </Button>
            )}
            {currentStep === 3 && (
              <Button
                variant="default"
                type="button"
                onClick={methods.handleSubmit(onSubmit)}
              >
                Submit
              </Button>
            )}
          </div>
        </SheetContent>
      </FormProvider>
    </Sheet>
  );
};

export default MultiStepForm;
