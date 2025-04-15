import Hero from "@/components/home/Hero";
import SearchBar from "@/components/home/SearchBar";
import BrandLogos from "@/components/home/BrandLogos";
import FeaturedCars from "@/components/home/FeaturedCars";
import SellCarCTA from "@/components/home/SellCarCTA";

const HomePage = () => {
  return (
    <>
      <Hero />
      <SearchBar />
      <BrandLogos />
      <FeaturedCars />
      <SellCarCTA />
    </>
  );
};

export default HomePage;
