
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load data from localStorage
    const personal = localStorage.getItem('personalInfo');
    
    if (!personal) {
      navigate('/apply/personal');
      return;
    }

    setPersonalInfo(JSON.parse(personal));
  }, [navigate]);

  const handleSubmit = async () => {
    if (!personalInfo) return;

    setLoading(true);
    
    try {
      // Prepare the data for submission
      const applicationData = {
        full_name: personalInfo.fullName,
        email: personalInfo.email,
        phone_number: personalInfo.phoneNumber,
        date_of_birth: personalInfo.dateOfBirth,
        country: personalInfo.country,
        address: personalInfo.address, // This now contains the state
        program: personalInfo.program,
        employment_status: personalInfo.employmentStatus,
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

      // Store submitted data for success page
      localStorage.setItem('submittedApplication', JSON.stringify({
        ...personalInfo,
        applicationId: data.id,
        submittedAt: new Date().toISOString()
      }));

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

      // Clear form data from localStorage
      localStorage.removeItem('personalInfo');
      localStorage.removeItem('employmentInfo');
      
      // Navigate to success page
      navigate('/apply/success');

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
    navigate('/apply/personal');
  };

  if (!personalInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Review Your Application
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
                <label className="font-medium text-gray-700">State/Region:</label>
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
                <p className="text-gray-900">{personalInfo.employmentStatus}</p>
              </div>
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
            Back to Personal Info
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 h-14 text-lg bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 transform hover:scale-105 font-semibold"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewApplication;
