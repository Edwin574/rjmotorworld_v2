const AboutPage = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">About AutoElite</h1>
          
          <div className="bg-white rounded-lg shadow-md p-8 mb-12">
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="text-gray-700 mb-6">
              Founded in 2010, AutoElite has grown from a small family business to one of the region's most trusted car dealerships. Our journey began with a simple mission: to provide exceptional vehicles and outstanding customer service with transparency and integrity.
            </p>
            
            <p className="text-gray-700 mb-6">
              Over the years, we've built a reputation for offering premium new and used vehicles that meet the highest standards of quality and performance. Our team of automotive experts carefully selects each vehicle in our inventory, ensuring that our customers drive away with not just a car, but peace of mind.
            </p>
            
            <div className="my-8 rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1560527843-4456a986b7a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="AutoElite Dealership" 
                className="w-full h-auto"
              />
            </div>
            
            <h2 className="text-2xl font-bold mb-4">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-primary text-3xl mb-3">
                  <i className="fas fa-star"></i>
                </div>
                <h3 className="text-xl font-bold mb-2">Excellence</h3>
                <p className="text-gray-700">
                  We strive for excellence in every aspect of our business, from the vehicles we sell to the service we provide.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-primary text-3xl mb-3">
                  <i className="fas fa-handshake"></i>
                </div>
                <h3 className="text-xl font-bold mb-2">Integrity</h3>
                <p className="text-gray-700">
                  Honesty and transparency form the foundation of our business relationships with customers and partners.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-primary text-3xl mb-3">
                  <i className="fas fa-heart"></i>
                </div>
                <h3 className="text-xl font-bold mb-2">Customer Focus</h3>
                <p className="text-gray-700">
                  Our customers are at the center of everything we do. Your satisfaction is our top priority.
                </p>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-4">Our Team</h2>
            <p className="text-gray-700 mb-6">
              AutoElite is powered by a dedicated team of automotive professionals who share a passion for cars and customer service. From our sales consultants to our service technicians, each member of our team is committed to providing you with an exceptional experience.
            </p>
            
            <p className="text-gray-700">
              We believe that buying a car should be an exciting and rewarding experience, not a stressful one. That's why our team is focused on understanding your needs and helping you find the perfect vehicle that fits your lifestyle and budget.
            </p>
          </div>
          
          <div className="bg-primary text-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Visit Us Today</h2>
            <p className="mb-6">
              Experience the AutoElite difference for yourself. Visit our showroom to explore our extensive collection of premium vehicles and meet our friendly team.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="/contact" 
                className="bg-white text-primary px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition"
              >
                Contact Us
              </a>
              <a 
                href="/cars" 
                className="bg-secondary text-white px-6 py-3 rounded-md font-medium hover:bg-orange-600 transition"
              >
                Browse Our Cars
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
