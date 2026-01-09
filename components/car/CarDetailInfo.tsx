import { generateWhatsAppUrl, formatCurrency, formatNumber } from "@/lib/utils/formatters";
import { CONTACT_INFO } from "@/lib/constants";
import type { Car } from "@shared/schema";

interface CarDetailInfoProps {
  car: Car;
}

const CarDetailInfo = ({ car }: CarDetailInfoProps) => {
  return (
    <div>
      {/* Header with badges */}
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
      
      {/* Quick Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 bg-gray-50 p-4 rounded-lg">
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
      
      {/* Vehicle Identification */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <i className="fas fa-fingerprint mr-2 text-primary"></i>
          Vehicle Identification
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-gray-medium text-sm">Make</span>
            <span className="font-semibold">{car.make}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-medium text-sm">Model</span>
            <span className="font-semibold">{car.model}</span>
          </div>
          {car.vin && (
            <div className="flex flex-col">
              <span className="text-gray-medium text-sm">VIN</span>
              <span className="font-semibold font-mono text-sm">{car.vin}</span>
            </div>
          )}
          {car.stockNumber && (
            <div className="flex flex-col">
              <span className="text-gray-medium text-sm">Stock Number</span>
              <span className="font-semibold">{car.stockNumber}</span>
            </div>
          )}
          {car.registrationNumber && (
            <div className="flex flex-col">
              <span className="text-gray-medium text-sm">Registration Number</span>
              <span className="font-semibold">{car.registrationNumber}</span>
            </div>
          )}
        </div>
      </div>

      {/* Exterior & Interior */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <i className="fas fa-palette mr-2 text-primary"></i>
          Exterior & Interior
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {car.color && (
            <div className="flex flex-col">
              <span className="text-gray-medium text-sm">Color</span>
              <span className="font-semibold">{car.color}</span>
            </div>
          )}
          {car.bodyType && (
            <div className="flex flex-col">
              <span className="text-gray-medium text-sm">Body Type</span>
              <span className="font-semibold">{car.bodyType}</span>
            </div>
          )}
          {car.doors && (
            <div className="flex flex-col">
              <span className="text-gray-medium text-sm">Doors</span>
              <span className="font-semibold">{car.doors}</span>
            </div>
          )}
          {car.seats && (
            <div className="flex flex-col">
              <span className="text-gray-medium text-sm">Seats</span>
              <span className="font-semibold">{car.seats}</span>
            </div>
          )}
        </div>
      </div>

      {/* Engine & Performance */}
      {(car.engine || car.engineSize || car.engineType || car.horsepower || car.torque || car.driveType) && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <i className="fas fa-cog mr-2 text-primary"></i>
            Engine & Performance
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {car.engine && (
              <div className="flex flex-col">
                <span className="text-gray-medium text-sm">Engine</span>
                <span className="font-semibold">{car.engine}</span>
              </div>
            )}
            {car.engineSize && (
              <div className="flex flex-col">
                <span className="text-gray-medium text-sm">Engine Size</span>
                <span className="font-semibold">{car.engineSize}</span>
              </div>
            )}
            {car.engineType && (
              <div className="flex flex-col">
                <span className="text-gray-medium text-sm">Engine Type</span>
                <span className="font-semibold">{car.engineType}</span>
              </div>
            )}
            {car.horsepower && (
              <div className="flex flex-col">
                <span className="text-gray-medium text-sm">Horsepower</span>
                <span className="font-semibold">{car.horsepower} HP</span>
              </div>
            )}
            {car.torque && (
              <div className="flex flex-col">
                <span className="text-gray-medium text-sm">Torque</span>
                <span className="font-semibold">{car.torque} lb-ft</span>
              </div>
            )}
            {car.driveType && (
              <div className="flex flex-col">
                <span className="text-gray-medium text-sm">Drive Type</span>
                <span className="font-semibold">{car.driveType}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Vehicle History */}
      {(car.condition === 'used' && (car.accidentHistory || car.serviceHistory || car.ownerHistory)) && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <i className="fas fa-history mr-2 text-primary"></i>
            Vehicle History
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {car.accidentHistory && (
              <div className="flex flex-col">
                <span className="text-gray-medium text-sm">Accident History</span>
                <span className="font-semibold capitalize">{car.accidentHistory.replace('_', ' ')}</span>
              </div>
            )}
            {car.serviceHistory !== undefined && (
              <div className="flex flex-col">
                <span className="text-gray-medium text-sm">Service History</span>
                <span className="font-semibold">{car.serviceHistory ? 'Available' : 'Not Available'}</span>
              </div>
            )}
            {car.ownerHistory && (
              <div className="flex flex-col">
                <span className="text-gray-medium text-sm">Previous Owners</span>
                <span className="font-semibold">{car.ownerHistory}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pricing & Availability */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <i className="fas fa-tag mr-2 text-primary"></i>
          Pricing & Availability
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-gray-medium text-sm">Price</span>
            <span className="font-semibold text-lg text-primary">{formatCurrency(car.price)}</span>
          </div>
          {car.marketValue && (
            <div className="flex flex-col">
              <span className="text-gray-medium text-sm">Market Value</span>
              <span className="font-semibold">{formatCurrency(car.marketValue)}</span>
            </div>
          )}
          {car.priceNegotiable !== undefined && (
            <div className="flex flex-col">
              <span className="text-gray-medium text-sm">Price Negotiable</span>
              <span className="font-semibold">{car.priceNegotiable ? 'Yes' : 'No'}</span>
            </div>
          )}
          {car.availability && (
            <div className="flex flex-col">
              <span className="text-gray-medium text-sm">Availability</span>
              <span className="font-semibold capitalize">{car.availability}</span>
            </div>
          )}
        </div>
      </div>

      {/* Warranty & Financing */}
      {(car.warrantyMonths || car.financingAvailable || car.insuranceDetails) && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <i className="fas fa-shield-alt mr-2 text-primary"></i>
            Warranty & Financing
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {car.warrantyMonths && (
              <div className="flex flex-col">
                <span className="text-gray-medium text-sm">Warranty</span>
                <span className="font-semibold">{car.warrantyMonths} months</span>
              </div>
            )}
            {car.financingAvailable !== undefined && (
              <div className="flex flex-col">
                <span className="text-gray-medium text-sm">Financing Available</span>
                <span className="font-semibold">{car.financingAvailable ? 'Yes' : 'No'}</span>
              </div>
            )}
            {car.insuranceDetails && (
              <div className="flex flex-col col-span-2">
                <span className="text-gray-medium text-sm">Insurance Details</span>
                <span className="font-semibold">{car.insuranceDetails}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Location */}
      {car.location && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <i className="fas fa-map-marker-alt mr-2 text-primary"></i>
            Location
          </h2>
          <div className="flex items-center">
            <i className="fas fa-map-pin mr-2 text-primary"></i>
            <span className="font-semibold">{car.location}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarDetailInfo;
