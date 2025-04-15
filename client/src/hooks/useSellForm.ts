import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  sellFormStep1Schema,
  sellFormStep2Schema,
  sellFormStep3Schema,
  sellFormSchema
} from "@/lib/utils/validators";
import type { z } from "zod";

type FormValues = z.infer<typeof sellFormSchema>;
type Step = 1 | 2 | 3;

export const useSellForm = () => {
  const [step, setStep] = useState<Step>(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();
  
  // Initialize form with the right resolver based on current step
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
  
  // Submit sell inquiry
  const submitMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await apiRequest('POST', '/api/sell', data);
      return response.json();
    },
    onSuccess: () => {
      setIsCompleted(true);
      toast({
        title: "Submission Successful",
        description: "Your car selling request has been submitted successfully.",
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
  
  // Go to next step
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
        setStep((step + 1) as Step);
      }
    } catch (error) {
      console.error("Validation error:", error);
    }
  };
  
  // Go to previous step
  const goToPreviousStep = () => {
    if (step > 1) {
      setStep((step - 1) as Step);
    }
  };
  
  // Submit form
  const submitForm = form.handleSubmit((data) => {
    submitMutation.mutate(data);
  });
  
  return {
    form,
    step,
    isCompleted,
    isPending: submitMutation.isPending,
    goToNextStep,
    goToPreviousStep,
    submitForm,
    resetForm: () => {
      form.reset();
      setStep(1);
      setIsCompleted(false);
    }
  };
};
