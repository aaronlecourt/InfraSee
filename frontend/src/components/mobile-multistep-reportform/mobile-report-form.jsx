import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
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

const detailsSchema = z.object({
  report_by: z
    .string()
    .min(1, "Full Name is required.")
    .min(5, "Full Name is too short.")
    .max(50, "Full Name must not exceed 50 characters."),
  report_contactNum: z
    .string()
    .min(1, "Contact Number is required.")
    .length(11, "Contact Number must be 11 digits long.")
    .regex(/^09\d{9}$/, "Contact Number must start with 09."),
  report_desc: z
    .string()
    .min(1, "Description is required.")
    .min(25, "Description too short.")
    .max(150, "Description must not exceed 150 characters."),
  report_img: z
    .string()
    .url()
    .refine((value) => value.length > 0, {
      message: "Image URL is required.",
    }),
});

const MultiStepForm = ({ open, onClose }) => {
  const methods = useForm({
    defaultValues: {
      is_new: false,
      report_address: "",
      latitude: "",
      longitude: "",
      infraType: "",
      report_by: "",
      report_contactNum: "",
      report_desc: "",
      report_img: "",
      report_status: "66d25911baae7f52f54793f6",
      report_mod: null,
      report_time_resolved: null,
      status_remark: null
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
  const [isUploading, setIsUploading] = useState(false);

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

  const onSubmit = async (data) => {
    if (!data.report_img) {
      toast.error("Please provide a valid image URL.");
      return;
    }

    const submitData = {
      is_new: false,
      report_address: locationData.address,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      infraType: infraType,
      report_by: data.report_by,
      report_contactNum: data.report_contactNum,
      report_desc: data.report_desc,
      report_img: data.report_img,
      report_status: "66d25911baae7f52f54793f6",
      report_mod: null,
      report_time_resolved: null,
      status_remark: null,
    };

    try {
      setIsUploading(true);
      const response = await axios.post("/api/reports/create", submitData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        toast.success("Report submitted successfully!", { duration: 3000 });
        methods.reset();
        setHasSetLocation(false);
        setLocationData({ address: "", latitude: "", longitude: "" });
        setInfraType("");
        setCurrentStep(1);
        handleClose();
      } else {
        toast.error(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("An error occurred while submitting the report.");
    } finally {
      setIsUploading(false);
    }
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
                }
              >
                Next
              </Button>
            )}
            {currentStep === 3 && (
              <Button
                variant="default"
                type="button"
                onClick={methods.handleSubmit(onSubmit)}
                disabled={isUploading}
              >
                {isUploading ? "Submitting..." : "Submit"}
              </Button>
            )}
          </div>
        </SheetContent>
      </FormProvider>
    </Sheet>
  );
};

export default MultiStepForm;
