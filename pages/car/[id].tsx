import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import connectToDatabase from '../../lib/mongodb';
import { Car } from '../../models';
import ImageCarousel from '../../components/car/ImageCarousel';
import CarDetailInfo from '../../components/car/CarDetailInfo';

interface CarDetailsPageProps {
  car: any;
}

export default function CarDetailsPage({ car }: CarDetailsPageProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (!car) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Car Not Found</h1>
          <p className="text-gray-600">The car you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{car.title} - RJ Motor World</title>
        <meta name="description" content={car.description} />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <ImageCarousel images={car.images || []} alt={car.title} />
          </div>
          <div>
            <CarDetailInfo car={car} />
          </div>
        </div>
        
        {/* Description Section */}
        {car.description && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{car.description}</p>
          </div>
        )}
        
        {/* Standard Features Section */}
        {car.features && car.features.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Standard Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {car.features.map((feature: string, index: number) => (
                <div key={index} className="flex items-center bg-gray-50 p-3 rounded-lg">
                  <i className="fas fa-check-circle text-green-500 mr-2"></i>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Safety Features Section */}
        {car.safetyFeatures && car.safetyFeatures.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <i className="fas fa-shield-alt mr-2 text-red-500"></i>
              Safety Features
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {car.safetyFeatures.map((feature: string, index: number) => (
                <div key={index} className="flex items-center bg-red-50 p-3 rounded-lg">
                  <i className="fas fa-check-circle text-red-500 mr-2"></i>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Luxury Features Section */}
        {car.luxuryFeatures && car.luxuryFeatures.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <i className="fas fa-crown mr-2 text-amber-500"></i>
              Luxury Features
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {car.luxuryFeatures.map((feature: string, index: number) => (
                <div key={index} className="flex items-center bg-amber-50 p-3 rounded-lg">
                  <i className="fas fa-check-circle text-amber-500 mr-2"></i>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags Section */}
        {car.tags && car.tags.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {car.tags.map((tag: string, index: number) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    await connectToDatabase();
    
    // Try to find by numeric id first (like /car/2, /car/3)
    let car = await Car.findOne({ id: parseInt(params?.id as string) }).lean();
    
    // If not found by numeric id, try by MongoDB _id
    if (!car) {
      car = await Car.findById(params?.id).lean();
    }
    
    if (!car) {
      return {
        notFound: true,
      };
    }
    
    return {
      props: {
        car: JSON.parse(JSON.stringify(car)),
      },
    };
  } catch (error) {
    console.error('Error fetching car:', error);
    return {
      notFound: true,
    };
  }
};