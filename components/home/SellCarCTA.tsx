import Link from "next/link";
import { Car } from "lucide-react";

const SellCarCTA = () => {
  return (
    <section className="py-16 bg-secondary-dark text-primary-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary-color to-primary-accent bg-clip-text text-transparent">
            Ready to Sell Your Car?
          </h2>
          <p className="text-xl mb-8 text-gray-three">
            Get a competitive offer for your vehicle in minutes. Our process is simple and hassle-free.
          </p>
          <Link href="/sell" className="inline-flex items-center bg-primary-color text-primary-white px-8 py-4 rounded-md font-medium hover:bg-primary-dark transition text-lg cursor-pointer">
            Sell Your Car <Car className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SellCarCTA;
