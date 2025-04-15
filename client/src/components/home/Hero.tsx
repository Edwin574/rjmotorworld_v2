import { Link } from "wouter";

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-primary to-blue-800 text-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Drive</h1>
            <p className="text-lg md:text-xl mb-8 text-gray-100">
              Browse our extensive collection of premium new and used vehicles at competitive prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/cars/new">
                <a className="bg-white text-primary px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition text-center">
                  New Cars
                </a>
              </Link>
              <Link href="/cars/used">
                <a className="bg-secondary text-white px-6 py-3 rounded-md font-medium hover:bg-orange-600 transition text-center">
                  Used Cars
                </a>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 relative">
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
