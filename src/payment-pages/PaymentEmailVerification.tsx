
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mail, ArrowRight, ExternalLink } from "lucide-react";

const PaymentEmailVerification = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Check if email exists in applications table
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('email', email)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!data) {
        // Email doesn't exist, redirect to application website
        toast({
          title: "Application Not Found",
          description: "Please complete your application first before making payment.",
          variant: "destructive"
        });
        
        // Redirect to main application website after 3 seconds
        setTimeout(() => {
          window.location.href = "https://your-main-app-url.com"; // Update with actual URL
        }, 3000);
        
        return;
      }

      // Email exists, store application data and navigate to details
      localStorage.setItem('paymentApplicationData', JSON.stringify(data));
      navigate('/verify-application');

    } catch (error: any) {
      console.error('Error verifying email:', error);
      toast({
        title: "Verification Failed",
        description: "An error occurred while verifying your email. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Portal</h1>
          <p className="text-gray-600">Enter your email to access payment options</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-green-600" />
              Email Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerifyEmail} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  required
                  className="w-full"
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  "Verifying..."
                ) : (
                  <>
                    Verify & Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center mb-3">
                Haven't applied yet?
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.open("https://your-main-app-url.com", "_blank")}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Go to Application Website
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentEmailVerification;
