
import Navigation from "@/components/Navigation";
import ProcessCard from "@/components/ProcessCard";
import { Button } from "@/components/ui/button";
import { Monitor, Rocket, Clipboard, Code, Cpu, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 py-8 md:py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center mb-8 md:mb-12">
            {/* Creative Tech Icon Stack */}
            <div className="relative mb-8 md:mb-12"> {/* Increased margin-bottom for better spacing */}
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-4 md:p-6 rounded-2xl shadow-lg">
                <div className="relative">
                  <Monitor className="w-16 h-16 md:w-20 md:h-20 text-purple-600" />
                  <Code className="absolute -top-2 -right-2 w-8 h-8 md:w-10 md:h-10 text-green-600 bg-white rounded-full p-1 shadow-md" />
                  <Cpu className="absolute -bottom-2 -left-2 w-8 h-8 md:w-10 md:h-10 text-blue-600 bg-white rounded-full p-1 shadow-md" />
                  <Zap className="absolute top-1/2 -right-4 w-6 h-6 md:w-8 md:h-8 text-yellow-500 bg-white rounded-full p-1 shadow-md" />
                </div>
              </div>
            </div>
            
            {/* Text Content - now properly centered */}
            <div className="text-center w-full">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4">
                Application Open!
              </h1>
              <p className="text-lg md:text-xl text-black mx-auto max-w-2xl">
                Apply now to join our next batch for The Tech Career and Upskilling Program.
              </p>
            </div>
          </div>
          
          {/* Button - centered */}
          <div className="text-center">
            <Link to="/apply/personal">
              <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 md:px-12 py-4 md:py-6 text-lg md:text-xl font-semibold rounded-lg shadow-lg hover:shadow-green-500/50 transform hover:scale-105 transition-all duration-300">
                <Rocket className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3" />
                Apply Now
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-8 md:mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-purple-100 p-2 rounded-full mr-3">
                <Clipboard className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">How It Works</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 justify-items-center">
            <ProcessCard
              number="1"
              title="Apply"
              description="Complete your application with valid details in just a few minutes."
              borderColor="border-purple-500"
            />
            <ProcessCard
              number="2"
              title="Approval & Email"
              description="We review & send you a congratulatory email along with program details."
              borderColor="border-green-500"
            />
            <ProcessCard
              number="3"
              title="Pay & Access Dashboard"
              description="Make payment & unlock your dashboard for full training benefits."
              borderColor="border-yellow-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
