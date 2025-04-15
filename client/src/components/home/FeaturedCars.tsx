import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import CarCard from "@/components/cars/CarCard";
import type { Car } from "@shared/schema";

const FeaturedCars = () => {
  const [activeTab, setActiveTab] = useState<'new' | 'used'>('new');
  
  // Fetch new featured cars
  const { data: newCars = [], isLoading: isLoadingNew } = useQuery<Car[]>({
    queryKey: ['/api/cars/featured', { condition: 'new' }],
  });
  
  // Fetch used featured cars
  const { data: usedCars = [], isLoading: isLoadingUsed } = useQuery<Car[]>({
    queryKey: ['/api/cars/featured', { condition: 'used' }],
  });
  
  const cars = activeTab === 'new' ? newCars : usedCars;
  const isLoading = activeTab === 'new' ? isLoadingNew : isLoadingUsed;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-3">Featured Cars</h2>
        <p className="text-gray-medium text-center mb-8">Discover our selection of premium vehicles</p>
        
        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button 
              className={`px-6 py-3 text-sm font-medium rounded-l-lg ${
                activeTab === 'new' 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-gray-medium'
              }`}
              onClick={() => setActiveTab('new')}
            >
              New Cars
            </button>
            <button 
              className={`px-6 py-3 text-sm font-medium rounded-r-lg ${
                activeTab === 'used' 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-gray-medium'
              }`}
              onClick={() => setActiveTab('used')}
            >
              Used Cars
            </button>
          </div>
        </div>
        
        {/* Cars Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="animate-pulse">
                  <div className="bg-gray-300 h-48 w-full"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-full mb-6"></div>
                    <div className="flex justify-between">
                      <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                      <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : cars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-medium">No featured {activeTab} cars available at the moment.</p>
          </div>
        )}
        
        <div className="text-center mt-10">
          <Link href="/cars">
            <Button className="inline-flex items-center bg-primary text-white px-8 py-3 rounded-md font-medium hover:bg-blue-700 transition">
              View All Cars <i className="fas fa-arrow-right ml-2"></i>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCars;
