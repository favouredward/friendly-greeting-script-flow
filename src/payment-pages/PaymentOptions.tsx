import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CreditCard, Calendar, CheckCircle } from "lucide-react";

const PaymentOptions = () => {
  const [applicationData, setApplicationData] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState<number>(1);
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem('paymentApplicationData');
    if (!storedData) {
      navigate('/payment/');
      return;
    }
    setApplicationData(JSON.parse(storedData));
  }, [navigate]);

  const handleBack = () => {
    navigate('/payment/verify-application');
  };

  const handleProceedToPayment = () => {
    const paymentData = {
      applicationId: applicationData.id,
      monthsToPay: selectedOption,
      amount: selectedOption * 10000,
      applicantEmail: applicationData.email,
      applicantName: applicationData.full_name
    };
    
    localStorage.setItem('paymentData', JSON.stringify(paymentData));
    navigate('/payment/payment');
  };

  if (!applicationData) {
    return <div>Loading...</div>;
  }

  const monthsPaid = applicationData.months_paid || 0;
  const remainingMonths = 4 - monthsPaid;

  const paymentOptions = [
    {
      months: 1,
      amount: 10000,
      title: "1 Month Payment",
      description: "Pay for one month",
      popular: false
    },
    {
      months: 2,
      amount: 20000,
      title: "2 Months Payment",
      description: "Pay for two months",
      popular: remainingMonths >= 2
    },
    {
      months: Math.min(remainingMonths, 4),
      amount: Math.min(remainingMonths, 4) * 10000,
      title: `${Math.min(remainingMonths, 4)} Month${Math.min(remainingMonths, 4) > 1 ? 's' : ''} Payment`,
      description: `Pay remaining ${Math.min(remainingMonths, 4)} month${Math.min(remainingMonths, 4) > 1 ? 's' : ''}`,
      popular: remainingMonths <= 4
    }
  ];

  const validOptions = paymentOptions.filter(option => 
    option.months <= remainingMonths && option.months > 0
  );

  if (remainingMonths <= 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Complete!</h2>
            <p className="text-gray-600 mb-4">
              You have already completed all payments for your program.
            </p>
            <Button onClick={() => navigate('/payment/dashboard')}>
              View Payment History
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payment Options</h1>
            <p className="text-gray-600">Choose how many months you'd like to pay for</p>
          </div>
        </div>

        {/* Current Status */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700">Payment Progress</p>
                <p className="text-lg font-semibold text-green-900">
                  {monthsPaid} of 4 months completed
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-green-700">Remaining</p>
                <p className="text-lg font-semibold text-green-900">
                  ₦{(remainingMonths * 10000).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Options */}
        <div className="grid md:grid-cols-3 gap-4">
          {validOptions.map((option) => (
            <Card 
              key={option.months}
              className={`cursor-pointer transition-all ${
                selectedOption === option.months 
                  ? 'ring-2 ring-green-500 border-green-500' 
                  : 'hover:shadow-md'
              } ${option.popular ? 'relative' : ''}`}
              onClick={() => setSelectedOption(option.months)}
            >
              {option.popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-600">
                  Recommended
                </Badge>
              )}
              <CardHeader className="text-center pb-2">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  {option.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    ₦{option.amount.toLocaleString()}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• ₦10,000 per month</p>
                  <p>• Secure payment processing</p>
                  <p>• Instant confirmation</p>
                  {option.months > 1 && (
                    <p className="text-green-600 font-medium">
                      • Pay in advance & secure your spot
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Payment Summary */}
        <Card className="bg-gray-50 border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-green-600" />
              Payment Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Selected Plan:</span>
                <span className="font-medium">{selectedOption} Month{selectedOption > 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-medium">₦{(selectedOption * 10000).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Payment Method:</span>
                <span>Paystack (Card, Bank Transfer, USSD)</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-green-600">₦{(selectedOption * 10000).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Proceed Button */}
        <div className="text-center">
          <Button 
            onClick={handleProceedToPayment}
            size="lg"
            className="px-12"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Proceed to Payment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentOptions;
