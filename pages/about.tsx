import Head from 'next/head';

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About Us - RJ Motor World</title>
        <meta name="description" content="Learn about RJ Motor World, your trusted car dealership with years of experience in the automotive industry." />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            About RJ Motor World
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 mb-6">
              Welcome to RJ Motor World, your premier destination for quality vehicles. 
              With years of experience in the automotive industry, we pride ourselves on 
              providing exceptional service and a wide selection of new and used cars.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              Our mission is to help you find the perfect vehicle that fits your needs and budget. 
              We believe in transparent pricing, honest communication, and building lasting 
              relationships with our customers.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why Choose Us?</h2>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
              <li>Extensive inventory of quality vehicles</li>
              <li>Competitive pricing and financing options</li>
              <li>Expert automotive knowledge and advice</li>
              <li>Comprehensive vehicle inspections</li>
              <li>Excellent customer service and support</li>
              <li>Hassle-free buying and selling process</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Team</h2>
            <p className="text-gray-600 mb-6">
              Our experienced team of automotive professionals is dedicated to helping you 
              make informed decisions. Whether you're buying your first car or looking to 
              upgrade to a luxury vehicle, we're here to guide you every step of the way.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}