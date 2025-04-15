import { Link } from "wouter";

import { CURRENCY } from "@/lib/constants";

const Hero = () => {
  return (
    <section className="bg-gradient-to-b from-black to-gray-900 text-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Your Dream Car</h1>
            <p className="text-lg md:text-xl mb-8 text-gray-100">
              Nairobi's premium car dealership with the finest selection of vehicles at competitive prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/cars/new">
                <div className="bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition text-center cursor-pointer">
                  New Cars
                </div>
              </Link>
              <Link href="/cars/used">
                <div className="bg-accent text-white px-6 py-3 rounded-md font-medium hover:bg-red-700 transition text-center cursor-pointer">
                  Used Cars
                </div>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="absolute top-3 right-3 bg-accent text-white px-3 py-1 rounded-full shadow-lg font-semibold">
              From {CURRENCY.formatter(1500000)}
            </div>
            <img 
              src="https://images.unsplash.com/photo-1604055203007-b6b934c925ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Luxury car" 
              className="rounded-lg shadow-2xl w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
