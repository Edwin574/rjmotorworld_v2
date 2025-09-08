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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <ImageCarousel images={car.images} />
          </div>
          <div>
            <CarDetailInfo car={car} />
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    await connectToDatabase();
    
    const car = await Car.findById(params?.id).lean();
    
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