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
import { useHotels } from '@/contexts/HotelContext';

const Index = () => {
  const { hotels, selectedHotel } = useHotels();

  return (
    <div className="min-h-screen bg-background">
      <Header hotel={selectedHotel || null} />
      <main>
        <HeroSection hotels={hotels}/>
        <AboutSection />
        <FeaturedRooms hotels={hotels} />
        <AmenitiesSection hotelId={selectedHotel?._id || null}/>
        <GalleryPreview hotel={selectedHotel || null}/>
        <ReviewsSection />
        <CTASection hotel={selectedHotel || null} />
      </main>
      <Footer hotel={selectedHotel || null} />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
