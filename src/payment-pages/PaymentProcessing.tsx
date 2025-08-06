
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CreditCard, Shield, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PaymentProcessing = () => {
  const [paymentData, setPaymentData] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const storedData = localStorage.getItem('paymentData');
    if (!storedData) {
      navigate('/');
      return;
    }
    setPaymentData(JSON.parse(storedData));
  }, [navigate]);

  const handleBack = () => {
    navigate('/payment-options');
  };

  const initiatePaystackPayment = async () => {
    if (!paymentData) return;

    setProcessing(true);

    try {
      // Generate unique reference
      const paymentReference = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Initialize Paystack payment
      const handler = window.PaystackPop.setup({
        key: 'pk_test_your_paystack_public_key', // Replace with your actual Paystack public key
        email: paymentData.applicantEmail,
        amount: paymentData.amount * 100, // Paystack expects amount in kobo
        currency: 'NGN',
        ref: paymentReference,
        metadata: {
          applicationId: paymentData.applicationId,
          monthsToPay: paymentData.monthsToPay,
          applicantName: paymentData.applicantName
        },
        callback: function(response: any) {
          // Payment successful
          console.log('Payment successful:', response);
          
          // Store payment success data
          const successData = {
            ...paymentData,
            paymentReference: paymentReference,
            paystackReference: response.reference,
            paymentStatus: 'success',
            paymentDate: new Date().toISOString()
          };
          
          localStorage.setItem('paymentSuccessData', JSON.stringify(successData));
          
          toast({
            title: "Payment Successful!",
            description: "Your payment has been processed successfully.",
          });
          
          navigate('/payment-success');
        },
        onClose: function() {
          // Payment was closed without completion
          console.log('Payment window closed');
          setProcessing(false);
        }
      });

      handler.openIframe();
      
    } catch (error: any) {
      console.error('Error initiating payment:', error);
      toast({
        title: "Payment Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive"
      });
      setProcessing(false);
    }
  };

  if (!paymentData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={handleBack} disabled={processing}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payment Processing</h1>
            <p className="text-gray-600">Secure payment via Paystack</p>
          </div>
        </div>

        {/* Payment Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-green-600" />
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Applicant</label>
                <p className="text-gray-900 font-medium">{paymentData.applicantName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-900">{paymentData.applicantEmail}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Payment For</label>
                <p className="text-gray-900 font-medium">
                  {paymentData.monthsToPay} Month{paymentData.monthsToPay > 1 ? 's' : ''} Payment
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Amount</label>
                <p className="text-gray-900 font-bold text-xl text-green-600">
                  ₦{paymentData.amount.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Information */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <h3 className="font-medium text-blue-900 mb-1">Secure Payment</h3>
                <p className="text-sm text-blue-700">
                  Your payment is secured by Paystack with 256-bit SSL encryption. 
                  We don't store your card details on our servers.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Available Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 border rounded-lg">
                <CreditCard className="w-8 h-8 mx-auto text-gray-600 mb-2" />
                <p className="text-sm font-medium">Debit Card</p>
              </div>
              <div className="p-3 border rounded-lg">
                <CreditCard className="w-8 h-8 mx-auto text-gray-600 mb-2" />
                <p className="text-sm font-medium">Credit Card</p>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="w-8 h-8 mx-auto bg-gray-200 rounded mb-2"></div>
                <p className="text-sm font-medium">Bank Transfer</p>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="w-8 h-8 mx-auto bg-gray-200 rounded mb-2"></div>
                <p className="text-sm font-medium">USSD</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Button */}
        <div className="text-center space-y-4">
          <Button 
            onClick={initiatePaystackPayment}
            disabled={processing}
            size="lg"
            className="px-12"
          >
            {processing ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Pay ₦{paymentData.amount.toLocaleString()}
              </>
            )}
          </Button>
          
          <p className="text-sm text-gray-600">
            By clicking "Pay", you agree to our terms and conditions
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessing;
