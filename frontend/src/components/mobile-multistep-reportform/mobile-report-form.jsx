import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import LocationForm from './forms/location-form';
import InfraTypeForm from './forms/infratype-form';
import DetailsForm from './forms/details-form';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const MultiStepForm = ({ open, onClose }) => {
  const methods = useForm({
    defaultValues: {
      address: '',
      latitude: '',
      longitude: '',
      infraType: '',
      fullName: '',
      contactNumber: '',
      description: '',
      email: '',
      file: null,
    },
  });

  const [currentStep, setCurrentStep] = useState(2);
  const [hasSetLocation, setHasSetLocation] = useState(false);
  const [locationData, setLocationData] = useState({
    address: '',
    latitude: '',
    longitude: '',
  });
  const [infraType, setInfraType] = useState('');

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

  const handleClose = () => {
    onClose();
    setCurrentStep(1);
    methods.reset();
    setHasSetLocation(false);
    setLocationData({ address: '', latitude: '', longitude: '' });
    setInfraType('');
  };

  return (
    <Sheet 
      open={open} 
      onOpenChange={handleClose}
    >
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
              sethasSetLocation={setHasSetLocation} 
              locationData={locationData} 
              setLocationData={setLocationData}
            />
          )}
          {currentStep === 2 && (
            <InfraTypeForm
              infraType={infraType}
              setInfraType={setInfraType}
              onClose={handleClose}
              onNext={handleNextStep}
            />
          )}
          {currentStep === 3 && (
            <DetailsForm
              onClose={handleClose}
              onSubmit={methods.handleSubmit((data) => {
                console.log("Final Submission Data:", data);
                handleClose();
              })}
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
                disabled={currentStep === 1 && !hasSetLocation}
              >
                Next
              </Button>
            )}
            {currentStep === 3 && (
              <Button
                variant="default"
                type="button"
                onClick={methods.handleSubmit((data) => {
                  console.log("Submitting report:", data);
                  handleClose();
                })}
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
