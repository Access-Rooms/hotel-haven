import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Users, ChevronDown, Search, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { hotelConfig } from '@/data/hotelData';
import { cn } from '@/lib/utils';
import { Hotel } from '@/models/home.models';
import { useBooking } from '@/contexts/BookingContext';
import { useHotels } from '@/contexts/HotelContext';
import { environment } from '../../../environment';

interface HeroSectionProps {
  hotels?: Hotel[];
}

export function HeroSection({ hotels }: HeroSectionProps) {
  const { checkIn, checkOut, guests, setCheckIn, setCheckOut, setGuests } = useBooking();
  const { selectedHotel: contextSelectedHotel, setSelectedHotel: setContextSelectedHotel } = useHotels();
  const [localSelectedHotel, setLocalSelectedHotel] = useState<Hotel | null>(
    contextSelectedHotel || hotels?.[0] || null
  );
  

  // Update local hotel when context or hotels prop changes
  useEffect(() => {
    if (contextSelectedHotel) {
      setLocalSelectedHotel(contextSelectedHotel);
    } else if (hotels?.[0]) {
      setLocalSelectedHotel(hotels[0]);
    }
  }, [contextSelectedHotel, hotels]);

  // Handle hotel selection change
  const handleHotelChange = (hotelId: string) => {
    const hotel = hotels?.find(h => h._id === hotelId);
    if (hotel) {
      setLocalSelectedHotel(hotel);
      setContextSelectedHotel(hotel);
    }
  };

  const getImageUrl = (imagePath: string | undefined): string | null => {
    if (!imagePath) return null;
    // If already a full URL, return as is
    if (typeof imagePath === 'string' && (imagePath.startsWith('http://') || imagePath.startsWith('https://'))) {
      return imagePath;
    }
    return `${environment.imageBaseUrl}${imagePath}`;
  };

  const showHotelSelector = hotels && hotels.length > 1;
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={getImageUrl(localSelectedHotel?.websiteData?.coverImage) || "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&q=80"}
          alt="Ocean Pearl Resort"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-overlay" />
        <div className="absolute inset-0 bg-foreground/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-hotel text-center pt-20 pb-32">
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-up">
          {/* <p className="text-hotel-secondary font-medium tracking-wider uppercase text-sm">
            Welcome to {localSelectedHotel?.hotelName}
          </p> */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-card leading-tight">
            {localSelectedHotel?.hotelName}
          </h1>
          <p className="text-card/90 text-lg sm:text-xl max-w-2xl mx-auto">
          {localSelectedHotel?.websiteData?.highlightText || ('. Discover the perfect blend of luxury, comfort, and breathtaking ocean views at ' + localSelectedHotel?.locationName)}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button variant="hero" size="xl" asChild>
              <Link to={localSelectedHotel?._id ? `/rooms?hotelId=${localSelectedHotel._id}` : '/rooms'}>Explore Rooms</Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <Link to={localSelectedHotel?._id ? `/gallery?hotelId=${localSelectedHotel._id}` : '/gallery'}>View Gallery</Link>
            </Button>
          </div>
        </div>

        {/* Booking Widget */}
        <div className="mt-16 max-w-5xl mx-auto animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="booking-widget">
            <div className={cn(
              "grid gap-4",
              showHotelSelector 
                ? "grid-cols-1 md:grid-cols-5" 
                : "grid-cols-1 md:grid-cols-4"
            )}>
              {/* Hotel Selector - Only show if multiple hotels */}
              {showHotelSelector && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Property
                  </label>
                  <div className="relative">
                    <Building2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <select
                      value={localSelectedHotel?._id || ''}
                      onChange={(e) => handleHotelChange(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 rounded-xl bg-muted border-0 focus:ring-2 focus:ring-primary text-foreground appearance-none cursor-pointer"
                    >
                      {hotels?.map((hotel) => (
                        <option key={hotel._id} value={hotel._id}>
                          {hotel.hotelName}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              )}

              {/* Check-in */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Check-in
                </label>
                <div className="relative">
                  <CalendarDays size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border-0 focus:ring-2 focus:ring-primary text-foreground"
                  />
                </div>
              </div>

              {/* Check-out */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Check-out
                </label>
                <div className="relative">
                  <CalendarDays size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border-0 focus:ring-2 focus:ring-primary text-foreground"
                  />
                </div>
              </div>

              {/* Guests */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Guests
                </label>
                <div className="relative">
                  <Users size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-muted border-0 focus:ring-2 focus:ring-primary text-foreground appearance-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Search Button */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-transparent uppercase tracking-wider hidden md:block">
                  Search
                </label>
                <Button variant="booking" size="lg" className="w-full h-[50px]" asChild>
                  <Link to={localSelectedHotel?._id ? `/rooms?hotelId=${localSelectedHotel._id}` : '/rooms'}>
                    <Search size={18} />
                    Check Availability
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 rounded-full border-2 border-card/50 flex items-start justify-center p-1.5">
          <div className="w-1.5 h-3 rounded-full bg-card/70 animate-pulse-soft" />
        </div>
      </div>
    </section>
  );
}
