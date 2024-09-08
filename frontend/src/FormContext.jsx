// FormContext.js
import React, { createContext, useContext, useState } from 'react';

const FormContext = createContext();

export function FormProvider({ children }) {
  const [step, setStep] = useState(0); // 0: Reset Password, 1: OTP, 2: Update Password
  const [email, setEmail] = useState('');

  const goToNextStep = () => setStep(prev => prev + 1);
  const goToPreviousStep = () => setStep(prev => prev - 1);

  return (
    <FormContext.Provider value={{ step, setStep, email, setEmail, goToNextStep, goToPreviousStep }}>
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  return useContext(FormContext);
}
