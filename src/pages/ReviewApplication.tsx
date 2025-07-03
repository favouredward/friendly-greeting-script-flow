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
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

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

  const validateInputs = () => {
    const errors: {[key: string]: string} = {};
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(personalInfo.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    // Phone validation (basic check for numbers and common formats)
    const phoneRegex = /^[\+]?[1-9][\d]{3,14}$/;
    const cleanPhone = personalInfo.phoneNumber.replace(/[\s\-\(\)]/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      errors.phone = "Please enter a valid phone number";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!personalInfo || !employmentInfo) return;
    
    // Validate inputs before submitting
    if (!validateInputs()) {
      toast({
        title: "Validation Error",
        description: "Please check your email and phone number format.",
        variant: "destructive"
      });
      return;
    }
    
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

      // Send email notification
      try {
        const { error: emailError } = await supabase.functions.invoke('send-application-notification', {
          body: {
            applicationData: {
              id: data.id,
              full_name: data.full_name,
              email: data.email,
              program: data.program,
              created_at: data.created_at
            }
          }
        });

        if (emailError) {
          console.error('Email sending error:', emailError);
          // Don't fail the whole process if email fails
        } else {
          console.log('Email notification sent successfully');
        }
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
        // Continue with success flow even if email fails
      }

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
        description: "Your application has been submitted successfully. Check your email for confirmation.",
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
              {validationErrors.email && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
              )}
            </div>
            
            <div className="border-b pb-2">
              <span className="font-semibold text-gray-900">Phone Number:</span>
              <span className="ml-2 text-gray-700">{personalInfo.phoneNumber}</span>
              {validationErrors.phone && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
              )}
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
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
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
