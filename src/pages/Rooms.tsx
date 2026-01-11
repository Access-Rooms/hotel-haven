import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Maximize, ArrowRight, SlidersHorizontal, X } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { rooms } from '@/data/hotelData';
import { hotelConfig } from '@/data/hotelData';
import { cn } from '@/lib/utils';

const priceRanges = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under ₹5,000', min: 0, max: 5000 },
  { label: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
  { label: 'Above ₹10,000', min: 10000, max: Infinity },
];

const guestOptions = [1, 2, 3, 4];

export default function Rooms() {
  const [priceFilter, setPriceFilter] = useState(0);
  const [guestFilter, setGuestFilter] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredRooms = rooms.filter((room) => {
    const priceRange = priceRanges[priceFilter];
    const priceMatch = room.price >= priceRange.min && room.price < priceRange.max;
    const guestMatch = guestFilter ? room.maxGuests >= guestFilter : true;
    return priceMatch && guestMatch;
  });

  const clearFilters = () => {
    setPriceFilter(0);
    setGuestFilter(null);
  };

  const hasActiveFilters = priceFilter !== 0 || guestFilter !== null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-hero">
        <div className="container-hotel text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-primary-foreground mb-4">
            Our Rooms & Suites
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Discover the perfect accommodation for your stay at {hotelConfig.name}
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-[72px] z-40 bg-card/95 backdrop-blur-md border-b border-border py-4">
        <div className="container-hotel">
          <div className="flex items-center justify-between gap-4">
            {/* Desktop Filters */}
            <div className="hidden md:flex items-center gap-4">
              {/* Price Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Price:</span>
                <div className="flex gap-1">
                  {priceRanges.map((range, index) => (
                    <button
                      key={range.label}
                      onClick={() => setPriceFilter(index)}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                        priceFilter === index
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      )}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Guest Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Guests:</span>
                <div className="flex gap-1">
                  {guestOptions.map((num) => (
                    <button
                      key={num}
                      onClick={() => setGuestFilter(guestFilter === num ? null : num)}
                      className={cn(
                        'w-9 h-9 rounded-full text-sm font-medium transition-all',
                        guestFilter === num
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      )}
                    >
                      {num}+
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-foreground"
            >
              <SlidersHorizontal size={18} />
              Filters
              {hasActiveFilters && (
                <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {(priceFilter !== 0 ? 1 : 0) + (guestFilter ? 1 : 0)}
                </span>
              )}
            </button>

            {/* Results Count & Clear */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {filteredRooms.length} {filteredRooms.length === 1 ? 'room' : 'rooms'}
              </span>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  <X size={14} />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Mobile Filters Dropdown */}
          {showFilters && (
            <div className="md:hidden mt-4 pt-4 border-t border-border space-y-4">
              <div>
                <span className="text-sm text-muted-foreground block mb-2">Price Range:</span>
                <div className="flex flex-wrap gap-2">
                  {priceRanges.map((range, index) => (
                    <button
                      key={range.label}
                      onClick={() => setPriceFilter(index)}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                        priceFilter === index
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground block mb-2">Minimum Guests:</span>
                <div className="flex gap-2">
                  {guestOptions.map((num) => (
                    <button
                      key={num}
                      onClick={() => setGuestFilter(guestFilter === num ? null : num)}
                      className={cn(
                        'w-10 h-10 rounded-full text-sm font-medium transition-all',
                        guestFilter === num
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {num}+
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Rooms Grid */}
      <section className="py-12">
        <div className="container-hotel">
          <div className="grid md:grid-cols-2 gap-8">
            {filteredRooms.map((room) => (
              <Link
                key={room.id}
                to={`/rooms/${room.id}`}
                className="room-card group flex flex-col lg:flex-row"
              >
                {/* Image */}
                <div className="relative overflow-hidden lg:w-2/5 aspect-[4/3] lg:aspect-auto">
                  <img
                    src={room.images[0]}
                    alt={room.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {room.featured && (
                    <div className="absolute top-4 left-4 bg-hotel-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold">
                      Featured
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 lg:w-3/5 flex flex-col">
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {room.name}
                      </h3>
                      <div className="text-right shrink-0">
                        <p className="text-2xl font-display font-bold text-primary">
                          {hotelConfig.currencySymbol}{room.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">per night</p>
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {room.description}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1.5">
                        <Users size={16} />
                        {room.maxGuests} Guests
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Maximize size={16} />
                        {room.size}
                      </span>
                      <span>{room.bedType} Bed</span>
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-2">
                      {room.amenities.slice(0, 4).map((amenity) => (
                        <span key={amenity} className="amenity-badge text-xs">
                          {amenity}
                        </span>
                      ))}
                      {room.amenities.length > 4 && (
                        <span className="amenity-badge text-xs">
                          +{room.amenities.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                    <span className="text-primary font-medium text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                      View Details
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </span>
                    <Button variant="booking" size="sm">
                      Book Now
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredRooms.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">
                No rooms match your current filters.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
