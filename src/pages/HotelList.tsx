import { useState, useMemo, useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { MapPin, Star, Users, ChevronRight, SlidersHorizontal, X } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { 
  companyConfig, 
  getLocationBySlug, 
  getHotelsByLocation,
  amenities 
} from '@/data/companyData';
import { useBooking } from '@/contexts/BookingContext';
import { cn } from '@/lib/utils';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function HotelList() {
  const { locationSlug } = useParams();
  const { setLocation } = useBooking();
  
  // Filters state - all hooks must be before any returns
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [starFilter, setStarFilter] = useState<number[]>([]);
  const [amenityFilter, setAmenityFilter] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const location = locationSlug ? getLocationBySlug(locationSlug) : undefined;
  const allHotels = location ? getHotelsByLocation(location.id) : [];

  // Set location in context
  useEffect(() => {
    if (location) {
      setLocation(location.id);
    }
  }, [location, setLocation]);

  const filteredHotels = useMemo(() => {
    return allHotels.filter(hotel => {
      if (hotel.priceFrom < priceRange[0] || hotel.priceFrom > priceRange[1]) {
        return false;
      }
      if (starFilter.length > 0 && !starFilter.includes(hotel.starRating)) {
        return false;
      }
      if (amenityFilter.length > 0) {
        const hasAllAmenities = amenityFilter.every(
          amenity => hotel.amenities.some(a => a.toLowerCase().includes(amenity.toLowerCase()))
        );
        if (!hasAllAmenities) return false;
      }
      return true;
    });
  }, [allHotels, priceRange, starFilter, amenityFilter]);

  // Redirects after all hooks
  if (allHotels.length === 1) {
    return <Navigate to={`/hotels/${allHotels[0].slug}`} replace />;
  }

  if (!location) {
    return <Navigate to="/locations" replace />;
  }

  const toggleStarFilter = (star: number) => {
    setStarFilter(prev => 
      prev.includes(star) ? prev.filter(s => s !== star) : [...prev, star]
    );
  };

  const toggleAmenityFilter = (amenity: string) => {
    setAmenityFilter(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const clearFilters = () => {
    setPriceRange([0, 20000]);
    setStarFilter([]);
    setAmenityFilter([]);
  };

  const hasActiveFilters = starFilter.length > 0 || amenityFilter.length > 0 || priceRange[0] > 0 || priceRange[1] < 20000;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h4 className="font-semibold text-foreground mb-4">Price Range</h4>
        <Slider
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          min={0}
          max={20000}
          step={500}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{companyConfig.currencySymbol}{priceRange[0]}</span>
          <span>{companyConfig.currencySymbol}{priceRange[1]}+</span>
        </div>
      </div>

      {/* Star Rating */}
      <div>
        <h4 className="font-semibold text-foreground mb-4">Star Rating</h4>
        <div className="flex flex-wrap gap-2">
          {[5, 4, 3].map((star) => (
            <button
              key={star}
              onClick={() => toggleStarFilter(star)}
              className={cn(
                'flex items-center gap-1 px-3 py-2 rounded-lg border transition-colors',
                starFilter.includes(star)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background border-border hover:border-primary'
              )}
            >
              <Star size={14} className={starFilter.includes(star) ? 'fill-current' : ''} />
              <span className="text-sm">{star}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <h4 className="font-semibold text-foreground mb-4">Amenities</h4>
        <div className="space-y-3">
          {['Pool', 'Spa', 'WiFi', 'Restaurant', 'Gym', 'Parking'].map((amenity) => (
            <label key={amenity} className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={amenityFilter.includes(amenity)}
                onCheckedChange={() => toggleAmenityFilter(amenity)}
              />
              <span className="text-sm text-foreground">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Banner */}
      <section className="relative pt-24 pb-12">
        <div className="absolute inset-0 h-64">
          <img 
            src={location.image} 
            alt={location.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-background" />
        </div>
        
        <div className="container-hotel relative z-10 pt-12">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" className="text-white/80 hover:text-white">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-white/60" />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/locations" className="text-white/80 hover:text-white">Locations</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-white/60" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white font-medium">{location.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
            Hotels in {location.name}
          </h1>
          <p className="text-white/80 text-lg mb-4">
            {location.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {location.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-white/20 text-white border-0">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container-hotel">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Filters */}
            <aside className="hidden lg:block w-72 shrink-0">
              <div className="sticky top-24 bg-card rounded-2xl border border-border p-6 shadow-card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-foreground">Filters</h3>
                  {hasActiveFilters && (
                    <button 
                      onClick={clearFilters}
                      className="text-sm text-primary hover:underline"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <FilterContent />
              </div>
            </aside>

            {/* Hotels Grid */}
            <div className="flex-1">
              {/* Mobile Filter Button */}
              <div className="lg:hidden mb-6">
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <SlidersHorizontal size={18} className="mr-2" />
                      Filters
                      {hasActiveFilters && (
                        <Badge className="ml-2" variant="secondary">
                          {starFilter.length + amenityFilter.length + (priceRange[0] > 0 || priceRange[1] < 20000 ? 1 : 0)}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 overflow-y-auto">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Results Count */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  {filteredHotels.length} {filteredHotels.length === 1 ? 'hotel' : 'hotels'} found
                </p>
              </div>

              {/* Hotel Cards */}
              {filteredHotels.length > 0 ? (
                <div className="space-y-6">
                  {filteredHotels.map((hotel) => (
                    <HotelCard key={hotel.id} hotel={hotel} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-muted/30 rounded-2xl">
                  <MapPin className="mx-auto text-muted-foreground mb-4" size={48} />
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    No hotels match your filters
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters to see more results
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}

interface HotelCardProps {
  hotel: {
    id: string;
    slug: string;
    name: string;
    shortDescription: string;
    images: string[];
    rating: number;
    reviewCount: number;
    priceFrom: number;
    starRating: number;
    amenities: string[];
    address: string;
  };
}

function HotelCard({ hotel }: HotelCardProps) {
  return (
    <Link 
      to={`/hotels/${hotel.slug}`}
      className="group flex flex-col md:flex-row bg-card rounded-2xl border border-border overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300"
    >
      {/* Image */}
      <div className="md:w-80 shrink-0">
        <div className="aspect-[4/3] md:aspect-auto md:h-full relative overflow-hidden">
          <img 
            src={hotel.images[0]} 
            alt={hotel.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4">
            <Badge className="bg-white/90 text-foreground">
              {hotel.starRating} <Star size={12} className="ml-1 fill-amber-400 text-amber-400" />
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col">
        <div className="flex-1">
          <h3 className="font-display font-bold text-xl text-foreground mb-2 group-hover:text-primary transition-colors">
            {hotel.name}
          </h3>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <MapPin size={14} />
            <span>{hotel.address.split(',').slice(-2).join(',').trim()}</span>
          </div>

          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {hotel.shortDescription}
          </p>

          {/* Amenities */}
          <div className="flex flex-wrap gap-2 mb-4">
            {hotel.amenities.slice(0, 4).map((amenity) => (
              <Badge key={amenity} variant="outline" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {hotel.amenities.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{hotel.amenities.length - 4} more
              </Badge>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-lg">
              <Star size={14} className="fill-current" />
              <span className="text-sm font-semibold">{hotel.rating}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              ({hotel.reviewCount} reviews)
            </span>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-end justify-between mt-4 pt-4 border-t border-border">
          <div>
            <p className="text-sm text-muted-foreground">Starting from</p>
            <p className="text-2xl font-bold text-foreground">
              {companyConfig.currencySymbol}{hotel.priceFrom.toLocaleString()}
              <span className="text-sm font-normal text-muted-foreground">/night</span>
            </p>
          </div>
          <Button className="group-hover:translate-x-1 transition-transform">
            View Rooms
            <ChevronRight size={18} className="ml-1" />
          </Button>
        </div>
      </div>
    </Link>
  );
}
