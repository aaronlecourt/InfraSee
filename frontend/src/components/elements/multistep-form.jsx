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
  const [formData, setFormData] = useState({ email: '', otp: '' });

  const handleNextStep = () => {
    setCurrentStep(prevStep => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(prevStep => prevStep - 1);
  };

  const handleEmailSubmitted = (data) => {
    setFormData(prevData => ({ ...prevData, email: data.email }));
    handleNextStep(); // Proceed to OTP step
  };

  const handleOtpVerified = (data) => {
    setFormData(prevData => ({ ...prevData, otp: data.otp }));
    handleNextStep(); // Proceed to next step
  };

  const handleClose = () => {
    onClose();
    setCurrentStep(1); // Reset to the first step when closing
    setFormData({ email: '', otp: '' }); // Reset form data
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <FormProvider {...methods}>
        {currentStep === 1 && (
          <ResetPasswordForm
            onClose={handleClose}
            onOtpSubmitted={handleEmailSubmitted} // Proceed with form data
          />
        )}
        {currentStep === 2 && (
          <OTPForm
            onClose={handleClose}
            onOtpVerified={handleOtpVerified} // Proceed with form data
            email={formData.email} // Pass email from state
          />
        )}
        {currentStep === 3 && (
          <UpdatePasswordForm
            onClose={handleClose}
            email={formData.email} // Pass email from state if needed
            otp={formData.otp} // Pass OTP from state if needed
          />
        )}
      </FormProvider>
    </Dialog>
  );
};

export default MultiStepForm;