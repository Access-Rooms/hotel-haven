import { Link } from 'react-router-dom';
import { Users, Maximize, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { rooms } from '@/data/hotelData';
import { hotelConfig } from '@/data/hotelData';

export function FeaturedRooms() {
  const featuredRooms = rooms.filter((room) => room.featured);

  return (
    <section className="py-20 lg:py-28 bg-muted/50">
      <div className="container-hotel">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-hotel-secondary font-medium tracking-wider uppercase text-sm mb-4">
            Accommodations
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Featured Rooms & Suites
          </h2>
          <p className="text-muted-foreground text-lg">
            Discover our handpicked selection of luxurious accommodations, each offering unique experiences and stunning views.
          </p>
        </div>

        {/* Rooms Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredRooms.map((room, index) => (
            <Link
              key={room.id}
              to={`/rooms/${room.id}`}
              className="room-card group block"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="relative overflow-hidden aspect-[4/3]">
                <img
                  src={room.images[0]}
                  alt={room.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 bg-hotel-secondary text-secondary-foreground px-3 py-1.5 rounded-full text-sm font-semibold">
                  From {hotelConfig.currencySymbol}{room.price.toLocaleString()}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {room.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {room.shortDescription}
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
                </div>

                {/* Amenities Preview */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {room.amenities.slice(0, 3).map((amenity) => (
                    <span key={amenity} className="amenity-badge text-xs">
                      {amenity}
                    </span>
                  ))}
                  {room.amenities.length > 3 && (
                    <span className="amenity-badge text-xs">
                      +{room.amenities.length - 3} more
                    </span>
                  )}
                </div>

                {/* CTA */}
                <div className="flex items-center text-primary font-medium text-sm group-hover:gap-3 gap-2 transition-all">
                  View Details
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link to="/rooms">
              View All Rooms
              <ArrowRight size={18} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
