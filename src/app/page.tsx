import Hero from "../components/hero";
import Carousel from "../components/carrousel";
import { FeaturedProducts } from "../components/featured-products";
import FeaturedCategories from "../components/featured-categories";
import EducationalContent from "../components/educational-content";
import BrandsSection from "../components/BrandsSection";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <BrandsSection />
      <Carousel />
      <FeaturedCategories />
      <EducationalContent />
    </>
  );
}
