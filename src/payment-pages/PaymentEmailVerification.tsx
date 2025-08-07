
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowRight, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PaymentEmailVerification = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Configuration - Update these URLs as needed
  const MAIN_APPLICATION_URL = "https://your-main-application.com"; // Update this to your main application URL
  const SUPPORT_EMAIL = "support@yourdomain.com"; // Update this to your support email

  const handleEmailVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to continue.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Verifying email:', email);
      
      // Call the verify-applicant edge function
      const { data, error } = await supabase.functions.invoke('verify-applicant', {
        body: { email: email.trim().toLowerCase() }
      });

      console.log('Verification response:', data, error);

      if (error) {
        console.error('Error verifying email:', error);
        toast({
          title: "Verification Error",
          description: "Unable to verify your email. Please try again or contact support.",
          variant: "destructive"
        });
        return;
      }

      if (data?.exists && data?.applicationData) {
        // Email exists, store application data and proceed
        localStorage.setItem('paymentApplicationData', JSON.stringify(data.applicationData));
        toast({
          title: "Email Verified!",
          description: "Your application has been found. Proceeding to payment options.",
        });
        navigate('/payment/verify-application');
      } else {
        // Email doesn't exist, show redirect option
        toast({
          title: "Application Not Found",
          description: "No application found with this email. Please complete your application first.",
          variant: "destructive"
        });
      }

    } catch (error: any) {
      console.error('Unexpected error:', error);
      toast({
        title: "System Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRedirectToApplication = () => {
    // Redirect to main application website
    window.open(MAIN_APPLICATION_URL, '_blank');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Portal</h1>
          <p className="text-gray-600">Enter your email to access payment options</p>
        </div>

        {/* Email Verification Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Verify Your Email</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailVerification} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
                size="lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify Email
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Application Not Found Help */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <h3 className="font-medium text-yellow-800 mb-2">Don't have an application yet?</h3>
            <p className="text-sm text-yellow-700 mb-3">
              If you haven't submitted your application, please complete it first before making any payments.
            </p>
            <Button 
              variant="outline" 
              onClick={handleRedirectToApplication}
              className="w-full bg-white hover:bg-yellow-50"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Go to Application Portal
            </Button>
          </CardContent>
        </Card>

        {/* Support Information */}
        <div className="text-center text-sm text-gray-600">
          <p>
            Need help? Contact us at{' '}
            <a 
              href={`mailto:${SUPPORT_EMAIL}`} 
              className="text-green-600 hover:underline"
            >
              {SUPPORT_EMAIL}
            </a>
          </p>
        </div>

        {/* Security Notice */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            🔒 Your payment information is secured with 256-bit SSL encryption
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentEmailVerification;
