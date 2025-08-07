import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Download, Home, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PaymentSuccess = () => {
  const [paymentData, setPaymentData] = useState<any>(null);
  const [updating, setUpdating] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const storedData = localStorage.getItem('paymentSuccessData');
    if (!storedData) {
      navigate('/payment/');
      return;
    }
    
    const data = JSON.parse(storedData);
    setPaymentData(data);
    
    // Update payment record in database
    updatePaymentRecord(data);
  }, [navigate]);

  const updatePaymentRecord = async (data: any) => {
    try {
      // Insert payment record
      const { error: insertError } = await supabase
        .from('payments')
        .insert({
          application_id: data.applicationId,
          amount_paid: data.amount,
          months_paid_for: data.monthsToPay,
          payment_reference: data.paymentReference,
          paystack_reference: data.paystackReference,
          payment_status: 'success',
          payment_date: data.paymentDate
        });

      if (insertError) {
        console.error('Error inserting payment record:', insertError);
        throw insertError;
      }

      console.log('Payment record updated successfully');
      
      // The trigger will automatically update the applications table
      toast({
        title: "Payment Recorded",
        description: "Your payment has been successfully recorded in our system.",
      });

    } catch (error: any) {
      console.error('Error updating payment record:', error);
      toast({
        title: "Database Update Error",
        description: "Payment was successful but there was an issue updating our records. Please contact support.",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  const generateReceipt = () => {
    // Simple receipt generation - in production, you might want to use a PDF library
    const receiptContent = `
      PAYMENT RECEIPT
      ================
      
      Receipt #: ${paymentData?.paymentReference}
      Date: ${new Date(paymentData?.paymentDate).toLocaleString()}
      
      Applicant: ${paymentData?.applicantName}
      Email: ${paymentData?.applicantEmail}
      
      Payment Details:
      - Months Paid: ${paymentData?.monthsToPay}
      - Amount: ₦${paymentData?.amount.toLocaleString()}
      - Payment Method: Paystack
      - Reference: ${paymentData?.paystackReference}
      
      Status: PAID
      
      Thank you for your payment!
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt_${paymentData?.paymentReference}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (!paymentData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-green-50">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">Your payment has been processed successfully</p>
        </div>

        {/* Payment Details Card */}
        <Card className="border-green-200">
          <CardHeader className="bg-green-50">
            <CardTitle className="text-green-800">Payment Confirmation</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {updating && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  Updating your payment records... Please wait.
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Receipt Number</label>
                <p className="text-gray-900 font-mono text-sm">{paymentData.paymentReference}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Payment Date</label>
                <p className="text-gray-900">{new Date(paymentData.paymentDate).toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Applicant Name</label>
                <p className="text-gray-900 font-medium">{paymentData.applicantName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-900">{paymentData.applicantEmail}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Months Paid</label>
                <p className="text-gray-900 font-medium">{paymentData.monthsToPay} Month{paymentData.monthsToPay > 1 ? 's' : ''}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Amount Paid</label>
                <p className="text-gray-900 font-bold text-xl text-green-600">
                  ₦{paymentData.amount.toLocaleString()}
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Paystack Reference</label>
              <p className="text-gray-900 font-mono text-sm">{paymentData.paystackReference}</p>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                <span>Your payment has been recorded in our system</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                <span>A confirmation email will be sent to you shortly</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                <span>You can download your receipt below</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                <span>Access your payment dashboard anytime</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={generateReceipt} variant="outline" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </Button>
          
          <Button onClick={() => navigate('/payment/dashboard')} variant="outline" className="flex-1">
            <Eye className="w-4 h-4 mr-2" />
            View Dashboard
          </Button>
          
          <Button onClick={() => navigate('/payment/')} className="flex-1">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        {/* Support Information */}
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-600">
              Need help? Contact our support team at{' '}
              <a href="mailto:support@yourdomain.com" className="text-green-600 hover:underline">
                support@yourdomain.com
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;
