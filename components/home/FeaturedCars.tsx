import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CarCard from "@/components/cars/CarCard";
import type { Car } from "@shared/schema";

interface FeaturedCarsProps {
  featuredCars: Car[];
}

const FeaturedCars = ({ featuredCars }: FeaturedCarsProps) => {
  const [activeTab, setActiveTab] = useState<'new' | 'used'>('new');
  
  // Filter cars based on active tab
  const cars = featuredCars.filter(car => car.condition === activeTab);

  return (
    <section className="py-16 bg-primary-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-3 text-secondary-color">Featured Cars</h2>
        <p className="text-gray-one text-center mb-8">Discover our selection of premium vehicles</p>
        
        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button 
              className={`px-6 py-3 text-sm font-medium rounded-l-lg ${
                activeTab === 'new' 
                  ? 'bg-primary-color text-primary-white' 
                  : 'bg-primary-white text-secondary-color border border-primary-color'
              }`}
              onClick={() => setActiveTab('new')}
            >
              New Cars
            </button>
            <button 
              className={`px-6 py-3 text-sm font-medium rounded-r-lg ${
                activeTab === 'used' 
                  ? 'bg-primary-color text-primary-white' 
                  : 'bg-primary-white text-secondary-color border border-primary-color'
              }`}
              onClick={() => setActiveTab('used')}
            >
              Used Cars
            </button>
          </div>
        </div>
        
        {/* Cars Grid */}
        {cars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-one">No featured {activeTab} cars available at the moment.</p>
          </div>
        )}
        
        <div className="text-center mt-10">
          <Link href="/cars" className="inline-flex items-center bg-primary-color text-primary-white px-8 py-3 rounded-md font-medium hover:bg-primary-dark transition cursor-pointer">
            View All Cars 
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="ml-2"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCars;
