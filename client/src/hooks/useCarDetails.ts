import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRouter } from "next/router";
import type { Car } from "@shared/schema";

export const useCarDetails = (id: string | number) => {
  const router = useRouter();
  
  // Convert id to number
  const carId = typeof id === 'string' ? parseInt(id) : id;
  
  // Get car details
  const { 
    data: car, 
    isLoading,
    isError,
    error
  } = useQuery<Car>({
    queryKey: [`/api/cars/${carId}`],
    enabled: !isNaN(carId) && carId > 0,
  });
  
  // Get similar cars (same make, different model)
  const { data: similarCars = [] } = useQuery<Car[]>({
    queryKey: ['/api/cars', { 
      make: car?.make, 
      model: car?.model ? `!${car.model}` : undefined,
      limit: 3
    }],
    enabled: !!car?.make,
  });
  
  // Redirect on error or invalid ID
  useEffect(() => {
    if ((isError || (typeof id === 'string' && isNaN(parseInt(id)))) && !isLoading) {
      router.push('/cars');
    }
  }, [isError, id, isLoading, router]);
  
  // Format WhatsApp inquiry message
  const getWhatsAppLink = (phone: string): string => {
    if (!car) return '';
    
    const message = encodeURIComponent(
      `Hello, I'm interested in the ${car.title} (${car.year}) listed for $${car.price}. Can you provide more information?`
    );
    
    return `https://wa.me/${phone.replace(/\D/g, '')}?text=${message}`;
  };
  
  return {
    car,
    similarCars,
    isLoading,
    isError,
    error,
    getWhatsAppLink
  };
};
