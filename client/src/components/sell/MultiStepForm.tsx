import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  sellFormStep1Schema, 
  sellFormStep2Schema, 
  sellFormStep3Schema,
  sellFormSchema
} from "@/lib/utils/validators";
import { 
  SELLER_TYPES, 
  ACCIDENT_HISTORY, 
  CONTACT_TIMES, 
  CONTACT_METHODS, 
  YEARS, 
  CAR_BRANDS 
} from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import type { CarModel } from "@shared/schema";

type FormValues = z.infer<typeof sellFormSchema>;

const MultiStepForm = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const { toast } = useToast();

  // Initialize the form with all steps' validation schemas
  const form = useForm<FormValues>({
    resolver: zodResolver(
      step === 1 
        ? sellFormStep1Schema 
        : step === 2 
          ? sellFormStep1Schema.merge(sellFormStep2Schema) 
          : sellFormSchema
    ),
    defaultValues: {
      sellerType: undefined,
      registrationNumber: "",
      make: "",
      model: "",
      color: "",
      year: new Date().getFullYear(),
      mileage: 0,
      accidentHistory: undefined,
      askingPrice: 0,
      location: "",
      additionalNotes: "",
      fullName: "",
      email: "",
      phone: "",
      bestTimeToContact: "",
      contactMethod: undefined,
      termsAccepted: false
    }
  });

  // Legacy models fetch no longer required for free-typed model; kept disabled
  const { data: models = [] } = useQuery<CarModel[]>({
    queryKey: ['/api/models', form.watch('make')],
    enabled: false,
  });

  // Submit sell inquiry
  const submitMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await apiRequest('POST', '/api/sell', data);
      return response.json();
    },
    onSuccess: () => {
      setSubmissionComplete(true);
      toast({
        title: "Submission Successful",
        description: "Your car selling request has been submitted successfully.",
        variant: undefined
      });
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive"
      });
      console.error("Error submitting form:", error);
    }
  });

  // Handle step transitions
  const goToNextStep = async () => {
    let schemaToValidate;
    
    if (step === 1) {
      schemaToValidate = sellFormStep1Schema;
    } else if (step === 2) {
      schemaToValidate = sellFormStep2Schema;
    }
    
    try {
      if (schemaToValidate) {
        await form.trigger(Object.keys(schemaToValidate.shape) as any);
        
        if (form.formState.errors && Object.keys(form.formState.errors).length > 0) {
          return;
        }
      }
      
      if (step < 3) {
        setStep((step + 1) as 2 | 3);
      }
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  const goToPreviousStep = () => {
    if (step > 1) {
      setStep((step - 1) as 1 | 2);
    }
  };

  // Final form submission
  const onSubmit = (data: FormValues) => {
    submitMutation.mutate(data);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Progress Steps */}
      <div className="flex border-b border-gray-200">
        <div 
          className={`flex-1 text-center py-4 font-medium ${
            step === 1 
              ? 'bg-primary text-white' 
              : 'bg-gray-100 text-gray-medium'
          }`}
        >
          1. Seller Information
        </div>
        <div 
          className={`flex-1 text-center py-4 font-medium ${
            step === 2 
              ? 'bg-primary text-white' 
              : 'bg-gray-100 text-gray-medium'
          }`}
        >
          2. Vehicle Details
        </div>
        <div 
          className={`flex-1 text-center py-4 font-medium ${
            step === 3 
              ? 'bg-primary text-white' 
              : 'bg-gray-100 text-gray-medium'
          }`}
        >
          3. Contact Details
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-8">
          {/* Step 1: Seller Type */}
          {step === 1 && (
            <div>
              <FormField
                control={form.control}
                name="sellerType"
                render={({ field }) => (
                  <FormItem className="mb-6">
                    <FormLabel className="block text-gray-medium font-medium mb-2">Seller Type</FormLabel>
                    <RadioGroup 
                      onValueChange={field.onChange} 
                      value={field.value}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                    >
                      {SELLER_TYPES.map((type) => (
                        <FormItem key={type.value} className="border border-gray-300 rounded-md p-4 cursor-pointer hover:border-primary transition">
                          <FormControl>
                            <RadioGroupItem value={type.value} id={type.value} className="hidden" />
                          </FormControl>
                          <FormLabel htmlFor={type.value} className="flex flex-col items-center cursor-pointer">
                            <i className={`fas fa-${type.icon} text-3xl text-primary mb-2`}></i>
                            <span className="font-medium">{type.label}</span>
                            <p className="text-sm text-gray-medium text-center mt-1">{type.description}</p>
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end mt-8">
                <Button 
                  type="button" 
                  onClick={goToNextStep}
                  className="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition"
                >
                  Continue <i className="fas fa-arrow-right ml-2"></i>
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Vehicle Details */}
          {step === 2 && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="registrationNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-gray-medium font-medium mb-2">Registration Number</FormLabel>
                      <FormControl>
                        <Input {...field} className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="make"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-gray-medium font-medium mb-2">Make</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Audi, Toyota" className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-gray-medium font-medium mb-2">Model</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., A4, Camry, 3 Series" className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-gray-medium font-medium mb-2">Color</FormLabel>
                      <FormControl>
                        <Input {...field} className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-gray-medium font-medium mb-2">Year</FormLabel>
                      <FormControl>
                        <Select 
                          value={field.value.toString()} 
                          onValueChange={(value) => field.onChange(parseInt(value))}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {YEARS.map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="mileage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-gray-medium font-medium mb-2">Mileage</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          placeholder="Miles" 
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="accidentHistory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-gray-medium font-medium mb-2">Accident History</FormLabel>
                      <FormControl>
                        <Select 
                          value={field.value || ""}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Option" />
                          </SelectTrigger>
                          <SelectContent>
                            {ACCIDENT_HISTORY.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="askingPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-gray-medium font-medium mb-2">Asking Price ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="block text-gray-medium font-medium mb-2">Location</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="City, State" 
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="additionalNotes"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="block text-gray-medium font-medium mb-2">Additional Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          rows={4} 
                          placeholder="Please provide any other details about your vehicle..." 
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-between mt-8">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={goToPreviousStep}
                  className="border border-gray-300 text-gray-medium px-6 py-3 rounded-md font-medium hover:bg-gray-50 transition"
                >
                  <i className="fas fa-arrow-left mr-2"></i> Back
                </Button>
                <Button 
                  type="button" 
                  onClick={goToNextStep}
                  className="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition"
                >
                  Continue <i className="fas fa-arrow-right ml-2"></i>
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Contact Details */}
          {step === 3 && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-gray-medium font-medium mb-2">Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-gray-medium font-medium mb-2">Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          {...field} 
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-gray-medium font-medium mb-2">Phone Number</FormLabel>
                      <FormControl>
                        <Input 
                          type="tel" 
                          {...field} 
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="bestTimeToContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-gray-medium font-medium mb-2">Best Time to Contact</FormLabel>
                      <FormControl>
                        <Select 
                          value={field.value || ""} 
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Time" />
                          </SelectTrigger>
                          <SelectContent>
                            {CONTACT_TIMES.map((time) => (
                              <SelectItem key={time.value} value={time.value}>
                                {time.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contactMethod"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="block text-gray-medium font-medium mb-2">Preferred Contact Method</FormLabel>
                      <FormControl>
                        <RadioGroup value={field.value} onValueChange={field.onChange} className="flex space-x-4">
                          {CONTACT_METHODS.map((method) => (
                            <FormItem key={method.value} className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value={method.value} id={`contactMethod-${method.value}`} />
                              </FormControl>
                              <FormLabel htmlFor={`contactMethod-${method.value}`} className="cursor-pointer">
                                {method.label}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="termsAccepted"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox 
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id="terms"
                          />
                        </FormControl>
                        <FormLabel htmlFor="terms" className="text-gray-medium">
                          I agree to the <a href="#" className="text-primary underline">Terms and Conditions</a> and <a href="#" className="text-primary underline">Privacy Policy</a>
                        </FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-between mt-8">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={goToPreviousStep}
                  className="border border-gray-300 text-gray-medium px-6 py-3 rounded-md font-medium hover:bg-gray-50 transition"
                  disabled={submitMutation.isPending}
                >
                  <i className="fas fa-arrow-left mr-2"></i> Back
                </Button>
                <Button 
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition"
                >
                  {submitMutation.isPending ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i> Submitting...
                    </>
                  ) : (
                    <>
                      Submit <i className="fas fa-check ml-2"></i>
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
          
          {/* Success Message */}
          {submissionComplete && (
            <div className="text-center">
              <div className="bg-green-50 text-green-800 rounded-lg p-6 mb-6">
                <i className="fas fa-check-circle text-5xl text-green-500 mb-4"></i>
                <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
                <p className="mb-2">Your car selling request has been submitted successfully.</p>
                <p>Our team will review your details and contact you soon.</p>
              </div>
              
              <a 
                href="/" 
                className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition"
              >
                <i className="fas fa-home mr-2"></i> Return to Homepage
              </a>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default MultiStepForm;
