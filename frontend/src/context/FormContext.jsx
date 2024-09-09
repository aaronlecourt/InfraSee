import React, { createContext, useContext, useState } from 'react';

const FormContext = createContext();

export function FormProviderComponent({ children }) {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);
  const resetStep = () => setCurrentStep(1);

  return (
    <FormContext.Provider value={{ currentStep, nextStep, prevStep, resetStep }}>
      {children}
    </FormContext.Provider>
  );
}

export function useFormStep() {
  return useContext(FormContext);
}
