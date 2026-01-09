import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import CarFilter from "@/components/cars/CarFilter";
import CarCard from "@/components/cars/CarCard";
import { Select } from "@/components/ui/select";
import type { Car } from "@shared/schema";

const UsedCarsPage = () => {
  // Initialize filters with "used" condition
  const initialFilters = { condition: 'used' };
  const [filters, setFilters] = useState(initialFilters);
  const [sortBy, setSortBy] = useState('');

  // Prepare query parameters
  const queryParams = { ...filters };

  // Fetch used cars
  const { data: cars = [], isLoading } = useQuery<Car[]>({
    queryKey: ['/api/cars', queryParams],
  });

  // Handle filter changes - maintain the "used" condition
  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...newFilters, condition: 'used' });
  };

  // Sort cars based on selection
  const sortedCars = [...cars].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'newest':
        return b.year - a.year;
      case 'mileage':
        return (a.mileage || 0) - (b.mileage || 0);
      default:
        return 0;
    }
  });

  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Browse Our Used Cars</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <CarFilter 
              onFilterChange={handleFilterChange} 
              initialFilters={initialFilters} 
            />
          </div>
          
          {/* Car Listings */}
          <div className="lg:w-3/4">
            {/* Sort Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <div className="text-gray-medium">
                Showing <span className="font-bold">{sortedCars.length}</span> used cars
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-gray-medium">Sort by:</label>
                <Select
                  value={sortBy}
                  onValueChange={setSortBy}
                >
                  <option value="">Default</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                  <option value="mileage">Mileage: Low to High</option>
                </Select>
              </div>
            </div>
            
            {/* Loading State */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, idx) => (
                  <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-300"></div>
                    <div className="p-6">
                      <div className="h-5 bg-gray-300 rounded mb-4"></div>
                      <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
                      <div className="flex justify-between">
                        <div className="h-5 bg-gray-300 rounded w-1/4"></div>
                        <div className="h-5 bg-gray-300 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedCars.length > 0 ? (
              // Car Cards Grid
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedCars.map(car => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <i className="fas fa-car-alt text-5xl text-gray-300 mb-4"></i>
                <h3 className="text-xl font-bold mb-2">No used cars found</h3>
                <p className="text-gray-medium">
                  Try adjusting your filters or check back later for more inventory.
                </p>
              </div>
            )}
            
            {/* Pagination - Simplified for this implementation */}
            {sortedCars.length > 0 && (
              <div className="mt-10 flex justify-center">
                <nav className="inline-flex shadow-sm">
                  <a href="#" className="px-3 py-2 bg-white border border-gray-300 text-gray-medium rounded-l-md hover:bg-gray-50">
                    <i className="fas fa-chevron-left"></i>
                  </a>
                  <a href="#" className="px-4 py-2 bg-primary border border-primary text-white">1</a>
                  <a href="#" className="px-4 py-2 bg-white border border-gray-300 text-gray-medium hover:bg-gray-50">2</a>
                  <a href="#" className="px-4 py-2 bg-white border border-gray-300 text-gray-medium hover:bg-gray-50">3</a>
                  <a href="#" className="px-3 py-2 bg-white border border-gray-300 text-gray-medium rounded-r-md hover:bg-gray-50">
                    <i className="fas fa-chevron-right"></i>
                  </a>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UsedCarsPage;
