import { Link } from "wouter";
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
            <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded">NEW</span>
          ) : (
            <span className="bg-warning text-white text-xs font-bold px-2 py-1 rounded">USED</span>
          )}
          
          {car.featured && (
            <span className="bg-secondary text-white text-xs font-bold px-2 py-1 rounded">FEATURED</span>
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
        <h3 className="text-xl font-bold mb-2">{car.title}</h3>
        <p className="text-gray-medium mb-4">
          {formatCarSpecs(car.year, car.mileage, car.fuelType, car.transmission)}
        </p>
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold text-primary">{formatCurrency(car.price)}</div>
          <Link href={`/car/${car.id}`}>
            <a className="inline-flex items-center text-secondary font-medium">
              View Details <i className="fas fa-arrow-right ml-2"></i>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
