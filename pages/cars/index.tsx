import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import connectToDatabase from '../../lib/mongodb';
import { Car, CarBrand } from '../../models';
import CarFilter from '../../components/cars/CarFilter';
import CarCard from '../../components/cars/CarCard';

interface CarsPageProps {
  initialCars: any[];
  brands: any[];
}

export default function CarsPage({ initialCars, brands }: CarsPageProps) {
  const [cars, setCars] = useState(initialCars);
  const [loading, setLoading] = useState(false);

  const handleFilter = async (filters: any) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/cars?${queryParams}`);
      const data = await response.json();
      setCars(data);
    } catch (error) {
      console.error('Error filtering cars:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Cars - RJ Motor World</title>
        <meta name="description" content="Browse our extensive collection of new and used cars at RJ Motor World." />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <CarFilter brands={brands} onFilter={handleFilter} />
          </div>
          
          <div className="lg:w-3/4">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">All Cars</h1>
              <p className="text-gray-600 mt-2">
                {cars.length} car{cars.length !== 1 ? 's' : ''} found
              </p>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-96"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {cars.map((car) => (
                  <CarCard key={car._id} car={car} />
                ))}
              </div>
            )}
            
            {!loading && cars.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No cars found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    await connectToDatabase();
    
    const cars = await Car.find({}).sort({ createdAt: -1 }).lean();
    const brands = await CarBrand.find({}).lean();
    
    return {
      props: {
        initialCars: JSON.parse(JSON.stringify(cars)),
        brands: JSON.parse(JSON.stringify(brands)),
      },
    };
  } catch (error) {
    console.error('Error fetching cars:', error);
    return {
      props: {
        initialCars: [],
        brands: [],
      },
    };
  }
};