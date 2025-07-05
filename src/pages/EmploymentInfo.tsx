
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const EmploymentInfo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employmentStatus: '',
    yearsOfExperience: '',
    currentEmployer: ''
  });

  useEffect(() => {
    // Check if personal info exists
    const personalInfo = localStorage.getItem('personalInfo');
    if (!personalInfo) {
      navigate('/apply/personal');
    }
  }, [navigate]);

  const employmentStatuses = [
    "Employed", "Unemployed", "Self-employed", "Student", "Freelancer"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    // Store employment data
    localStorage.setItem('employmentInfo', JSON.stringify(formData));
    navigate('/apply/review');
  };

  const handleBack = () => {
    navigate('/apply/personal');
  };

  const isFormValid = () => {
    return formData.employmentStatus && formData.yearsOfExperience;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-2xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Step 2: Employment Information
        </h1>
        
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="space-y-6">
            <div>
              <Label>Employment Status</Label>
              <Select value={formData.employmentStatus} onValueChange={(value) => handleInputChange('employmentStatus', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="-- Select Employment Status --" />
                </SelectTrigger>
                <SelectContent>
                  {employmentStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="yearsOfExperience">Years of Experience</Label>
              <Input
                id="yearsOfExperience"
                type="number"
                min="0"
                value={formData.yearsOfExperience}
                onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="currentEmployer">Current/Previous Employer (Optional)</Label>
              <Input
                id="currentEmployer"
                type="text"
                value={formData.currentEmployer}
                onChange={(e) => handleInputChange('currentEmployer', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <Button 
              onClick={handleBack}
              variant="outline"
              className="flex-1"
            >
              Back
            </Button>
            <Button 
              onClick={handleNext}
              disabled={!isFormValid()}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
            >
              Next: Review Application
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmploymentInfo;
