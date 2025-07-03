
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PersonalInfo = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: null as Date | null,
    country: '',
    address: '',
    program: ''
  });
  const [countries, setCountries] = useState<Array<{id: number, name: string, code: string}>>([]);
  const [programs, setPrograms] = useState<Array<{id: number, name: string, description: string}>>([]);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    fetchCountriesAndPrograms();
  }, []);

  const fetchCountriesAndPrograms = async () => {
    try {
      const [countriesResponse, programsResponse] = await Promise.all([
        supabase.from('countries').select('*').order('name'),
        supabase.from('programs').select('*').eq('is_active', true).order('name')
      ]);

      if (countriesResponse.data) setCountries(countriesResponse.data);
      if (programsResponse.data) setPrograms(programsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load form data. Please refresh the page.",
        variant: "destructive"
      });
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\+]?[1-9][\d]{3,14}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone);
  };

  const handleInputChange = (field: string, value: string | Date | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleNext = () => {
    const errors: {[key: string]: string} = {};
    
    // Validate email
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    // Validate phone number
    if (!formData.phoneNumber) {
      errors.phoneNumber = "Phone number is required";
    } else if (!validatePhone(formData.phoneNumber)) {
      errors.phoneNumber = "Please enter a valid phone number";
    }
    
    // Check other required fields
    if (!formData.fullName) errors.fullName = "Full name is required";
    if (!formData.dateOfBirth) errors.dateOfBirth = "Date of birth is required";
    if (!formData.country) errors.country = "Country is required";
    if (!formData.address) errors.address = "Address is required";
    if (!formData.program) errors.program = "Program is required";
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before proceeding.",
        variant: "destructive"
      });
      return;
    }

    // Store form data in localStorage for now (we'll use this in the employment step)
    localStorage.setItem('personalInfo', JSON.stringify(formData));
    navigate('/apply/employment');
  };

  const isFormValid = () => {
    return formData.fullName && formData.email && formData.phoneNumber && 
           formData.dateOfBirth && formData.country && formData.address && formData.program &&
           validateEmail(formData.email) && validatePhone(formData.phoneNumber);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-2xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Step 1: Personal Information
        </h1>
        
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="space-y-6">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className={cn("mt-1", validationErrors.fullName && "border-red-500")}
              />
              {validationErrors.fullName && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.fullName}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={cn("mt-1", validationErrors.email && "border-red-500")}
              />
              {validationErrors.email && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className={cn("mt-1", validationErrors.phoneNumber && "border-red-500")}
              />
              {validationErrors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.phoneNumber}</p>
              )}
            </div>

            <div>
              <Label>Date of Birth</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1",
                      !formData.dateOfBirth && "text-muted-foreground",
                      validationErrors.dateOfBirth && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dateOfBirth ? format(formData.dateOfBirth, "MM/dd/yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.dateOfBirth || undefined}
                    onSelect={(date) => handleInputChange('dateOfBirth', date || null)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {validationErrors.dateOfBirth && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.dateOfBirth}</p>
              )}
            </div>

            <div>
              <Label>Country</Label>
              <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                <SelectTrigger className={cn("mt-1", validationErrors.country && "border-red-500")}>
                  <SelectValue placeholder="-- Select Country --" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.id} value={country.name}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {validationErrors.country && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.country}</p>
              )}
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className={cn("mt-1", validationErrors.address && "border-red-500")}
                rows={3}
              />
              {validationErrors.address && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.address}</p>
              )}
            </div>

            <div>
              <Label>Program</Label>
              <Select value={formData.program} onValueChange={(value) => handleInputChange('program', value)}>
                <SelectTrigger className={cn("mt-1", validationErrors.program && "border-red-500")}>
                  <SelectValue placeholder="-- Select Program --" />
                </SelectTrigger>
                <SelectContent>
                  {programs.map((program) => (
                    <SelectItem key={program.id} value={program.name}>
                      {program.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {validationErrors.program && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.program}</p>
              )}
            </div>
          </div>

          <div className="mt-8">
            <Button 
              onClick={handleNext}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
            >
              {loading ? "Loading..." : "Next: Employment Info"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
