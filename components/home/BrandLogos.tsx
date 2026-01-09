import Link from "next/link";
import type { CarBrand } from "@shared/schema";

interface BrandLogosProps {
  brands: CarBrand[];
}

const BrandLogos = ({ brands }: BrandLogosProps) => {

  return (
    <section className="py-10 bg-primary-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8 text-secondary-color">Popular Brands</h2>
        <div className="overflow-hidden relative">
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {brands.map((brand) => (
              <Link key={brand.id} href={`/cars?make=${encodeURIComponent(brand.name)}`} className="flex items-center justify-center w-24 h-24 grayscale hover:grayscale-0 transition cursor-pointer">
                <img 
                  src={brand.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(brand.name)}&size=64&background=f3f4f6&color=374151`} 
                  alt={brand.name} 
                  className="h-16"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(brand.name)}&size=64&background=f3f4f6&color=374151`;
                  }}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandLogos;
