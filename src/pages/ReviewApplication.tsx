
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ReviewApplication = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [personalInfo, setPersonalInfo] = useState<any>(null);
  const [employmentInfo, setEmploymentInfo] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async () => {
    if (!personalInfo || !employmentInfo) return;
    
    setSubmitting(true);
    
    try {
      // Prepare the application data for Supabase
      const applicationData = {
        full_name: personalInfo.fullName,
        email: personalInfo.email,
        phone_number: personalInfo.phoneNumber,
        date_of_birth: personalInfo.dateOfBirth,
        country: personalInfo.country,
        address: personalInfo.address,
        program: personalInfo.program,
        employment_status: employmentInfo.employmentStatus,
        years_of_experience: parseInt(employmentInfo.yearsOfExperience) || 0,
        current_employer: employmentInfo.currentEmployer || null,
        salary: employmentInfo.salary || null,
        status: 'submitted'
      };

      console.log('Submitting application:', applicationData);

      const { data, error } = await supabase
        .from('applications')
        .insert(applicationData)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Application submitted successfully:', data);

      // Store the submitted application data for the success page
      const completeApplicationData = {
        ...personalInfo,
        ...employmentInfo,
        submittedAt: new Date().toISOString(),
        applicationId: data.id
      };
      
      localStorage.setItem('submittedApplication', JSON.stringify(completeApplicationData));
      
      // Clear form data
      localStorage.removeItem('personalInfo');
      localStorage.removeItem('employmentInfo');
      
      toast({
        title: "Success!",
        description: "Your application has been submitted successfully.",
      });

      navigate('/apply/success');
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
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
              disabled={submitting}
            >
              Back
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              {submitting ? "Submitting..." : "Confirm & Submit"}
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
