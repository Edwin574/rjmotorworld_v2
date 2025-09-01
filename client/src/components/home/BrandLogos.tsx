import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import type { CarBrand } from "@shared/schema";

const BrandLogos = () => {
  // Fetch car brands from API
  const { data: brands = [], isLoading } = useQuery<CarBrand[]>({
    queryKey: ['/api/brands'],
  });

  if (isLoading) {
    return (
      <section className="py-10 bg-primary-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8 text-secondary-color">Popular Brands</h2>
          <div className="flex justify-center">
            <div className="animate-pulse flex space-x-12">
              {[...Array(7)].map((_, index) => (
                <div key={index} className="w-24 h-24 bg-gray-three rounded-full"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 bg-primary-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8 text-secondary-color">Popular Brands</h2>
        <div className="overflow-hidden relative">
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {brands.map((brand) => (
              <Link key={brand.id} href={`/cars?make=${encodeURIComponent(brand.name)}`}>
                <div className="flex items-center justify-center w-24 h-24 grayscale hover:grayscale-0 transition cursor-pointer">
                  <img 
                    src={brand.logoUrl} 
                    alt={brand.name} 
                    className="h-16"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(brand.name)}&size=64&background=f3f4f6&color=374151`;
                    }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandLogos;
