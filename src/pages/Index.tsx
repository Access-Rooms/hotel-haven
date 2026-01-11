import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { HeroSection } from '@/components/home/HeroSection';
import { AboutSection } from '@/components/home/AboutSection';
import { FeaturedRooms } from '@/components/home/FeaturedRooms';
import { AmenitiesSection } from '@/components/home/AmenitiesSection';
import { GalleryPreview } from '@/components/home/GalleryPreview';
import { ReviewsSection } from '@/components/home/ReviewsSection';
import { CTASection } from '@/components/home/CTASection';
import { hotelConfig } from '@/data/hotelData';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <FeaturedRooms />
        <AmenitiesSection />
        <GalleryPreview />
        <ReviewsSection />
        <CTASection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
