import Head from 'next/head';

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>Contact Us - RJ Motor World</title>
        <meta name="description" content="Get in touch with RJ Motor World. Visit our showroom, call us, or send us a message." />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Contact Us
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Get in Touch</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Address</h3>
                  <p className="text-gray-600">
                    123 Motor World Drive<br />
                    Automotive City, AC 12345
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900">Phone</h3>
                  <p className="text-gray-600">
                    <a href="tel:+1234567890" className="hover:text-blue-600">
                      (123) 456-7890
                    </a>
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <p className="text-gray-600">
                    <a href="mailto:info@rjmotorworld.com" className="hover:text-blue-600">
                      info@rjmotorworld.com
                    </a>
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900">Business Hours</h3>
                  <div className="text-gray-600">
                    <p>Monday - Friday: 9:00 AM - 7:00 PM</p>
                    <p>Saturday: 9:00 AM - 6:00 PM</p>
                    <p>Sunday: 11:00 AM - 5:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Send us a Message</h2>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}