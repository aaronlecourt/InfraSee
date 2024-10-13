import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import LocationForm from "./forms/location-form";
import InfraTypeForm from "./forms/infratype-form";
import DetailsForm from "./forms/details-form";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Define the validation schema using Zod
const detailsSchema = z.object({
  fullName: z.string().min(1, "Full Name is required."),
  contactNumber: z.string().min(1, "Contact Number is required."),
  description: z.string().min(1, "Description is required."),
  email: z.string().email("Invalid email address.").optional(),
  file: z.any(), // Handle file uploads if necessary
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
      file: "",
    },
    resolver: zodResolver(detailsSchema),
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [hasSetLocation, setHasSetLocation] = useState(false);
  const [locationData, setLocationData] = useState({ address: "", latitude: "", longitude: "" });
  const [infraType, setInfraType] = useState("");

  const handleNextStep = () => {
    if (currentStep === 1 && !hasSetLocation) {
      toast.error("Please set a location before proceeding.");
      return;
    }
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const onSubmit = (data) => {
    const submitData = {
      address: locationData.address,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      infraType: infraType,
      fullName: data.fullName,
      contactNumber: data.contactNumber,
      description: data.description,
      file: data.file,
    };
    console.log("Submitting report:", submitData);
    handleClose();
    toast.success("Report submitted successfully!");
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
              {currentStep === 1 && "Set Location"}
              {currentStep === 2 && "Select Infrastructure Type"}
              {currentStep === 3 && "Provide Report Details"}
            </SheetTitle>
            <SheetDescription className="mb-2">
              {currentStep === 1 && "Please search for a landmark or use your current location."}
              {currentStep === 2 && "Select the appropriate type of infrastructure."}
              {currentStep === 3 && "Answer the required fields."}
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
            <InfraTypeForm
              infraType={infraType}
              setInfraType={setInfraType}
            />
          )}
          {currentStep === 3 && (
            <DetailsForm
              onSubmit={methods.handleSubmit(onSubmit)}
            />
          )}

          <div className="flex justify-between mt-4">
            {currentStep > 1 && (
              <Button variant="default" type="button" onClick={handlePreviousStep}>
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
                  (currentStep === 2 && !infraType) // Disable if no infraType selected
                }
              >
                Next
              </Button>
            )}
            {currentStep === 3 && (
              <Button variant="default" type="button" onClick={methods.handleSubmit(onSubmit)}>
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
