
import { Link } from "wouter";
import { CURRENCY } from "@/lib/constants";
import SearchBar from "./SearchBar";

const Hero = () => {
  return (
    <section className="relative h-[80vh]">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1604055203007-b6b934c925ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/50" /> {/* Overlay */}
      </div>

      <div className="relative z-10 h-full">
        <div className="container mx-auto px-4 h-full">
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
              Discover Your Dream Car
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-200 max-w-2xl">
              Nairobi's premium car dealership with the finest selection of vehicles at competitive prices.
            </p>
            
            {/* Search Bar */}
            <div className="w-full max-w-4xl mb-8">
              <SearchBar />
            </div>

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
        </div>
      </div>
    </section>
  );
};

export default Hero;
