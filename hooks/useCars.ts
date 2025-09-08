import { useQuery } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import type { Car } from "@shared/schema";

interface FilterParams {
  condition?: 'new' | 'used';
  make?: string;
  model?: string;
  minYear?: number;
  maxYear?: number;
  minPrice?: number;
  maxPrice?: number;
  minMileage?: number;
  maxMileage?: number;
  featured?: boolean;
  search?: string;
}

interface SortOption {
  field: 'price' | 'year' | 'mileage';
  direction: 'asc' | 'desc';
}

interface UseCarsOptions {
  initialFilters?: FilterParams;
  initialSort?: SortOption;
}

export const useCars = (options: UseCarsOptions = {}) => {
  const [location] = useLocation();
  const urlParams = new URLSearchParams(location.split('?')[1]);
  
  // Extract initial filters from URL params
  const urlFilters: FilterParams = {};
  if (urlParams.has('condition')) urlFilters.condition = urlParams.get('condition') as 'new' | 'used';
  if (urlParams.has('make')) urlFilters.make = urlParams.get('make') || undefined;
  if (urlParams.has('model')) urlFilters.model = urlParams.get('model') || undefined;
  if (urlParams.has('minYear')) urlFilters.minYear = Number(urlParams.get('minYear'));
  if (urlParams.has('maxYear')) urlFilters.maxYear = Number(urlParams.get('maxYear'));
  if (urlParams.has('minPrice')) urlFilters.minPrice = Number(urlParams.get('minPrice'));
  if (urlParams.has('maxPrice')) urlFilters.maxPrice = Number(urlParams.get('maxPrice'));
  if (urlParams.has('minMileage')) urlFilters.minMileage = Number(urlParams.get('minMileage'));
  if (urlParams.has('maxMileage')) urlFilters.maxMileage = Number(urlParams.get('maxMileage'));
  if (urlParams.has('featured')) urlFilters.featured = urlParams.get('featured') === 'true';
  if (urlParams.has('search')) urlFilters.search = urlParams.get('search') || undefined;

  // Merge URL filters with initial filters
  const initialFilters = { ...options.initialFilters, ...urlFilters };
  
  const [filters, setFilters] = useState<FilterParams>(initialFilters);
  const [sortOption, setSortOption] = useState<SortOption | null>(options.initialSort || null);

  // Build query parameters for API request
  const queryParams: Record<string, any> = {};
  if (filters.condition) queryParams.condition = filters.condition;
  if (filters.make) queryParams.make = filters.make;
  if (filters.model) queryParams.model = filters.model;
  if (filters.minYear) queryParams.minYear = filters.minYear;
  if (filters.maxYear) queryParams.maxYear = filters.maxYear;
  if (filters.minPrice) queryParams.minPrice = filters.minPrice;
  if (filters.maxPrice) queryParams.maxPrice = filters.maxPrice;
  if (filters.minMileage) queryParams.minMileage = filters.minMileage;
  if (filters.maxMileage) queryParams.maxMileage = filters.maxMileage;
  if (filters.featured !== undefined) queryParams.featured = filters.featured;
  if (filters.search) queryParams.search = filters.search;

  // Fetch cars with filters
  const { data: cars = [], isLoading, error, refetch } = useQuery<Car[]>({
    queryKey: ['/api/cars', queryParams],
  });

  // Apply sorting to cars
  const sortedCars = [...cars].sort((a, b) => {
    if (!sortOption) return 0;
    
    const { field, direction } = sortOption;
    const multiplier = direction === 'asc' ? 1 : -1;
    
    switch (field) {
      case 'price':
        return (a.price - b.price) * multiplier;
      case 'year':
        return (a.year - b.year) * multiplier;
      case 'mileage':
        return (a.mileage - b.mileage) * multiplier;
      default:
        return 0;
    }
  });

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<FilterParams>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters(options.initialFilters || {});
  }, [options.initialFilters]);

  // Set sort option
  const setSorting = useCallback((field: 'price' | 'year' | 'mileage', direction: 'asc' | 'desc') => {
    setSortOption({ field, direction });
  }, []);

  return {
    cars: sortedCars,
    filters,
    isLoading,
    error,
    updateFilters,
    resetFilters,
    setSorting,
    refetch
  };
};
