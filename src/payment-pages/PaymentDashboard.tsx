import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, CreditCard, Calendar, Download, Eye, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PaymentDashboard = () => {
  const [applicationData, setApplicationData] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const storedData = localStorage.getItem('paymentApplicationData');
    if (!storedData) {
      navigate('/');
      return;
    }
    
    const appData = JSON.parse(storedData);
    setApplicationData(appData);
    if (appData.email) {
      loadPaymentHistory(appData.email);
    }
  }, [navigate]);

  const loadPaymentHistory = async (email: string) => {
    try {
      // Set the email context for RLS policy - handle potential errors
      try {
        await supabase.rpc('set_config', {
          setting_name: 'app.current_user_email',
          setting_value: email,
          is_local: true
        });
      } catch (configError) {
        console.log('Config setting not available, continuing without it:', configError);
      }

      // Fetch payments for this application
      const { data: paymentData, error } = await supabase
        .from('payments')
        .select('*')
        .eq('application_id', applicationData?.id)
        .order('payment_date', { ascending: false });

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setPayments(paymentData || []);

      // Refresh application data to get latest payment status
      const { data: appData, error: appError } = await supabase
        .from('applications')
        .select('*')
        .eq('email', email)
        .single();

      if (appError && appError.code !== 'PGRST116') {
        throw appError;
      }

      if (appData) {
        setApplicationData(appData);
        localStorage.setItem('paymentApplicationData', JSON.stringify(appData));
      }

    } catch (error: any) {
      console.error('Error loading payment history:', error);
      toast({
        title: "Loading Error",
        description: "Unable to load payment history. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/verify-application');
  };

  const handleMakePayment = () => {
    navigate('/payment-options');
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getApplicationStatusColor = (status: string) => {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Loading payment dashboard...</p>
        </div>
      </div>
    );
  }

  if (!applicationData) {
    return <div>No application data found</div>;
  }

  const monthsPaid = applicationData.months_paid || 0;
  const totalPaid = applicationData.total_amount_paid || 0;
  const remainingMonths = 4 - monthsPaid;
  const remainingAmount = remainingMonths * 10000;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payment Dashboard</h1>
            <p className="text-gray-600">Track your payment history and status</p>
          </div>
        </div>

        {/* Payment Status Overview */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="w-5 h-5 text-green-600" />
                Payment Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge className={getApplicationStatusColor(applicationData.payment_status)}>
                  {applicationData.payment_status === 'fully_paid' ? 'Fully Paid' :
                   applicationData.payment_status === 'partially_paid' ? 'Partially Paid' : 'Unpaid'}
                </Badge>
                <p className="text-2xl font-bold text-gray-900">{monthsPaid} / 4</p>
                <p className="text-sm text-gray-600">Months Completed</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="w-5 h-5 text-green-600" />
                Total Paid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-green-600">
                  ₦{totalPaid.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Out of ₦40,000</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                Remaining Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-red-600">
                  ₦{remainingAmount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">{remainingMonths} months left</p>
                {remainingMonths > 0 && (
                  <Button size="sm" onClick={handleMakePayment} className="mt-2">
                    <Plus className="w-3 h-3 mr-1" />
                    Make Payment
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            {payments.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No payments found</p>
                <Button onClick={handleMakePayment}>
                  <Plus className="w-4 h-4 mr-2" />
                  Make Your First Payment
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div key={payment.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Badge className={getPaymentStatusColor(payment.payment_status)}>
                          {payment.payment_status.charAt(0).toUpperCase() + payment.payment_status.slice(1)}
                        </Badge>
                        <span className="font-medium">
                          ₦{Number(payment.amount_paid).toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-600">
                          for {payment.months_paid_for} month{payment.months_paid_for > 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(payment.payment_date).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Reference: </span>
                        <span className="font-mono">{payment.payment_reference}</span>
                      </div>
                      {payment.paystack_reference && (
                        <div>
                          <span className="text-gray-600">Paystack Ref: </span>
                          <span className="font-mono">{payment.paystack_reference}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3 mr-1" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-3 h-3 mr-1" />
                        Receipt
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Progress Bar */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{monthsPaid}/4 months ({Math.round((monthsPaid/4) * 100)}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(monthsPaid/4) * 100}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-4">
                {[1, 2, 3, 4].map((month) => (
                  <div 
                    key={month}
                    className={`text-center p-2 rounded ${
                      month <= monthsPaid 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <div className="text-sm font-medium">Month {month}</div>
                    <div className="text-xs">
                      {month <= monthsPaid ? '✓ Paid' : 'Pending'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentDashboard;
