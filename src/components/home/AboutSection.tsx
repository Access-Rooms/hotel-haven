import { Check } from 'lucide-react';
import { hotelConfig } from '@/data/hotelData';
import { Hotel } from '@/models/home.models';
import { useEffect, useState, useMemo } from 'react';
import { environment } from '../../../environment';

const highlights = [
  'Beachfront location with private access',
  'Award-winning spa & wellness center',
  'Multiple dining experiences',
  'Personalized concierge service',
];

export function AboutSection({ hotel }: { hotel: Hotel | null }) {
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(hotel);
  useEffect(() => {
    if (hotel) {
      setSelectedHotel(hotel);
    }
  }, [hotel]);

  // Collect hotel images with fallbacks
  const hotelImages = useMemo(() => {
    // Helper to construct full image URL
    const getImageUrl = (imagePath: string | undefined): string | null => {
      if (!imagePath) return null;
      // If already a full URL, return as is
      if (typeof imagePath === 'string' && (imagePath.startsWith('http://') || imagePath.startsWith('https://'))) {
        return imagePath;
      }
      return `${environment.imageBaseUrl}${imagePath}`;
    };

    const images: string[] = [];

    if (selectedHotel) {
      // Add cover image if available
      if (selectedHotel.coverImages) {
        const coverUrl = getImageUrl(selectedHotel.coverImages);
        if (coverUrl) {
          images.push(coverUrl);
        }
      }

      // Add interior images
      if (selectedHotel.interiorImage && Array.isArray(selectedHotel.interiorImage)) {
        selectedHotel.interiorImage.forEach((img) => {
          const imagePath = typeof img === 'string' ? img : img?.url || img?.path || img;
          const imageUrl = getImageUrl(imagePath);
          if (imageUrl) {
            images.push(imageUrl);
          }
        });
      }

      // Add additional images
      if (selectedHotel.additionalImages && Array.isArray(selectedHotel.additionalImages)) {
        selectedHotel.additionalImages.forEach((img) => {
          const imageUrl = getImageUrl(img);
          if (imageUrl) {
            images.push(imageUrl);
          }
        });
      }
    }

    console.log('Total hotel images collected:', images.length);

    // Fallback to dummy images if no hotel images available
    const defaultImages = [
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600',
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600',
    ];

    // Use hotel images if available, fill remaining slots with defaults
    const result = [
      images[0] || defaultImages[0],
      images[1] || defaultImages[1],
      images[2] || defaultImages[2],
    ];

    console.log('Final images array:', result);
    return result;
  }, [selectedHotel]);

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container-hotel">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Images Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-card">
                  <img
                    src={hotelImages[0]}
                    alt={selectedHotel?.hotelName ? `${selectedHotel.hotelName} - View 1` : 'Pool view'}
                    className="w-full h-48 sm:h-64 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-card">
                  <img
                    src={hotelImages[1]}
                    alt={selectedHotel?.hotelName ? `${selectedHotel.hotelName} - View 2` : 'Spa'}
                    className="w-full h-32 sm:h-40 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="pt-8">
                <div className="rounded-2xl overflow-hidden shadow-card h-full">
                  <img
                    src={hotelImages[2]}
                    alt={selectedHotel?.hotelName ? `${selectedHotel.hotelName} - View 3` : 'Room'}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-6 sm:bottom-8 sm:-right-8 bg-hotel-secondary text-secondary-foreground rounded-2xl p-4 sm:p-6 shadow-elevated">
              <p className="text-3xl sm:text-4xl font-display font-bold">6+</p>
              <p className="text-sm opacity-90">Years of Excellence</p>
            </div>
          </div>

          {/* Content */}
          <div className="lg:pl-8">
            <p className="text-hotel-secondary font-medium tracking-wider uppercase text-sm mb-4">
              About Our Hotel
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              {selectedHotel?.websiteData?.title}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              {selectedHotel?.websiteData?.description || 
                `Nestled along the pristine shores of ${selectedHotel?.locationName} offers an unparalleled escape where traditional Goan hospitality meets contemporary luxury. Every detail is thoughtfully curated to create lasting memories for our distinguished guests.`}
            </p>
            <ul className="space-y-4 mb-8">
              {(selectedHotel?.websiteData?.features && selectedHotel.websiteData.features.length > 0
                ? selectedHotel.websiteData.features
                : highlights
              ).map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-hotel-secondary/20 flex items-center justify-center shrink-0">
                    <Check size={14} className="text-hotel-secondary" />
                  </div>
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>

            {/* <ul className="space-y-4 mb-8">
              {highlights.map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-hotel-secondary/20 flex items-center justify-center shrink-0">
                    <Check size={14} className="text-hotel-secondary" />
                  </div>
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul> */}

            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-3xl font-display font-bold text-primary">{selectedHotel?.totalRooms}</p>
                <p className="text-sm text-muted-foreground">Total Rooms</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <p className="text-3xl font-display font-bold text-primary">4.9</p>
                <p className="text-sm text-muted-foreground">Guest Rating</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <p className="text-3xl font-display font-bold text-primary">24/7</p>
                <p className="text-sm text-muted-foreground">Concierge</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
