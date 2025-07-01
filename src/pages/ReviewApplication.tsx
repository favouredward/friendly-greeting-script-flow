
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";

const ReviewApplication = () => {
  const navigate = useNavigate();
  const [personalInfo, setPersonalInfo] = useState<any>(null);
  const [employmentInfo, setEmploymentInfo] = useState<any>(null);

  useEffect(() => {
    const personalData = localStorage.getItem('personalInfo');
    const employmentData = localStorage.getItem('employmentInfo');
    
    if (!personalData || !employmentData) {
      navigate('/apply/personal');
      return;
    }
    
    setPersonalInfo(JSON.parse(personalData));
    setEmploymentInfo(JSON.parse(employmentData));
  }, [navigate]);

  const handleSubmit = () => {
    // In a real app, this would submit to an API
    const applicationData = {
      ...personalInfo,
      ...employmentInfo,
      submittedAt: new Date().toISOString()
    };
    
    localStorage.setItem('submittedApplication', JSON.stringify(applicationData));
    navigate('/apply/success');
  };

  const handleBack = () => {
    navigate('/apply/employment');
  };

  if (!personalInfo || !employmentInfo) {
    return <div>Loading...</div>;
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-2xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Step 3: Review Your Application
        </h1>
        
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="space-y-4">
            <div className="border-b pb-2">
              <span className="font-semibold text-gray-900">Full Name:</span>
              <span className="ml-2 text-gray-700">{personalInfo.fullName}</span>
            </div>
            
            <div className="border-b pb-2">
              <span className="font-semibold text-gray-900">Email:</span>
              <span className="ml-2 text-gray-700">{personalInfo.email}</span>
            </div>
            
            <div className="border-b pb-2">
              <span className="font-semibold text-gray-900">Phone Number:</span>
              <span className="ml-2 text-gray-700">{personalInfo.phoneNumber}</span>
            </div>
            
            <div className="border-b pb-2">
              <span className="font-semibold text-gray-900">Date of Birth:</span>
              <span className="ml-2 text-gray-700">{formatDate(personalInfo.dateOfBirth)}</span>
            </div>
            
            <div className="border-b pb-2">
              <span className="font-semibold text-gray-900">Country:</span>
              <span className="ml-2 text-gray-700">{personalInfo.country}</span>
            </div>
            
            <div className="border-b pb-2">
              <span className="font-semibold text-gray-900">Address:</span>
              <span className="ml-2 text-gray-700">{personalInfo.address}</span>
            </div>
            
            <div className="border-b pb-2">
              <span className="font-semibold text-gray-900">Program:</span>
              <span className="ml-2 text-gray-700">{personalInfo.program}</span>
            </div>
            
            <div className="border-b pb-2">
              <span className="font-semibold text-gray-900">Employment Status:</span>
              <span className="ml-2 text-gray-700">{employmentInfo.employmentStatus}</span>
            </div>
            
            <div className="border-b pb-2">
              <span className="font-semibold text-gray-900">Years of Experience:</span>
              <span className="ml-2 text-gray-700">{employmentInfo.yearsOfExperience}</span>
            </div>
            
            {employmentInfo.currentEmployer && (
              <div className="border-b pb-2">
                <span className="font-semibold text-gray-900">Current Employer:</span>
                <span className="ml-2 text-gray-700">{employmentInfo.currentEmployer}</span>
              </div>
            )}
            
            {employmentInfo.salary && (
              <div className="border-b pb-2">
                <span className="font-semibold text-gray-900">Salary:</span>
                <span className="ml-2 text-gray-700">{employmentInfo.salary}</span>
              </div>
            )}
          </div>

          <div className="mt-8 flex gap-4">
            <Button 
              onClick={handleBack}
              variant="outline"
              className="flex-1"
            >
              Back
            </Button>
            <Button 
              onClick={handleSubmit}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              Confirm & Submit
            </Button>
          </div>
        </div>
      </div>
      
      <footer className="bg-white py-8 border-t mt-12">
        <div className="max-w-6xl mx-auto text-center px-6">
          <p className="text-gray-600">
            © 2025 BlacTech Scholarship Portal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ReviewApplication;
