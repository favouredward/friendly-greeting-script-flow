
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

  const handleInputChange = (field: string, value: string | Date | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    // Store form data in localStorage for now (we'll use this in the employment step)
    localStorage.setItem('personalInfo', JSON.stringify(formData));
    navigate('/apply/employment');
  };

  const isFormValid = () => {
    return formData.fullName && formData.email && formData.phoneNumber && 
           formData.dateOfBirth && formData.country && formData.address && formData.program;
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
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Date of Birth</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1",
                      !formData.dateOfBirth && "text-muted-foreground"
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
            </div>

            <div>
              <Label>Country</Label>
              <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                <SelectTrigger className="mt-1">
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
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label>Program</Label>
              <Select value={formData.program} onValueChange={(value) => handleInputChange('program', value)}>
                <SelectTrigger className="mt-1">
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
            </div>
          </div>

          <div className="mt-8">
            <Button 
              onClick={handleNext}
              disabled={!isFormValid() || loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
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
