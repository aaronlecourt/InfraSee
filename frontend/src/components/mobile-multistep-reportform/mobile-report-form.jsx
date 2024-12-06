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

// Schema validation
const detailsSchema = z.object({
  report_by: z.string().min(2, "Your full name is required.").max(50),
  report_contactNum: z
    .string()
    .min(1, "Your contact number is required.")
    .length(11, "Your contact number must only be 11 digits.")
    .regex(/^09\d{9}$/, "Your contact number must begin with 09."),
  report_desc: z
    .string()
    .min(1, "Report description is required.")
    // .min(25, "Report description must contain at least 25 characters.")
    .max(150, "Report description is limited to 150 characters only."),
  report_img: z.string().url().min(1, "Image is required."),
});

const MultiStepForm = ({ open, onClose }) => {
  const methods = useForm({
    defaultValues: {
      report_address: "",
      latitude: "",
      longitude: "",
      infraType: "",
      report_by: "",
      report_contactNum: "",
      report_desc: "",
      report_img: "",
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
  const [isUploading, setIsUploading] = useState(false);
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

  const handlePreviousStep = () => setCurrentStep((prevStep) => prevStep - 1);

  const onSubmit = async (data) => {
    const submitData = {
      report_address: locationData.address,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      infraType,
      report_by: data.report_by,
      report_contactNum: data.report_contactNum,
      report_desc: data.report_desc,
      report_img: data.report_img,
    };

    try {
      setIsUploading(true);
      const response = await axios.post("/api/reports/create", submitData);
      if (response.status === 201) {
        toast.success("Report submitted successfully!");
        methods.reset();
        setHasSetLocation(false);
        setLocationData({ address: "", latitude: "", longitude: "" });
        setInfraType("");
        setCurrentStep(1);
        onClose(); // Close the form
      } else {
        toast.error(`Error: ${response.data.message}`);
      }
    } catch (error) {
      let errorMessage = "An unknown error occurred. Please try again later.";
      if (error.response) {
        errorMessage = error.response.data.message || "An error occurred.";
      }

      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <FormProvider {...methods}>
        <SheetContent className="p-5 rounded-t-xl" side="bottom">
          <SheetHeader>
            <SheetTitle>
              {currentStep === 1
                ? "Set Location"
                : currentStep === 2
                ? "Select Infrastructure Type"
                : "Provide Report Details"}
            </SheetTitle>
            <SheetDescription>
              {currentStep === 1
                ? "Please set your location."
                : currentStep === 2
                ? "Select an infrastructure type."
                : "Fill in the report details."}
            </SheetDescription>
            <SheetClose onClick={onClose} />
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
              setImagePreview={setImagePreview} // Ensure this is passed
            />
          )}

          <div className="flex justify-between mt-4">
            {currentStep > 1 && (
              <Button onClick={handlePreviousStep}>Back</Button>
            )}
            {currentStep < 3 && <Button onClick={handleNextStep}>Next</Button>}
            {currentStep === 3 && (
              <Button
                onClick={methods.handleSubmit(onSubmit)}
                disabled={isUploading || !imagePreview} // Disable if uploading or no image
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
