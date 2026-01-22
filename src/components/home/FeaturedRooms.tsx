import { Link } from 'react-router-dom';
import { Users, Maximize, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { rooms } from '@/data/hotelData';
import { hotelConfig } from '@/data/hotelData';
import { Hotel } from '@/models/home.models';
import { useEffect, useState } from 'react';
import { GetRoomsListPayload, Room } from '@/models/room.models';
import { homeService } from '@/services/home.service';
import { ApiResponse } from '@/models/common.models';
import { useBooking } from '@/contexts/BookingContext';
import { environment } from '../../../environment';

interface FeaturedRoomsProps {
  hotels?: Hotel[];
}

export function FeaturedRooms({ hotels }: FeaturedRoomsProps) {
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(hotels?.[0] || null);
  const [roomsData, setRoomsData] = useState<Room[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { dateFilter } = useBooking();

  // Fallback to static data if API data is not available
  const staticFeaturedRooms = rooms.filter((room) => room.featured);

  useEffect(() => {
    if (hotels && hotels.length > 0) {
      setSelectedHotel(hotels[0]);
    }
  }, [hotels]);

  useEffect(() => {
    const fetchRooms = async () => {
      if (selectedHotel) {
        try {
          setIsLoading(true);
          const payload: GetRoomsListPayload = {
            hotelId: selectedHotel._id,
            // dateFilter: dateFilter,
            packageType: 'B2B',
            showRoomsWithRate: true,
          };
          const response: ApiResponse<Room[]> = await homeService.getRoomsList(payload);
          setRoomsData(response.data);
        } catch (error) {
          console.error('Error fetching rooms:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchRooms();
  }, [selectedHotel, dateFilter]);

  // Use API rooms if available, otherwise use static data
  const displayRooms = roomsData && roomsData.length > 0 
    ? roomsData.slice(0, 6) // Show first 6 rooms from API
    : staticFeaturedRooms;
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
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading rooms...</p>
          </div>
        ) : displayRooms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No rooms available at the moment.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayRooms.map((room, index) => {
              // Handle API Room structure
              const isApiRoom = '_id' in room;
              const roomId = isApiRoom ? room._id : (room as any).id;
              const roomName = isApiRoom ? room.roomsDisplayName : (room as any).name;
              
              // Construct image URL - prepend base URL for API rooms
              let roomImage: string;
              if (isApiRoom) {
                const imagePath = room.roomImage || (room.roomAdditionalImages?.[0] || '');
                // If image path doesn't start with http, prepend base URL
                roomImage = imagePath 
                  ? (imagePath.startsWith('http') 
                      ? imagePath 
                      : `${environment.imageBaseUrl}${imagePath}`)
                  : '';
              } else {
                roomImage = (room as any).images[0];
              }
              const roomPrice = isApiRoom 
                ? (room.pricing && room.pricing.length > 0 
                    ? Math.min(...room.pricing.map(p => p.basePrice))
                    : 0)
                : (room as any).price;
              const roomGuests = isApiRoom ? room.totalOccupency : (room as any).maxGuests;
              const roomSize = isApiRoom 
                ? (room.roomSize?.area ? `${room.roomSize.area} sqm` : 'N/A')
                : (room as any).size;
              const roomDescription = isApiRoom 
                ? `${room.roomCategory?.category_name || ''} ${room.roomView || ''}`.trim()
                : (room as any).shortDescription;
              const roomAmenities = isApiRoom 
                ? [
                    room.roomView || '',
                    room.bedView || '',
                    room.viewType || ''
                  ].filter(Boolean)
                : (room as any).amenities || [];

              return (
                <Link
                  key={roomId}
                  to={`/rooms/${roomId}`}
                  className="room-card group block"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Image */}
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <img
                      src={roomImage || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'}
                      alt={roomName}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                    {roomPrice > 0 && (
                      <div className="absolute top-4 right-4 bg-hotel-secondary text-secondary-foreground px-3 py-1.5 rounded-full text-sm font-semibold">
                        From {hotelConfig.currencySymbol}{roomPrice.toLocaleString()}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {roomName}
                      </h3>
                      {roomPrice > 0 && (
                        <div className="text-right ml-4">
                          <div className="text-hotel-secondary font-bold text-lg">
                            {hotelConfig.currencySymbol}{roomPrice.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">per night</div>
                        </div>
                      )}
                    </div>
                    {roomDescription && (
                      <p className="text-muted-foreground text-sm mb-4">
                        {roomDescription}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      {roomGuests > 0 && (
                        <span className="flex items-center gap-1.5">
                          <Users size={16} />
                          {roomGuests} {roomGuests === 1 ? 'Guest' : 'Guests'}
                        </span>
                      )}
                      {roomSize && roomSize !== 'N/A' && (
                        <span className="flex items-center gap-1.5">
                          <Maximize size={16} />
                          {roomSize}
                        </span>
                      )}
                    </div>

                    {/* Amenities Preview */}
                    {roomAmenities.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {roomAmenities.slice(0, 3).map((amenity, idx) => (
                          <span key={idx} className="amenity-badge text-xs">
                            {amenity}
                          </span>
                        ))}
                        {roomAmenities.length > 3 && (
                          <span className="amenity-badge text-xs">
                            +{roomAmenities.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* CTA */}
                    <div className="flex items-center text-primary font-medium text-sm group-hover:gap-3 gap-2 transition-all">
                      View Details
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* View All */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link to={`/rooms?hotelId=${selectedHotel?._id}`}>
              View All Rooms
              <ArrowRight size={18} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
