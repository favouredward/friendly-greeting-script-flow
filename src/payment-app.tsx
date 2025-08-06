
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PaymentEmailVerification from "./payment-pages/PaymentEmailVerification";
import ApplicationDetails from "./payment-pages/ApplicationDetails";
import PaymentOptions from "./payment-pages/PaymentOptions";
import PaymentProcessing from "./payment-pages/PaymentProcessing";
import PaymentSuccess from "./payment-pages/PaymentSuccess";
import PaymentDashboard from "./payment-pages/PaymentDashboard";
import PaymentFooter from "./payment-components/PaymentFooter";

const queryClient = new QueryClient();

const PaymentApp = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<PaymentEmailVerification />} />
              <Route path="/verify-application" element={<ApplicationDetails />} />
              <Route path="/payment-options" element={<PaymentOptions />} />
              <Route path="/payment" element={<PaymentProcessing />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/dashboard" element={<PaymentDashboard />} />
            </Routes>
          </div>
          <PaymentFooter />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default PaymentApp;
