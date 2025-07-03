
import Navigation from "@/components/Navigation";
import ProcessCard from "@/components/ProcessCard";
import { Button } from "@/components/ui/button";
import { GraduationCap, Rocket, Clipboard } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <GraduationCap className="w-12 h-12 text-purple-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              Apply now for a BlacTech Scholarship
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Fill out your application easily! Fast approval & secure a spot.
          </p>
          <Link to="/apply/personal">
            <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-12 py-6 text-xl font-semibold rounded-lg shadow-lg hover:shadow-purple-500/50 transform hover:scale-110 transition-all duration-300">
              <Rocket className="w-6 h-6 mr-3" />
              Apply Now
            </Button>
          </Link>
        </div>
      </div>

      {/* Process Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-purple-100 p-2 rounded-full mr-3">
                <Clipboard className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 justify-items-center">
            <ProcessCard
              number="1"
              title="Apply"
              description="Complete your application with valid details in just a few minutes."
              borderColor="border-purple-500"
            />
            <ProcessCard
              number="2"
              title="Approval & Email"
              description="We review & send you a congratulatory email along with login details."
              borderColor="border-green-500"
            />
            <ProcessCard
              number="3"
              title="Pay & Access Dashboard"
              description="Make payment & unlock your dashboard for full scholarship benefits."
              borderColor="border-yellow-500"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-8 border-t">
        <div className="max-w-6xl mx-auto text-center px-6">
          <p className="text-gray-600">
            © 2025 BlacTech Scholarship Portal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
