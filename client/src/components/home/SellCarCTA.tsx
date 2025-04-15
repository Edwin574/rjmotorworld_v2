import { Link } from "wouter";

const SellCarCTA = () => {
  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Sell Your Car?</h2>
          <p className="text-xl mb-8">
            Get a competitive offer for your vehicle in minutes. Our process is simple and hassle-free.
          </p>
          <Link href="/sell">
            <a className="inline-flex items-center bg-secondary text-white px-8 py-4 rounded-md font-medium hover:bg-orange-600 transition text-lg">
              Sell Your Car <i className="fas fa-car ml-2"></i>
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SellCarCTA;
