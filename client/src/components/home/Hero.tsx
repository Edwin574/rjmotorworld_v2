import { Link } from "wouter";
import { CURRENCY, THEME_COLORS } from "@/lib/constants";

const Hero = () => {
  return (
    <section className="bg-gradient-to-b from-secondary-dark to-secondary-color text-primary-white py-16 md:py-0 md:h-[60vh] flex items-center">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center h-full">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-primary-color to-primary-accent bg-clip-text text-transparent">
              Discover Your Dream Car
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-three">
              Nairobi's premium car dealership with the finest selection of vehicles at competitive prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/cars/new">
                <div className="bg-primary-white text-secondary-color px-6 py-3 rounded-md font-medium hover:bg-gray-three transition text-center cursor-pointer">
                  New Cars
                </div>
              </Link>
              <Link href="/cars/used">
                <div className="bg-primary-color text-primary-white px-6 py-3 rounded-md font-medium hover:bg-primary-dark transition text-center cursor-pointer">
                  Used Cars
                </div>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="absolute top-3 right-3 bg-primary-accent text-primary-white px-3 py-1 rounded-full shadow-lg font-semibold">
              From {CURRENCY.formatter(1500000)}
            </div>
            <img 
              src="https://images.unsplash.com/photo-1604055203007-b6b934c925ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Luxury car" 
              className="rounded-lg shadow-2xl w-full md:max-h-[50vh] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
