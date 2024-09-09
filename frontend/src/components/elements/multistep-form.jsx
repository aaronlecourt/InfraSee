import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import ResetPasswordForm from './resetpassword';
import OTPForm from './otp-form';
import UpdatePasswordForm from './updatePass-form';
import { Dialog } from '@/components/ui/dialog';

const MultiStepForm = ({ open, onClose }) => {
  const methods = useForm({
    defaultValues: {
      email: '',
      otp: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const [currentStep, setCurrentStep] = useState(1);

  const handleNextStep = () => {
    setCurrentStep(prevStep => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(prevStep => prevStep - 1);
  };

  const handleClose = () => {
    onClose();
    setCurrentStep(1);  // Reset to the first step when closing
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <FormProvider {...methods}>
        {currentStep === 1 && (
          <ResetPasswordForm
            onClose={handleClose}
            onOtpSubmitted={handleNextStep}  // Proceed to the next step
          />
        )}
        {currentStep === 2 && (
          <OTPForm
            onClose={handleClose}
            onOtpVerified={handleNextStep}  // Proceed to the next step
          />
        )}
        {currentStep === 3 && (
          <UpdatePasswordForm
            onClose={handleClose}
            onPasswordUpdated={handleClose}  // Close dialog on password update
          />
        )}
      </FormProvider>
    </Dialog>
  );
};

export default MultiStepForm;
