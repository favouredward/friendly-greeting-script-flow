
import { Heart } from "lucide-react";

const PaymentFooter = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Payment Portal</h3>
            <p className="text-gray-600 text-sm">
              Secure payment processing for your program applications. 
              Powered by Paystack for safe and reliable transactions.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Payment Options</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Monthly payments (₦10,000)</li>
              <li>• Flexible payment plans</li>
              <li>• Multiple payment methods</li>
              <li>• Instant payment confirmation</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Email: support@yourcompany.com</li>
              <li>Phone: +234 123 456 7890</li>
              <li>Hours: Mon-Fri 9AM-5PM</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 text-center">
          <p className="text-gray-600 text-sm flex items-center justify-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500" /> for our amazing applicants
          </p>
          <p className="text-gray-500 text-xs mt-2">
            © 2024 Payment Portal. All rights reserved. Secured by Paystack.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default PaymentFooter;
