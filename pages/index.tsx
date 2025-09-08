import { GetServerSideProps } from 'next';
import Head from 'next/head';
import connectToDatabase from '@/lib/mongodb';
import { Car, CarBrand } from '@/models';
import Hero from '@/components/home/Hero';
import SearchBar from '@/components/home/SearchBar';
import FeaturedCars from '@/components/home/FeaturedCars';
import BrandLogos from '@/components/home/BrandLogos';
import SellCarCTA from '@/components/home/SellCarCTA';

interface HomePageProps {
  featuredCars: any[];
  brands: any[];
}

export default function HomePage({ featuredCars, brands }: HomePageProps) {
  return (
    <>
      <Head>
        <title>RJ Motor World - Premier Car Dealership</title>
        <meta name="description" content="Find your perfect car at RJ Motor World. We offer a wide selection of new and used vehicles with exceptional service." />
      </Head>
      
      <Hero />
      <SearchBar />
      <FeaturedCars cars={featuredCars} />
      <BrandLogos brands={brands} />
      <SellCarCTA />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    await connectToDatabase();
    
    const featuredCars = await Car.find({ featured: true }).limit(6).lean();
    const brands = await CarBrand.find({}).lean();
    
    return {
      props: {
        featuredCars: JSON.parse(JSON.stringify(featuredCars)),
        brands: JSON.parse(JSON.stringify(brands)),
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        featuredCars: [],
        brands: [],
      },
    };
  }
};