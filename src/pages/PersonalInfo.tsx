
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
    gender: '',
    country: '',
    state: '',
    program: '',
    employmentStatus: '',
    reasonForJoining: ''
  });
  const [countries, setCountries] = useState<Array<{id: number, name: string, code: string}>>([]);
  const [programs, setPrograms] = useState<Array<{id: number, name: string, description: string}>>([]);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  // African countries with their states
  const countryStates: {[key: string]: string[]} = {
    "Nigeria": ["Lagos", "Abuja", "Kano", "Rivers", "Oyo", "Kaduna", "Anambra", "Enugu", "Delta", "Imo", "Edo", "Osun", "Ogun", "Katsina", "Sokoto", "Borno", "Adamawa", "Plateau", "Cross River", "Akwa Ibom", "Ondo", "Kwara", "Abia", "Bauchi", "Taraba", "Niger", "Jigawa", "Gombe", "Kebbi", "Yobe", "Zamfara", "Nasarawa", "Kogi", "Ebonyi", "Ekiti", "Bayelsa"],
    "Ghana": ["Greater Accra", "Ashanti", "Western", "Central", "Eastern", "Volta", "Northern", "Upper East", "Upper West", "Brong-Ahafo"],
    "Kenya": ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika", "Malindi", "Kitale", "Garissa", "Kakamega", "Machakos", "Meru", "Nyeri", "Kericho", "Embu"],
    "South Africa": ["Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape", "Limpopo", "Mpumalanga", "North West", "Free State", "Northern Cape"],
    "Egypt": ["Cairo", "Alexandria", "Giza", "Shubra El-Kheima", "Port Said", "Suez", "Luxor", "Mansoura", "El-Mahalla El-Kubra", "Tanta", "Asyut", "Ismailia", "Fayyum", "Zagazig", "Aswan"],
    "Morocco": ["Casablanca", "Rabat", "Fes", "Marrakech", "Agadir", "Tangier", "Meknes", "Oujda", "Kenitra", "Tetouan", "Safi", "El Jadida", "Nador", "Beni Mellal", "Taza"]
  };

  const africanCountries = [
    "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cabo Verde", "Cameroon",
    "Central African Republic", "Chad", "Comoros", "Congo", "Democratic Republic of the Congo", 
    "Djibouti", "Egypt", "Equatorial Guinea", "Eritrea", "Eswatini", "Ethiopia", "Gabon", "Gambia",
    "Ghana", "Guinea", "Guinea-Bissau", "Ivory Coast", "Kenya", "Lesotho", "Liberia", "Libya",
    "Madagascar", "Malawi", "Mali", "Mauritania", "Mauritius", "Morocco", "Mozambique", "Namibia",
    "Niger", "Nigeria", "Rwanda", "Sao Tome and Principe", "Senegal", "Seychelles", "Sierra Leone",
    "Somalia", "South Africa", "South Sudan", "Sudan", "Tanzania", "Togo", "Tunisia", "Uganda",
    "Zambia", "Zimbabwe"
  ];

  const employmentStatuses = [
    "Employed", "Unemployed", "Self-employed", "Student", "Freelancer"
  ];

  const genderOptions = [
    "Male", "Female", "Other", "Prefer not to say"
  ];

  useEffect(() => {
    fetchCountriesAndPrograms();
    // Load saved form data if exists
    const savedData = localStorage.getItem('personalInfo');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.dateOfBirth) {
        parsed.dateOfBirth = new Date(parsed.dateOfBirth);
      }
      setFormData(parsed);
    }
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
    const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');
    return cleanPhone.length >= 7 && /^\d+$/.test(cleanPhone);
  };

  const handleInputChange = (field: string, value: string | Date | null) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Reset state when country changes
      if (field === 'country') {
        updated.state = '';
      }
      
      return updated;
    });

    // Save to localStorage on every change
    const updatedData = { ...formData, [field]: value };
    if (field === 'country') {
      updatedData.state = '';
    }
    localStorage.setItem('personalInfo', JSON.stringify(updatedData));

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
      errors.phoneNumber = "Please enter a valid phone number (minimum 7 digits)";
    }
    
    // Check other required fields
    if (!formData.fullName) errors.fullName = "Full name is required";
    if (!formData.dateOfBirth) errors.dateOfBirth = "Date of birth is required";
    if (!formData.gender) errors.gender = "Gender is required";
    if (!formData.country) errors.country = "Country is required";
    if (!formData.state) errors.state = "State is required";
    if (!formData.program) errors.program = "Program is required";
    if (!formData.employmentStatus) errors.employmentStatus = "Employment status is required";
    if (!formData.reasonForJoining) errors.reasonForJoining = "Reason for joining is required";
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before proceeding.",
        variant: "destructive"
      });
      return;
    }

    // Store form data in localStorage
    const applicationData = {
      // Personal info
      fullName: formData.fullName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      country: formData.country,
      address: formData.state, // Using state as address for compatibility
      program: formData.program,
      // Employment info
      employmentStatus: formData.employmentStatus,
      reasonForJoining: formData.reasonForJoining
    };
    
    localStorage.setItem('personalInfo', JSON.stringify(applicationData));
    
    navigate('/apply/review');
  };

  const isFormValid = () => {
    return formData.fullName && formData.email && formData.phoneNumber && 
           formData.dateOfBirth && formData.gender && formData.country && formData.state && 
           formData.program && formData.employmentStatus && formData.reasonForJoining &&
           validateEmail(formData.email) && validatePhone(formData.phoneNumber);
  };

  const getStatesForCountry = () => {
    return countryStates[formData.country] || [];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-2xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Application Information
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
                placeholder="Enter your phone number in any format"
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
              <div className="mt-1">
                <DatePicker
                  selected={formData.dateOfBirth}
                  onChange={(date: Date | null) => handleInputChange('dateOfBirth', date)}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  yearDropdownItemNumber={100}
                  scrollableYearDropdown
                  maxDate={new Date()}
                  placeholderText="Select your date of birth"
                  className={cn(
                    "w-full px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    validationErrors.dateOfBirth && "border-red-500"
                  )}
                  dateFormat="MM/dd/yyyy"
                />
              </div>
              {validationErrors.dateOfBirth && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.dateOfBirth}</p>
              )}
            </div>

            <div>
              <Label>Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger className={cn("mt-1", validationErrors.gender && "border-red-500")}>
                  <SelectValue placeholder="-- Select Gender --" />
                </SelectTrigger>
                <SelectContent>
                  {genderOptions.map((gender) => (
                    <SelectItem key={gender} value={gender}>
                      {gender}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {validationErrors.gender && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.gender}</p>
              )}
            </div>

            <div>
              <Label>Country</Label>
              <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                <SelectTrigger className={cn("mt-1", validationErrors.country && "border-red-500")}>
                  <SelectValue placeholder="-- Select Country --" />
                </SelectTrigger>
                <SelectContent>
                  {africanCountries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                  <SelectItem value="Other">Other (Not Listed)</SelectItem>
                </SelectContent>
              </Select>
              {validationErrors.country && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.country}</p>
              )}
            </div>

            <div>
              <Label>State/Region</Label>
              <Select 
                value={formData.state} 
                onValueChange={(value) => handleInputChange('state', value)}
                disabled={!formData.country || formData.country === "Other"}
              >
                <SelectTrigger className={cn("mt-1", validationErrors.state && "border-red-500")}>
                  <SelectValue placeholder={
                    !formData.country || formData.country === "Other" 
                      ? "Please select a country first" 
                      : "-- Select State/Region --"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {getStatesForCountry().map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                  {formData.country && formData.country !== "Other" && getStatesForCountry().length === 0 && (
                    <SelectItem value="Not Listed">Not Listed</SelectItem>
                  )}
                </SelectContent>
              </Select>
              {validationErrors.state && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.state}</p>
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

            <div>
              <Label>Employment Status</Label>
              <Select value={formData.employmentStatus} onValueChange={(value) => handleInputChange('employmentStatus', value)}>
                <SelectTrigger className={cn("mt-1", validationErrors.employmentStatus && "border-red-500")}>
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
              {validationErrors.employmentStatus && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.employmentStatus}</p>
              )}
            </div>

            <div>
              <Label htmlFor="reasonForJoining">Reason for Joining</Label>
              <Textarea
                id="reasonForJoining"
                placeholder="Please tell us why you want to join this program and what you hope to achieve..."
                value={formData.reasonForJoining}
                onChange={(e) => handleInputChange('reasonForJoining', e.target.value)}
                className={cn("mt-1 min-h-[120px]", validationErrors.reasonForJoining && "border-red-500")}
              />
              {validationErrors.reasonForJoining && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.reasonForJoining}</p>
              )}
            </div>
          </div>

          <div className="mt-8">
            <Button 
              onClick={handleNext}
              disabled={loading || !isFormValid()}
              className="w-full h-16 text-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 shadow-lg hover:shadow-2xl hover:shadow-green-500/40 transition-all duration-300 transform hover:scale-105 font-bold rounded-lg border-0"
            >
              {loading ? "Loading..." : "Apply Now →"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
