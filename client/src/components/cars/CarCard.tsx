import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { getOptimizedImageUrl } from "@/lib/imagekit";
import { formatCurrency, formatCarSpecs } from "@/lib/utils/formatters";
import type { Car } from "@shared/schema";

interface CarCardProps {
  car: Car;
}

const CarCard = ({ car }: CarCardProps) => {
  // Get the first image as the thumbnail
  const thumbnailImage = car.images && car.images.length > 0 
    ? car.images[0] 
    : "https://placehold.co/600x400?text=No+Image";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="relative">
        <img 
          src={getOptimizedImageUrl(thumbnailImage, 600, 400)}
          alt={car.title}
          className="w-full car-image aspect-[16/9] object-cover"
        />
        <div className="absolute top-0 left-0 mt-4 ml-4 flex gap-2">
          {car.condition === 'new' ? (
            <span className="bg-black text-white text-xs font-bold px-2 py-1 rounded">NEW</span>
          ) : (
            <span className="bg-gray-700 text-white text-xs font-bold px-2 py-1 rounded">USED</span>
          )}
          
          {car.featured && (
            <span className="bg-accent text-white text-xs font-bold px-2 py-1 rounded">FEATURED</span>
          )}

          {car.fuelType === 'Electric' && (
            <span className="bg-success text-white text-xs font-bold px-2 py-1 rounded">ELECTRIC</span>
          )}
          
          {car.fuelType === 'Hybrid' && (
            <span className="bg-teal-500 text-white text-xs font-bold px-2 py-1 rounded">HYBRID</span>
          )}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-black">{car.title}</h3>
        <p className="text-gray-600 mb-4">
          {formatCarSpecs(car.year, car.mileage || 0, car.fuelType, car.transmission)}
        </p>
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold text-accent">{formatCurrency(car.price)}</div>
          <Link href={`/car/${car.id}`}>
            <div className="inline-flex items-center text-black hover:text-accent transition font-medium cursor-pointer">
              View Details <ArrowRight className="h-4 w-4 ml-1" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
