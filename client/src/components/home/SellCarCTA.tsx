import { Link } from "wouter";
import { Car } from "lucide-react";

const SellCarCTA = () => {
  return (
    <section className="py-16 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Sell Your Car?</h2>
          <p className="text-xl mb-8">
            Get a competitive offer for your vehicle in minutes. Our process is simple and hassle-free.
          </p>
          <Link href="/sell">
            <div className="inline-flex items-center bg-accent text-white px-8 py-4 rounded-md font-medium hover:bg-red-700 transition text-lg cursor-pointer">
              Sell Your Car <Car className="ml-2 h-5 w-5" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SellCarCTA;
