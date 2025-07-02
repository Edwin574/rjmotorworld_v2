
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { YEARS, PRICE_RANGES } from "@/lib/constants";
import type { CarBrand, CarModel } from "@shared/schema";

interface CarFilterProps {
  onFilterChange: (filters: any) => void;
  initialFilters?: any;
}

const CarFilter = ({ onFilterChange, initialFilters = {} }: CarFilterProps) => {
  const [filters, setFilters] = useState({
    search: initialFilters.search || '',
    condition: initialFilters.condition || 'all',
    make: initialFilters.make || 'all',
    model: initialFilters.model || 'all',
    minYear: initialFilters.minYear || '',
    maxYear: initialFilters.maxYear || '',
    minPrice: initialFilters.minPrice || '',
    maxPrice: initialFilters.maxPrice || '',
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  // Fetch car brands
  const { data: brands = [] } = useQuery<CarBrand[]>({
    queryKey: ['/api/brands'],
  });

  // Fetch car models when make is selected
  const { data: models = [] } = useQuery<CarModel[]>({
    queryKey: ['/api/models', filters.make],
    enabled: !!filters.make && filters.make !== 'all',
  });

  // Price range options
  const priceRanges = [
    { label: '0 - 500K', min: 0, max: 500000 },
    { label: '500K - 1M', min: 500000, max: 1000000 },
    { label: '1M - 2M', min: 1000000, max: 2000000 },
    { label: '2M - 3M', min: 2000000, max: 3000000 },
    { label: '3M - 5M', min: 3000000, max: 5000000 },
    { label: '5M - 10M', min: 5000000, max: 10000000 },
    { label: 'Above 10M', min: 10000000, max: null },
  ];

  // Handle price range selection
  const handlePriceRangeClick = (min: number, max: number | null) => {
    setFilters(prev => ({
      ...prev,
      minPrice: min.toString(),
      maxPrice: max?.toString() || '',
    }));
  };

  // Apply filters
  const applyFilters = () => {
    // Filter out "all" values and empty strings before sending to parent
    const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value && value !== 'all' && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {} as any);
    
    onFilterChange(cleanFilters);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: '',
      condition: 'all',
      make: 'all',
      model: 'all',
      minYear: '',
      maxYear: '',
      minPrice: '',
      maxPrice: '',
    });
    onFilterChange({});
  };

  return (
    <div className="bg-primary-white rounded-lg shadow-md p-6 space-y-6">
      {/* Search Input */}
      <div className="relative">
        <Input
          type="text"
          placeholder="Search vehicle name"
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          className="pl-10 w-full"
        />
        <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
      </div>

      {/* Price Range Filter */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-secondary-color">Filter by budget</h3>
        <div className="grid grid-cols-3 gap-2">
          {priceRanges.map((range, index) => (
            <button
              key={index}
              onClick={() => handlePriceRangeClick(range.min, range.max)}
              className={`px-3 py-2 text-sm border rounded-md transition-colors
                ${filters.minPrice === range.min.toString() 
                  ? 'bg-primary-color text-primary-white border-primary-color' 
                  : 'bg-primary-white text-gray-one border-gray-300 hover:bg-gray-50'}`}
            >
              {range.label}
            </button>
          ))}
          <button
            onClick={resetFilters}
            className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Advanced Search Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center text-gray-one hover:text-primary-color transition-colors"
      >
        <span>Click here for Advanced search</span>
        <i className={`fas fa-chevron-${showAdvanced ? 'up' : 'down'} ml-2`}></i>
      </button>

      {showAdvanced && (
        <div className="space-y-4">
          {/* Condition Filter */}
          <div className="mb-6">
            <Label className="text-lg font-semibold text-secondary-color">Condition</Label>
            <div className="relative mt-2">
              <Select
                value={filters.condition}
                onValueChange={(value) => setFilters(prev => ({ ...prev, condition: value }))}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="All Conditions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Conditions</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="used">Used</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Make Selection */}
          <div className="mb-6">
            <Label className="text-lg font-semibold text-secondary-color">Make</Label>
            <div className="relative mt-2">
              <Select
                value={filters.make}
                onValueChange={(value) => setFilters(prev => ({ ...prev, make: value, model: 'all' }))}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="All Makes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Makes</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.name}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Model Selection */}
          <div className="mb-6">
            <Label className="text-lg font-semibold text-secondary-color">Model</Label>
            <div className="relative mt-2">
              <Select
                value={filters.model}
                onValueChange={(value) => setFilters(prev => ({ ...prev, model: value }))}
                disabled={!filters.make || filters.make === 'all'}
              >
                <SelectTrigger className={`w-full bg-white ${(!filters.make || filters.make === 'all') ? 'bg-gray-100' : ''}`}>
                  <SelectValue placeholder={(filters.make && filters.make !== 'all') ? 'All Models' : 'Select Make First'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Models</SelectItem>
                  {models.map((model) => (
                    <SelectItem key={model.id} value={model.name}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Year Range */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-secondary-color">Year of Manufacture</h3>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                placeholder="Min YOM"
                value={filters.minYear}
                onChange={(e) => setFilters(prev => ({ ...prev, minYear: e.target.value }))}
                className="w-full"
              />
              <Input
                type="number"
                placeholder="Max YOM"
                value={filters.maxYear}
                onChange={(e) => setFilters(prev => ({ ...prev, maxYear: e.target.value }))}
                className="w-full"
              />
            </div>
          </div>

          {/* Price Range Inputs */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-secondary-color">Price & Currency</h3>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                className="w-full"
              />
              <Input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button 
          onClick={applyFilters}
          className="w-full bg-primary-color text-primary-white hover:bg-primary-dark"
        >
          Search
        </Button>
        <Button 
          onClick={resetFilters}
          variant="outline"
          className="w-full"
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default CarFilter;
