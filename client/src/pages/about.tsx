const AboutPage = () => {
  return (
    <section className="py-16 bg-primary-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center text-secondary-color">About RJ Motorworld</h1>
          
          <div className="bg-primary-white rounded-lg shadow-md p-8 mb-12">
            <h2 className="text-2xl font-bold mb-4 text-secondary-color">Our Story</h2>
            <p className="text-gray-one mb-6">
              Founded in 2015, RJ Motorworld has established itself as Nairobi's premier car dealership, serving Kenya's growing automotive market. Our journey began with a simple mission: to provide exceptional vehicles and outstanding customer service with transparency and integrity to the Kenyan community.
            </p>
            
            <p className="text-gray-one mb-6">
              Over the years, we've built a reputation for offering premium new and used vehicles that meet the highest standards of quality and performance. Our team of automotive experts carefully selects each vehicle in our inventory, ensuring that our customers drive away with not just a car, but complete confidence in their investment.
            </p>
            
            <div className="my-8 rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1560527843-4456a986b7a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="RJ Motorworld Dealership" 
                className="w-full h-auto"
              />
            </div>
            
            <h2 className="text-2xl font-bold mb-4 text-secondary-color">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-four p-6 rounded-lg">
                <div className="text-primary-color text-3xl mb-3">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-secondary-color">Excellence</h3>
                <p className="text-gray-one">
                  We strive for excellence in every aspect of our business, from the quality vehicles we offer to the exceptional service we provide to our Kenyan customers.
                </p>
              </div>
              
              <div className="bg-gray-four p-6 rounded-lg">
                <div className="text-primary-color text-3xl mb-3">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 11h-2.5c-.55 0-1-.45-1-1s.45-1 1-1H18c.55 0 1 .45 1 1s-.45 1-1 1zM16 6c0-.55-.45-1-1-1s-1 .45-1 1v2.5c0 .55.45 1 1 1s1-.45 1-1V6zM22 12c0 5.52-4.48 10-10 10s-10-4.48-10-10 4.48-10 10-10 10 4.48 10 10zm-2 0c0-4.41-3.59-8-8-8s-8 3.59-8 8 3.59 8 8 8 8-3.59 8-8z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-secondary-color">Integrity</h3>
                <p className="text-gray-one">
                  Honesty and transparency form the foundation of our business relationships with customers throughout Kenya and beyond.
                </p>
              </div>
              
              <div className="bg-gray-four p-6 rounded-lg">
                <div className="text-primary-color text-3xl mb-3">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-secondary-color">Customer Focus</h3>
                <p className="text-gray-one">
                  Our customers are at the center of everything we do. Your satisfaction and trust are our highest priorities at RJ Motorworld.
                </p>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-4 text-secondary-color">Our Team</h2>
            <p className="text-gray-one mb-6">
              RJ Motorworld is powered by a dedicated team of automotive professionals who share a passion for cars and exceptional customer service. From our sales consultants to our service technicians, each member of our team is committed to providing you with an outstanding experience.
            </p>
            
            <p className="text-gray-one">
              We believe that buying a car should be an exciting and rewarding experience, not a stressful one. That's why our team is focused on understanding your needs and helping you find the perfect vehicle that fits your lifestyle and budget in the Kenyan market.
            </p>
          </div>
          
          <div className="bg-primary-color text-primary-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Visit RJ Motorworld Today</h2>
            <p className="mb-6">
              Experience the RJ Motorworld difference for yourself. Visit our Nairobi showroom to explore our extensive collection of premium vehicles and meet our friendly, professional team.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="/contact" 
                className="bg-primary-white text-primary-color px-6 py-3 rounded-md font-medium hover:bg-gray-three transition"
              >
                Contact Us
              </a>
              <a 
                href="/cars" 
                className="bg-primary-accent text-primary-white px-6 py-3 rounded-md font-medium hover:bg-primary-dark transition"
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
