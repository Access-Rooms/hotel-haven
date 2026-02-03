import { Link } from 'react-router-dom';
import { Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { hotelConfig } from '@/data/hotelData';
import { Hotel } from '@/models/home.models';
import { useEffect, useState } from 'react';

export function CTASection({ hotel }: { hotel: Hotel | null }) {
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(hotel);
  const handleWhatsApp = () => {
    window.open(
      `https://wa.me/${selectedHotel?.whatsappNumber || hotelConfig.whatsappNumber.replace(/\D/g, '')}?text=Hi, I'd like to inquire about booking a room at ${selectedHotel?.hotelName}.`,
      '_blank'
    );
  };
  useEffect(() => {
    if (hotel) {
      setSelectedHotel(hotel);
    }
  }, [hotel]);

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container-hotel">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80"
              alt="Beach"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-overlay" />
            <div className="absolute inset-0 bg-foreground/40" />
          </div>

          {/* Content */}
          <div className="relative z-10 px-8 py-16 sm:px-16 sm:py-24 text-center">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-card mb-4">
              Ready for Your Dream Getaway?
            </h2>
            <p className="text-card/90 text-lg max-w-2xl mx-auto mb-8">
              {selectedHotel?.websiteData.shortDescription || 'Book your stay today and experience the luxury, comfort, and world-class hospitality that awaits at ' + selectedHotel?.hotelName}.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/rooms">Book Your Stay</Link>
              </Button>
              <Button variant="whatsapp" size="xl" onClick={handleWhatsApp}>
                <MessageCircle size={20} />
                Chat on WhatsApp
              </Button>
            </div>

            <p className="mt-8 text-card/70 text-sm">
              Or call us directly at{' '}
              <a href={`tel:${selectedHotel?.contactDetails?.phoneNumber[0]?.number || hotelConfig.phone}`} className="text-card underline hover:no-underline">
                {hotelConfig.phone}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
