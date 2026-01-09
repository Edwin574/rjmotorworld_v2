import { generateWhatsAppUrl, formatCurrency, formatNumber } from "@/lib/utils/formatters";
import { CONTACT_INFO } from "@/lib/constants";
import type { Car } from "@shared/schema";

interface CarDetailInfoProps {
  car: Car;
}

const CarDetailInfo = ({ car }: CarDetailInfoProps) => {
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
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
      
      <h1 className="text-3xl font-bold mb-2">{car.title}</h1>
      <div className="text-2xl font-bold text-primary mb-6">{formatCurrency(car.price)}</div>
      
      {/* Quick Specs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="flex flex-col">
          <span className="text-gray-medium text-sm">Year</span>
          <span className="font-semibold">{car.year}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-medium text-sm">Mileage</span>
          <span className="font-semibold">{car.mileage ? formatNumber(car.mileage) : 'N/A'} miles</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-medium text-sm">Fuel Type</span>
          <span className="font-semibold">{car.fuelType || 'N/A'}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-medium text-sm">Transmission</span>
          <span className="font-semibold">{car.transmission || 'N/A'}</span>
        </div>
      </div>
      
      {/* Contact Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <a 
          href={generateWhatsAppUrl(CONTACT_INFO.phone.replace(/\D/g, ''), car.title, car.price)} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex-1 bg-green-500 text-white px-6 py-3 rounded-md font-medium hover:bg-green-600 transition text-center"
        >
          <i className="fab fa-whatsapp mr-2"></i> WhatsApp Enquiry
        </a>
        <a 
          href={`tel:${CONTACT_INFO.phone.replace(/\D/g, '')}`}
          className="flex-1 bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition text-center"
        >
          <i className="fas fa-phone-alt mr-2"></i> Call Dealer
        </a>
      </div>
      
      {/* Basic Specs */}
      <div className="grid grid-cols-2 gap-y-4 mb-8 border-t border-b border-gray-200 py-6">
        <div className="flex flex-col">
          <span className="text-gray-medium text-sm">Make</span>
          <span className="font-semibold">{car.make}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-medium text-sm">Model</span>
          <span className="font-semibold">{car.model}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-medium text-sm">Color</span>
          <span className="font-semibold">{car.color || 'N/A'}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-medium text-sm">Body Type</span>
          <span className="font-semibold">{car.bodyType || 'N/A'}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-medium text-sm">Engine</span>
          <span className="font-semibold">{car.engine || 'N/A'}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-medium text-sm">Drive Type</span>
          <span className="font-semibold">{car.driveType || 'N/A'}</span>
        </div>
        {car.stockNumber && (
          <div className="flex flex-col">
            <span className="text-gray-medium text-sm">Stock #</span>
            <span className="font-semibold">{car.stockNumber}</span>
          </div>
        )}
        {car.vin && (
          <div className="flex flex-col">
            <span className="text-gray-medium text-sm">VIN</span>
            <span className="font-semibold">{car.vin}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarDetailInfo;
