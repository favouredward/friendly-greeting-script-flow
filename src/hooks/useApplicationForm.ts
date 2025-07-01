
import { useState } from 'react';

export interface ApplicationFormData {
  // Personal Information
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  country: string;
  address: string;
  program: string;
  
  // Employment Information
  employmentStatus: string;
  yearsOfExperience: number;
  currentEmployer: string;
  salary: string;
}

const initialFormData: ApplicationFormData = {
  fullName: '',
  email: '',
  phoneNumber: '',
  dateOfBirth: '',
  country: '',
  address: '',
  program: '',
  employmentStatus: '',
  yearsOfExperience: 0,
  currentEmployer: '',
  salary: ''
};

export const useApplicationForm = () => {
  const [formData, setFormData] = useState<ApplicationFormData>(initialFormData);
  
  const updateFormData = (field: keyof ApplicationFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  return {
    formData,
    updateFormData,
    resetForm
  };
};
