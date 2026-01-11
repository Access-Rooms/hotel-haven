import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Users, Maximize, Check, Calendar, MessageCircle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { rooms, hotelConfig } from '@/data/hotelData';
import { cn } from '@/lib/utils';

export default function RoomDetails() {
  const { roomId } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  const room = rooms.find((r) => r.id === roomId);

  if (!room) {
    return <Navigate to="/rooms" replace />;
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % room.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + room.images.length) % room.images.length);
  };

  const handleWhatsAppBooking = () => {
    const message = `Hi, I'd like to book the ${room.name} at ${hotelConfig.name}.${
      checkIn ? ` Check-in: ${checkIn}` : ''
    }${checkOut ? `, Check-out: ${checkOut}` : ''}`;
    window.open(
      `https://wa.me/${hotelConfig.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="pt-24 pb-4 bg-muted/50">
        <div className="container-hotel">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/rooms" className="text-muted-foreground hover:text-foreground transition-colors">
              Rooms
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">{room.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-8">
        <div className="container-hotel">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Images & Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src={room.images[currentImageIndex]}
                  alt={`${room.name} - Image ${currentImageIndex + 1}`}
                  className="w-full aspect-[16/10] object-cover"
                />

                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-card transition-colors shadow-soft"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-card transition-colors shadow-soft"
                >
                  <ChevronRight size={24} />
                </button>

                {/* Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {room.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={cn(
                        'w-2.5 h-2.5 rounded-full transition-all',
                        index === currentImageIndex
                          ? 'bg-card w-8'
                          : 'bg-card/50 hover:bg-card/70'
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 overflow-x-auto pb-2">
                {room.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={cn(
                      'shrink-0 w-24 h-16 rounded-lg overflow-hidden ring-2 transition-all',
                      index === currentImageIndex
                        ? 'ring-primary'
                        : 'ring-transparent hover:ring-muted-foreground/30'
                    )}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Room Info */}
              <div>
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  {room.name}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-6">
                  <span className="flex items-center gap-2">
                    <Users size={20} />
                    Up to {room.maxGuests} guests
                  </span>
                  <span className="flex items-center gap-2">
                    <Maximize size={20} />
                    {room.size}
                  </span>
                  <span>{room.bedType} Bed</span>
                </div>

                <p className="text-muted-foreground text-lg leading-relaxed">
                  {room.description}
                </p>
              </div>

              {/* Amenities */}
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                  Room Amenities
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {room.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-hotel-secondary/20 flex items-center justify-center shrink-0">
                        <Check size={16} className="text-hotel-secondary" />
                      </div>
                      <span className="text-foreground">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Policies */}
              <div className="bg-muted/50 rounded-2xl p-6">
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                  Room Policies
                </h2>
                <div className="grid sm:grid-cols-2 gap-6 text-sm">
                  <div>
                    <p className="font-medium text-foreground mb-1">Check-in</p>
                    <p className="text-muted-foreground">From 2:00 PM</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">Check-out</p>
                    <p className="text-muted-foreground">Until 11:00 AM</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">Cancellation</p>
                    <p className="text-muted-foreground">Free cancellation up to 48 hours before check-in</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">Children</p>
                    <p className="text-muted-foreground">Children of all ages are welcome</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Booking Widget */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 booking-widget space-y-6">
                {/* Price */}
                <div className="text-center pb-6 border-b border-border">
                  <p className="text-sm text-muted-foreground mb-1">Starting from</p>
                  <p className="text-4xl font-display font-bold text-primary">
                    {hotelConfig.currencySymbol}{room.price.toLocaleString()}
                  </p>
                  <p className="text-muted-foreground">per night</p>
                </div>

                {/* Date Selection */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      Check-in Date
                    </label>
                    <div className="relative">
                      <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border-0 focus:ring-2 focus:ring-primary text-foreground"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      Check-out Date
                    </label>
                    <div className="relative">
                      <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border-0 focus:ring-2 focus:ring-primary text-foreground"
                      />
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <Button variant="booking" size="xl" className="w-full">
                    Reserve Now
                  </Button>
                  <Button
                    variant="whatsapp"
                    size="lg"
                    className="w-full"
                    onClick={handleWhatsAppBooking}
                  >
                    <MessageCircle size={18} />
                    Book via WhatsApp
                  </Button>
                </div>

                {/* Guarantee */}
                <p className="text-center text-sm text-muted-foreground">
                  ✓ Best rate guaranteed • ✓ No hidden fees
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Rooms */}
      <section className="py-16 bg-muted/50">
        <div className="container-hotel">
          <h2 className="font-display text-2xl font-bold text-foreground mb-8">
            You May Also Like
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {rooms
              .filter((r) => r.id !== room.id)
              .slice(0, 3)
              .map((otherRoom) => (
                <Link
                  key={otherRoom.id}
                  to={`/rooms/${otherRoom.id}`}
                  className="room-card group"
                >
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <img
                      src={otherRoom.images[0]}
                      alt={otherRoom.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                      {otherRoom.name}
                    </h3>
                    <p className="text-primary font-semibold">
                      {hotelConfig.currencySymbol}{otherRoom.price.toLocaleString()}/night
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
