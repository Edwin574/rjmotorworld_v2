import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { YEARS, PRICE_RANGES, MILEAGE_RANGES } from "@/lib/constants";
import type { CarBrand, CarModel } from "@shared/schema";

interface CarFilterProps {
  onFilterChange: (filters: any) => void;
  initialFilters?: any;
}

const CarFilter = ({ onFilterChange, initialFilters = {} }: CarFilterProps) => {
  const [filters, setFilters] = useState({
    condition: initialFilters.condition || '',
    make: initialFilters.make || '',
    model: initialFilters.model || '',
    minYear: initialFilters.minYear || '',
    maxYear: initialFilters.maxYear || '',
    minPrice: initialFilters.minPrice || '',
    maxPrice: initialFilters.maxPrice || '',
    minMileage: initialFilters.minMileage || '',
    maxMileage: initialFilters.maxMileage || '',
  });

  // Fetch car brands
  const { data: brands = [] } = useQuery<CarBrand[]>({
    queryKey: ['/api/brands'],
  });

  // Fetch car models when make is selected
  const { data: models = [] } = useQuery<CarModel[]>({
    queryKey: ['/api/models', filters.make],
    enabled: !!filters.make,
  });

  // Apply filters
  const applyFilters = () => {
    onFilterChange(filters);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      condition: '',
      make: '',
      model: '',
      minYear: '',
      maxYear: '',
      minPrice: '',
      maxPrice: '',
      minMileage: '',
      maxMileage: '',
    });
    onFilterChange({});
  };

  // Update filter state
  const handleFilterChange = (name: string, value: string) => {
    // Reset model when make changes
    if (name === 'make' && value !== filters.make) {
      setFilters({ ...filters, [name]: value, model: '' });
    } else {
      setFilters({ ...filters, [name]: value });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Filters</h2>
      
      {/* Status Filter */}
      <div className="mb-6">
        <Label className="block text-gray-medium font-medium mb-2">Car Status</Label>
        <Select 
          value={filters.condition} 
          onValueChange={(value) => handleFilterChange('condition', value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
        >
          <option value="">All Cars</option>
          <option value="new">New Cars</option>
          <option value="used">Used Cars</option>
        </Select>
      </div>
      
      {/* Make Filter */}
      <div className="mb-6">
        <Label className="block text-gray-medium font-medium mb-2">Make</Label>
        <Select 
          value={filters.make} 
          onValueChange={(value) => handleFilterChange('make', value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
        >
          <option value="">All Makes</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.name}>{brand.name}</option>
          ))}
        </Select>
      </div>
      
      {/* Model Filter */}
      <div className="mb-6">
        <Label className="block text-gray-medium font-medium mb-2">Model</Label>
        <Select 
          value={filters.model} 
          onValueChange={(value) => handleFilterChange('model', value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          disabled={!filters.make}
        >
          <option value="">{filters.make ? 'All Models' : 'Select Make First'}</option>
          {models.map((model) => (
            <option key={model.id} value={model.name}>{model.name}</option>
          ))}
        </Select>
      </div>
      
      {/* Year Range Filter */}
      <div className="mb-6">
        <Label className="block text-gray-medium font-medium mb-2">Year</Label>
        <div className="flex space-x-4">
          <Select 
            value={filters.minYear} 
            onValueChange={(value) => handleFilterChange('minYear', value)}
            className="w-1/2 p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          >
            <option value="">Min Year</option>
            {YEARS.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </Select>
          <Select 
            value={filters.maxYear} 
            onValueChange={(value) => handleFilterChange('maxYear', value)}
            className="w-1/2 p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          >
            <option value="">Max Year</option>
            {YEARS.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </Select>
        </div>
      </div>
      
      {/* Price Range Filter */}
      <div className="mb-6">
        <Label className="block text-gray-medium font-medium mb-2">Price Range</Label>
        <div className="flex space-x-4">
          <Select 
            value={filters.minPrice} 
            onValueChange={(value) => handleFilterChange('minPrice', value)}
            className="w-1/2 p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          >
            <option value="">Min Price</option>
            {PRICE_RANGES.filter(range => range.min !== undefined).map((range, idx) => (
              <option key={idx} value={range.min}>{`$${(range.min as number).toLocaleString()}`}</option>
            ))}
          </Select>
          <Select 
            value={filters.maxPrice} 
            onValueChange={(value) => handleFilterChange('maxPrice', value)}
            className="w-1/2 p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          >
            <option value="">Max Price</option>
            {PRICE_RANGES.filter(range => range.max !== undefined).map((range, idx) => (
              <option key={idx} value={range.max}>{`$${(range.max as number).toLocaleString()}`}</option>
            ))}
          </Select>
        </div>
      </div>
      
      {/* Mileage Range Filter */}
      <div className="mb-6">
        <Label className="block text-gray-medium font-medium mb-2">Mileage</Label>
        <div className="flex space-x-4">
          <Select 
            value={filters.minMileage} 
            onValueChange={(value) => handleFilterChange('minMileage', value)}
            className="w-1/2 p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          >
            <option value="">Min Mileage</option>
            {MILEAGE_RANGES.filter(range => range.min !== undefined).map((range, idx) => (
              <option key={idx} value={range.min}>{`${(range.min as number).toLocaleString()} miles`}</option>
            ))}
          </Select>
          <Select 
            value={filters.maxMileage} 
            onValueChange={(value) => handleFilterChange('maxMileage', value)}
            className="w-1/2 p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          >
            <option value="">Max Mileage</option>
            {MILEAGE_RANGES.filter(range => range.max !== undefined).map((range, idx) => (
              <option key={idx} value={range.max}>{`${(range.max as number).toLocaleString()} miles`}</option>
            ))}
          </Select>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={applyFilters}
          className="w-full bg-primary text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition"
        >
          Apply Filters
        </Button>
        <Button 
          onClick={resetFilters}
          variant="outline"
          className="w-full py-3 px-4 rounded-md font-medium"
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default CarFilter;
