import Link from "next/link";
import { CURRENCY } from "@/lib/constants";
import SearchBar from "./SearchBar";

const Hero = () => {
  return (
    <section className="relative h-[80vh]">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1617814065893-00757125efab?q=80&w=3432&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          backgroundSize: "cover",
          backgroundPosition: "center",
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
              Kenya's premium car dealership with the finest selection of
              vehicles at competitive prices.
            </p>

            {/* Search Bar */}
            <div className="w-full max-w-4xl mb-8">
              <SearchBar />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/cars/new" className="bg-primary-white text-secondary-color px-6 py-3 rounded-md font-medium hover:bg-gray-three transition text-center cursor-pointer">
                New Cars
              </Link>
              <Link href="/cars/used" className="bg-primary-color text-primary-white px-6 py-3 rounded-md font-medium hover:bg-primary-dark transition text-center cursor-pointer">
                Used Cars
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
