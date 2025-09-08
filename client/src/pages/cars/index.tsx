import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import CarFilter from "@/components/cars/CarFilter";
import CarCard from "@/components/cars/CarCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Car } from "@shared/schema";

const CarsPage = () => {
  const [location, navigate] = useLocation();
  const params = new URLSearchParams(location.split('?')[1]);
  
  // Get initial filter values from URL if any
  const initialFilters = {
    condition: params.get('condition') || '',
    make: params.get('make') || '',
    model: params.get('model') || '',
    minYear: params.get('minYear') || '',
    maxYear: params.get('maxYear') || '',
    minPrice: params.get('minPrice') || '',
    maxPrice: params.get('maxPrice') || '',
    minMileage: params.get('minMileage') || '',
    maxMileage: params.get('maxMileage') || '',
    search: params.get('search') || '',
  };
  
  const [filters, setFilters] = useState(initialFilters);
  const [sortBy, setSortBy] = useState('');

  // Build query parameters
  const queryParams: Record<string, any> = {};
  if (filters.condition) queryParams.condition = filters.condition;
  if (filters.make) queryParams.make = filters.make;
  if (filters.model) queryParams.model = filters.model;
  if (filters.minYear) queryParams.minYear = Number(filters.minYear);
  if (filters.maxYear) queryParams.maxYear = Number(filters.maxYear);
  if (filters.minPrice) queryParams.minPrice = Number(filters.minPrice);
  if (filters.maxPrice) queryParams.maxPrice = Number(filters.maxPrice);
  if (filters.minMileage) queryParams.minMileage = Number(filters.minMileage);
  if (filters.maxMileage) queryParams.maxMileage = Number(filters.maxMileage);
  if (filters.search) queryParams.search = filters.search;

  // Fetch cars with filters
  const { data: cars = [], isLoading } = useQuery<Car[]>({
    queryKey: ['/api/cars', queryParams],
  });

  // Handle filter changes
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    // Sync filters to URL
    const u = new URL('/cars', window.location.origin);
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '' && v !== 'all') {
        u.searchParams.set(k, String(v));
      }
    });
    navigate(u.pathname + (u.search ? u.search : ''));
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
      case 'default':
      default:
        return 0;
    }
  });

  return (
    <section className="py-10 bg-primary-white">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-secondary-color">Browse Our Cars</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <CarFilter onFilterChange={handleFilterChange} initialFilters={initialFilters} />
          </div>
          
          {/* Car Listings */}
          <div className="lg:w-3/4">
            {/* Sort Controls */}
            <div className="bg-primary-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-gray-one">
                  Showing <span className="font-bold text-primary-color">{sortedCars.length}</span> results
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-gray-one whitespace-nowrap">Sort by:</label>
                  <Select
                    value={sortBy}
                    onValueChange={setSortBy}
                  >
                    <SelectTrigger className="min-w-[200px] bg-gray-50 border-gray-200">
                      <SelectValue placeholder="Default" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="price_asc">Price: Low to High</SelectItem>
                      <SelectItem value="price_desc">Price: High to Low</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="mileage">Mileage: Low to High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Loading State */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, idx) => (
                  <div key={idx} className="bg-primary-white rounded-lg shadow-md overflow-hidden animate-pulse">
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
                <h3 className="text-xl font-bold mb-2 text-secondary-color">No cars found</h3>
                <p className="text-gray-one">
                  Try adjusting your filters to find the perfect car.
                </p>
              </div>
            )}
            
            {/* Pagination - Simplified for this implementation */}
            {sortedCars.length > 0 && (
              <div className="mt-10 flex justify-center">
                <nav className="inline-flex shadow-sm">
                  <a href="#" className="px-3 py-2 bg-primary-white border border-gray-300 text-gray-one rounded-l-md hover:bg-gray-50">
                    <i className="fas fa-chevron-left"></i>
                  </a>
                  <a href="#" className="px-4 py-2 bg-primary-color border border-primary-color text-primary-white">1</a>
                  <a href="#" className="px-4 py-2 bg-primary-white border border-gray-300 text-gray-one hover:bg-gray-50">2</a>
                  <a href="#" className="px-4 py-2 bg-primary-white border border-gray-300 text-gray-one hover:bg-gray-50">3</a>
                  <a href="#" className="px-3 py-2 bg-primary-white border border-gray-300 text-gray-one rounded-r-md hover:bg-gray-50">
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

export default CarsPage;
