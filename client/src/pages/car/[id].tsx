import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import ImageCarousel from "@/components/car/ImageCarousel";
import CarDetailInfo from "@/components/car/CarDetailInfo";
import CarCard from "@/components/cars/CarCard";
import type { Car } from "@shared/schema";

const CarDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  
  // Fetch car details
  const { data: car, isLoading, isError } = useQuery<Car>({
    queryKey: [`/api/cars/${id}`],
    enabled: !!id,
  });
  
  // Fetch similar cars (same make, different model)
  const { data: similarCars = [] } = useQuery<Car[]>({
    queryKey: ['/api/cars', { make: car?.make, model: car?.model ? `!${car.model}` : undefined }],
    enabled: !!car?.make,
  });
  
  // Redirect if error or invalid ID
  useEffect(() => {
    if (isError || (id && typeof id === 'string' && isNaN(parseInt(id)))) {
      router.push('/cars');
    }
  }, [isError, id, router]);

  // Loading state
  if (isLoading) {
    return (
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden p-8 animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-300 h-96 rounded-lg"></div>
              <div>
                <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
                <div className="h-10 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-300 rounded"></div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <div className="h-12 bg-gray-300 rounded flex-1"></div>
                  <div className="h-12 bg-gray-300 rounded flex-1"></div>
                </div>
                <div className="h-40 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  if (!car) return null;

  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="mb-6 text-sm">
          <Link href="/">
            <a className="text-primary hover:underline">Home</a>
          </Link>
          <span className="mx-2 text-gray-medium">/</span>
          <Link href="/cars">
            <a className="text-primary hover:underline">Cars</a>
          </Link>
          <span className="mx-2 text-gray-medium">/</span>
          <span className="text-gray-medium">{car.title}</span>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Car Image Carousel */}
            <ImageCarousel images={car.images || []} alt={car.title} />
            
            {/* Car Details */}
            <CarDetailInfo car={car} />
          </div>
          
          {/* Detailed Description */}
          <div className="px-8 pb-8">
            <h2 className="text-2xl font-bold mb-4">Description</h2>
            {car.description ? (
              <p className="text-gray-medium mb-4">{car.description}</p>
            ) : (
              <p className="text-gray-medium mb-4">No detailed description available for this vehicle.</p>
            )}
            
            {/* Features List */}
            {car.features && car.features.length > 0 && (
              <>
                <h2 className="text-2xl font-bold mt-8 mb-4">Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-4">
                  {car.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <i className="fas fa-check text-primary mr-2"></i>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Similar Cars */}
        {similarCars.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Similar Vehicles</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarCars.slice(0, 3).map(car => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CarDetailsPage;
