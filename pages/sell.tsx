import Head from 'next/head';
import MultiStepForm from '../components/sell/MultiStepForm';

export default function SellPage() {
  return (
    <>
      <Head>
        <title>Sell Your Car - RJ Motor World</title>
        <meta name="description" content="Sell your car to RJ Motor World. Get a fair price for your vehicle with our simple process." />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Sell Your Car
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get the best value for your vehicle. Our experts will evaluate your car 
              and provide you with a competitive offer.
            </p>
          </div>
          
          <MultiStepForm />
        </div>
      </div>
    </>
  );
}