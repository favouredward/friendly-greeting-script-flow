
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, Calendar, MapPin, GraduationCap, Briefcase, ArrowRight, ArrowLeft } from "lucide-react";

const ApplicationDetails = () => {
  const [applicationData, setApplicationData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem('paymentApplicationData');
    if (!storedData) {
      navigate('/');
      return;
    }
    setApplicationData(JSON.parse(storedData));
  }, [navigate]);

  const handleProceedToPayment = () => {
    navigate('/payment-options');
  };

  const handleBack = () => {
    navigate('/');
  };

  if (!applicationData) {
    return <div>Loading...</div>;
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'fully_paid':
        return 'bg-green-100 text-green-800';
      case 'partially_paid':
        return 'bg-yellow-100 text-yellow-800';
      case 'unpaid':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'fully_paid':
        return 'Fully Paid';
      case 'partially_paid':
        return 'Partially Paid';
      case 'unpaid':
        return 'Unpaid';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Application Details</h1>
            <p className="text-gray-600">Review your application and proceed to payment</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-green-600" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Full Name</label>
                <p className="text-gray-900 font-medium">{applicationData.full_name}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900">{applicationData.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-gray-900">{applicationData.phone_number}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                  <p className="text-gray-900">{new Date(applicationData.date_of_birth).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <div>
                  <label className="text-sm font-medium text-gray-600">Location</label>
                  <p className="text-gray-900">{applicationData.address}, {applicationData.country}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Program & Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-green-600" />
                Program & Payment Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Program</label>
                <p className="text-gray-900 font-medium">{applicationData.program}</p>
              </div>

              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-gray-500" />
                <div>
                  <label className="text-sm font-medium text-gray-600">Employment Status</label>
                  <p className="text-gray-900">{applicationData.employment_status}</p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-600">Payment Status</label>
                <div className="space-y-2">
                  <Badge className={getPaymentStatusColor(applicationData.payment_status)}>
                    {getPaymentStatusText(applicationData.payment_status)}
                  </Badge>
                  
                  <div className="text-sm text-gray-600">
                    <p>Months Paid: <span className="font-medium text-gray-900">{applicationData.months_paid || 0} / 4</span></p>
                    <p>Total Paid: <span className="font-medium text-gray-900">₦{(applicationData.total_amount_paid || 0).toLocaleString()}</span></p>
                    <p>Remaining: <span className="font-medium text-red-600">₦{((4 - (applicationData.months_paid || 0)) * 10000).toLocaleString()}</span></p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reason for Joining */}
        <Card>
          <CardHeader>
            <CardTitle>Reason for Joining</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap">{applicationData.reason_for_joining}</p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          {applicationData.payment_status !== 'fully_paid' && (
            <Button 
              onClick={handleProceedToPayment}
              size="lg"
              className="px-8"
            >
              Proceed to Payment
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            size="lg"
          >
            View Payment History
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
