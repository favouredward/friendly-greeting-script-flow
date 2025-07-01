
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const SuccessPage = () => {
  const navigate = useNavigate();
  const [applicationData, setApplicationData] = useState<any>(null);

  useEffect(() => {
    const submittedData = localStorage.getItem('submittedApplication');
    
    if (!submittedData) {
      navigate('/apply/personal');
      return;
    }
    
    setApplicationData(JSON.parse(submittedData));
  }, [navigate]);

  if (!applicationData) {
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
      
      <div className="max-w-3xl mx-auto py-12 px-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-600 mb-4">
            Application Submitted Successfully
          </h1>
          <h2 className="text-2xl font-semibold text-green-700 mb-2">
            Thank you, {applicationData.fullName}, for your application!
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We have received your information and will review it soon. You will be contacted at {applicationData.email} with further details.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Application Details:</h3>
          
          <div className="space-y-3">
            <div className="flex">
              <span className="font-semibold text-gray-900 w-40">Full Name:</span>
              <span className="text-gray-700">{applicationData.fullName}</span>
            </div>
            
            <div className="flex">
              <span className="font-semibold text-gray-900 w-40">Email:</span>
              <span className="text-gray-700">{applicationData.email}</span>
            </div>
            
            <div className="flex">
              <span className="font-semibold text-gray-900 w-40">Phone Number:</span>
              <span className="text-gray-700">{applicationData.phoneNumber}</span>
            </div>
            
            <div className="flex">
              <span className="font-semibold text-gray-900 w-40">Date of Birth:</span>
              <span className="text-gray-700">{formatDate(applicationData.dateOfBirth)}</span>
            </div>
            
            <div className="flex">
              <span className="font-semibold text-gray-900 w-40">Country:</span>
              <span className="text-gray-700">{applicationData.country}</span>
            </div>
            
            <div className="flex">
              <span className="font-semibold text-gray-900 w-40">Address:</span>
              <span className="text-gray-700">{applicationData.address}</span>
            </div>
            
            <div className="flex">
              <span className="font-semibold text-gray-900 w-40">Program:</span>
              <span className="text-gray-700">{applicationData.program}</span>
            </div>
            
            <div className="flex">
              <span className="font-semibold text-gray-900 w-40">Employment Status:</span>
              <span className="text-gray-700">{applicationData.employmentStatus}</span>
            </div>
            
            <div className="flex">
              <span className="font-semibold text-gray-900 w-40">Years of Experience:</span>
              <span className="text-gray-700">{applicationData.yearsOfExperience}</span>
            </div>
            
            {applicationData.currentEmployer && (
              <div className="flex">
                <span className="font-semibold text-gray-900 w-40">Current Employer:</span>
                <span className="text-gray-700">{applicationData.currentEmployer}</span>
              </div>
            )}
            
            {applicationData.salary && (
              <div className="flex">
                <span className="font-semibold text-gray-900 w-40">Salary:</span>
                <span className="text-gray-700">{applicationData.salary}</span>
              </div>
            )}
          </div>
          
          <div className="mt-8 text-center">
            <Link to="/">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <footer className="bg-white py-8 border-t">
        <div className="max-w-6xl mx-auto text-center px-6">
          <p className="text-gray-600">
            © 2025 BlacTech Scholarship Portal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SuccessPage;
