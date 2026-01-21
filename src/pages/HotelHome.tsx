import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Star, Wifi, Waves, Sparkles, UtensilsCrossed, Car, Dumbbell, Umbrella, Briefcase, ChefHat, Plane } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  companyConfig,
  getHotelBySlug, 
  getLocationById,
  getRoomsByHotel,
  getReviewsByHotel,
  getGalleryByHotel 
} from '@/data/companyData';
import { useBooking } from '@/contexts/BookingContext';
import { HeroSection } from '@/components/home/HeroSection';
import { AboutSection } from '@/components/home/AboutSection';
import { FeaturedRooms } from '@/components/home/FeaturedRooms';
import { AmenitiesSection } from '@/components/home/AmenitiesSection';
import { GalleryPreview } from '@/components/home/GalleryPreview';
import { ReviewsSection } from '@/components/home/ReviewsSection';
import { CTASection } from '@/components/home/CTASection';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function HotelHome() {
  const { hotelSlug } = useParams();
  const { setHotel } = useBooking();
  
  const hotel = hotelSlug ? getHotelBySlug(hotelSlug) : undefined;
  const location = hotel ? getLocationById(hotel.locationId) : undefined;
  const rooms = hotel ? getRoomsByHotel(hotel.id) : [];
  const reviews = hotel ? getReviewsByHotel(hotel.id) : [];
  const featuredRooms = rooms.filter(r => r.featured);

  // Set hotel in context - must be before conditional return
  React.useEffect(() => {
    if (hotel) {
      setHotel(hotel.id);
    }
  }, [hotel, setHotel]);
  
  if (!hotel) {
    return <Navigate to="/locations" replace />;
  }

  // Create hotel config for components
  const hotelConfig = {
    id: hotel.id,
    name: hotel.name,
    tagline: hotel.tagline,
    logo: hotel.logo,
    primaryColor: companyConfig.primaryColor,
    secondaryColor: companyConfig.secondaryColor,
    location: location?.name || '',
    address: hotel.address,
    phone: hotel.phone,
    email: hotel.email,
    whatsappNumber: hotel.whatsappNumber,
    currency: companyConfig.currency,
    currencySymbol: companyConfig.currencySymbol,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumb Bar */}
      <div className="fixed top-[72px] left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-b border-border py-3">
        <div className="container-hotel">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/locations">Locations</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={`/locations/${location?.slug}`}>{location?.name}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium">{hotel.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center pt-32">
        <div className="absolute inset-0">
          <img 
            src={hotel.images[0]} 
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>
        
        <div className="container-hotel relative z-10 py-20">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-white/20 text-white border-0">
                {hotel.starRating} <Star size={12} className="ml-1 fill-amber-400 text-amber-400" />
              </Badge>
              <div className="flex items-center gap-1 text-white/80">
                <MapPin size={14} />
                <span className="text-sm">{location?.name}</span>
              </div>
            </div>
            
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4">
              {hotel.name}
            </h1>
            <p className="text-xl text-white/80 mb-8">
              {hotel.tagline}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="lg" asChild>
                <Link to={`/hotels/${hotel.slug}/rooms`}>View Rooms</Link>
              </Button>
              <Button variant="heroOutline" size="lg" asChild>
                <a href={`tel:${hotel.phone}`}>
                  <Phone size={18} className="mr-2" />
                  Call Us
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container-hotel">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Welcome to {hotel.name}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                {hotel.description}
              </p>
              
              <div className="flex items-center gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-2 rounded-lg">
                    <Star size={18} className="fill-current" />
                    <span className="font-bold">{hotel.rating}</span>
                  </div>
                  <span className="text-muted-foreground">
                    ({hotel.reviewCount} reviews)
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin size={18} className="text-primary" />
                  <span>{hotel.address}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone size={18} className="text-primary" />
                  <span>{hotel.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail size={18} className="text-primary" />
                  <span>{hotel.email}</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {hotel.images.slice(0, 4).map((image, index) => (
                <div 
                  key={index}
                  className={`rounded-2xl overflow-hidden ${index === 0 ? 'col-span-2' : ''}`}
                >
                  <img 
                    src={image} 
                    alt={`${hotel.name} ${index + 1}`}
                    className="w-full h-48 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="py-16 bg-muted/30">
        <div className="container-hotel">
          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-12">
            Hotel Amenities
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {hotel.amenities.map((amenity) => (
              <div 
                key={amenity}
                className="flex flex-col items-center gap-3 p-6 bg-card rounded-2xl border border-border"
              >
                <AmenityIcon name={amenity} />
                <span className="text-sm font-medium text-foreground text-center">{amenity}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      {featuredRooms.length > 0 && (
        <section className="py-20">
          <div className="container-hotel">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="font-display text-3xl font-bold text-foreground mb-2">
                  Our Rooms
                </h2>
                <p className="text-muted-foreground">
                  Choose from our selection of luxurious accommodations
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link to={`/hotels/${hotel.slug}/rooms`}>View All Rooms</Link>
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredRooms.slice(0, 3).map((room) => (
                <Link 
                  key={room.id}
                  to={`/hotels/${hotel.slug}/rooms/${room.id}`}
                  className="group bg-card rounded-2xl border border-border overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300"
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img 
                      src={room.images[0]} 
                      alt={room.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                      {room.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {room.shortDescription}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-bold text-foreground">
                        {companyConfig.currencySymbol}{room.price.toLocaleString()}
                        <span className="text-sm font-normal text-muted-foreground">/night</span>
                      </p>
                      <Badge variant="outline">{room.maxGuests} Guests</Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container-hotel">
            <h2 className="font-display text-3xl font-bold text-foreground text-center mb-12">
              What Our Guests Say
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.slice(0, 3).map((review) => (
                <div 
                  key={review.id}
                  className="bg-card rounded-2xl p-6 border border-border"
                >
                  <div className="flex items-center gap-3 mb-4">
                    {review.avatar && (
                      <img 
                        src={review.avatar} 
                        alt={review.guestName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-foreground">{review.guestName}</p>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-gradient-hero text-primary-foreground">
        <div className="container-hotel text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ready to Book Your Stay?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            Experience the best of {location?.name} at {hotel.name}. Book now for the best rates.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="hero" size="lg" asChild>
              <Link to={`/hotels/${hotel.slug}/rooms`}>Book Now</Link>
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}

function AmenityIcon({ name }: { name: string }) {
  const iconClass = "w-8 h-8 text-primary";
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('wifi')) return <Wifi className={iconClass} />;
  if (lowerName.includes('pool')) return <Waves className={iconClass} />;
  if (lowerName.includes('spa')) return <Sparkles className={iconClass} />;
  if (lowerName.includes('restaurant') || lowerName.includes('dining')) return <UtensilsCrossed className={iconClass} />;
  if (lowerName.includes('parking')) return <Car className={iconClass} />;
  if (lowerName.includes('gym') || lowerName.includes('fitness')) return <Dumbbell className={iconClass} />;
  if (lowerName.includes('beach')) return <Umbrella className={iconClass} />;
  if (lowerName.includes('business') || lowerName.includes('meeting')) return <Briefcase className={iconClass} />;
  if (lowerName.includes('kitchen')) return <ChefHat className={iconClass} />;
  if (lowerName.includes('airport')) return <Plane className={iconClass} />;
  
  return <Star className={iconClass} />;
}
