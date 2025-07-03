
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const ReviewApplication = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [personalInfo, setPersonalInfo] = useState<any>(null);
  const [employmentInfo, setEmploymentInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load data from localStorage
    const personal = localStorage.getItem('personalInfo');
    const employment = localStorage.getItem('employmentInfo');
    
    if (!personal) {
      navigate('/apply/personal');
      return;
    }
    
    if (!employment) {
      navigate('/apply/employment');
      return;
    }

    setPersonalInfo(JSON.parse(personal));
    setEmploymentInfo(JSON.parse(employment));
  }, [navigate]);

  const handleSubmit = async () => {
    if (!personalInfo || !employmentInfo) return;

    setLoading(true);
    
    try {
      // Prepare the data for submission
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

      // Submit to database
      const { data, error } = await supabase
        .from('applications')
        .insert([applicationData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      console.log('Application submitted successfully:', data);

      // Send notification email
      try {
        const { error: emailError } = await supabase.functions.invoke('send-application-notification', {
          body: {
            applicantName: personalInfo.fullName,
            applicantEmail: personalInfo.email,
            program: personalInfo.program,
            applicationId: data.id
          }
        });

        if (emailError) {
          console.error('Email notification error:', emailError);
          // Don't fail the whole process if email fails
        }
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
      }

      toast({
        title: "Application Submitted Successfully!",
        description: "Thank you for your application. You will receive a confirmation email shortly.",
      });

      // Clear localStorage and refresh the application
      localStorage.removeItem('personalInfo');
      localStorage.removeItem('employmentInfo');
      
      // Navigate to success page, then refresh after a delay
      navigate('/success');
      
      // Auto-refresh the application after 3 seconds
      setTimeout(() => {
        window.location.reload();
      }, 3000);

    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "There was an error submitting your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/apply/employment');
  };

  if (!personalInfo || !employmentInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Step 3: Review Your Application
        </h1>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Personal Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-purple-600">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="font-medium text-gray-700">Full Name:</label>
                <p className="text-gray-900">{personalInfo.fullName}</p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Email:</label>
                <p className="text-gray-900">{personalInfo.email}</p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Phone Number:</label>
                <p className="text-gray-900">{personalInfo.phoneNumber}</p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Date of Birth:</label>
                <p className="text-gray-900">
                  {personalInfo.dateOfBirth ? format(new Date(personalInfo.dateOfBirth), 'MM/dd/yyyy') : 'Not provided'}
                </p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Country:</label>
                <p className="text-gray-900">{personalInfo.country}</p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Address:</label>
                <p className="text-gray-900">{personalInfo.address}</p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Program:</label>
                <p className="text-gray-900">{personalInfo.program}</p>
              </div>
            </CardContent>
          </Card>

          {/* Employment Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-purple-600">Employment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="font-medium text-gray-700">Employment Status:</label>
                <p className="text-gray-900">{employmentInfo.employmentStatus}</p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Years of Experience:</label>
                <p className="text-gray-900">{employmentInfo.yearsOfExperience}</p>
              </div>
              {employmentInfo.currentEmployer && (
                <div>
                  <label className="font-medium text-gray-700">Current/Previous Employer:</label>
                  <p className="text-gray-900">{employmentInfo.currentEmployer}</p>
                </div>
              )}
              {employmentInfo.salary && (
                <div>
                  <label className="font-medium text-gray-700">Salary Information:</label>
                  <p className="text-gray-900">{employmentInfo.salary}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4">
          <Button 
            onClick={handleBack}
            variant="outline"
            className="flex-1"
            disabled={loading}
          >
            Back to Employment Info
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewApplication;
