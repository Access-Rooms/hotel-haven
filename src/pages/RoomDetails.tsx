import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, Navigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Users, Maximize, Check, Calendar, MessageCircle, Bed, Baby, Eye, Layers, Youtube } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { rooms, hotelConfig } from '@/data/hotelData';
import { cn } from '@/lib/utils';
import { roomService } from '@/services/room.service';
import { RoomDetailsResponse, Room, GetRoomByIdPayload } from '@/models/room.models';
import { environment } from '../../environment';
import { useHotels } from '@/contexts/HotelContext';
import { useBooking } from '@/contexts/BookingContext';

export default function RoomDetails() {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const hotelIdFromQuery = searchParams.get('hotelId');
  const { selectedHotel } = useHotels();
  const { checkIn, checkOut, setCheckIn, setCheckOut, dateFilter } = useBooking();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [roomDetails, setRoomDetails] = useState<RoomDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch room details from API
  useEffect(() => {
    const fetchRoomDetails = async () => {
      if (!roomId) {
        setIsLoading(false);
        return;
      }

      // Get hotelId from query params or selectedHotel
      const hotelId = hotelIdFromQuery || selectedHotel?._id;
      if (!hotelId) {
        setIsLoading(false);
        setError(new Error('Hotel ID is required'));
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const payload: GetRoomByIdPayload = {
          hotelId: hotelId,
          roomId: roomId,
          dateFilter: dateFilter,
          packageType: 'B2B',
          showRoomsWithRate: true,
        };
        
        const response = await roomService.getRoomById(payload);
        setRoomDetails(response);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch room details'));
        console.error('Error fetching room details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomDetails();
  }, [roomId, hotelIdFromQuery, selectedHotel?._id, dateFilter]);

  // Map API response to display format
  const room = roomDetails?.data;
  const roomImages: string[] = room
    ? [
        ...(room.roomImage ? [room.roomImage] : []),
        ...(room.roomAdditionalImages || [])
      ]
        .filter(Boolean)
        .map((img) => 
          img.startsWith('http') ? img : `${environment.imageBaseUrl}${img}`
        )
    : [];

  const roomName = room?.roomsDisplayName || 'Room';
  
  // Get pricing - prefer package array, fallback to pricing array
  const availablePricing = roomDetails?.package && roomDetails.package.length > 0
    ? roomDetails.package
    : (room?.pricing || []);
  
  const roomPrice = availablePricing.length > 0
    ? Math.min(...availablePricing.map(p => p.netRate))
    : 0;
  
  // Get the selected pricing package (lowest rate or first available)
  const selectedPricing = availablePricing.length > 0
    ? availablePricing.reduce((min, p) => p.netRate < min.netRate ? p : min)
    : null;
  
  const roomGuests = room?.totalOccupency || 0;
  const roomSize = room?.roomSize?.area ? `${room.roomSize.area} sqm` : 'N/A';
  const roomDimensions = room?.roomSize 
    ? `${room.roomSize.roomLength}m × ${room.roomSize.roomWidth}m`
    : null;
  const roomBedType = room?.bedView || 'Standard';
  const roomCategory = room?.roomCategory?.category_name || '';
  const roomView = room?.roomView || '';
  const viewType = room?.viewType || '';
  const roomDescription = `${roomCategory} ${roomView}`.trim() || 'Luxurious room with modern amenities';
  
  // Occupancy details
  const minAdults = room?.minAdults || 0;
  const maxAdults = room?.maxAdults || 0;
  const maxChilds = room?.maxChilds || 0;
  const infantAge = room?.infantAge || '';
  const childAge = room?.childAge || '';
  const totalRooms = room?.totalRooms || 0;
  const minRoomsForGroup = room?.minRoomsForGroupBooking || 0;
  
  // Special inclusions
  const specialInclusions = [];
  if (room?.isCake) specialInclusions.push({ name: 'Cake Service', rate: room.cakeRate });
  if (room?.isFruitBasketIncluded) specialInclusions.push({ name: 'Fruit Basket', rate: room.fruitBasketRate, included: true });
  if (room?.isBBQGrillIncluded) specialInclusions.push({ name: 'BBQ Grill', rate: room.bbqGrillRate, included: true });
  if (room?.cookAndButlerServiceIncluded) specialInclusions.push({ name: 'Cook & Butler Service', rate: room.cookAndButlerServiceRate, included: true });
  if (room?.honeyMoonInclusion) specialInclusions.push({ name: 'Honeymoon Package', rate: room.honeyMoonRate, included: true });
  
  // Additional services/rates
  const additionalServices = [];
  if (room?.breakfastRate > 0) additionalServices.push({ name: 'Breakfast', rate: room.breakfastRate });
  if (room?.lunchRate > 0) additionalServices.push({ name: 'Lunch', rate: room.lunchRate });
  if (room?.dinnerRate > 0) additionalServices.push({ name: 'Dinner', rate: room.dinnerRate });
  if (room?.snacksRate > 0) additionalServices.push({ name: 'Snacks', rate: room.snacksRate });
  
  // Map facilities from API response
  const roomAmenities = roomDetails?.facilities
    ?.filter(f => f.isSelected)
    .map(f => f.name) || [];

  // Get hotel for header/footer
  const hotel = selectedHotel || null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-lg">Loading room details...</p>
      </div>
    );
  }

  if (error || !roomDetails || !room) {
    return (
      <div className="min-h-screen bg-background">
        <Header hotel={hotel} />
        <div className="pt-24 pb-16 text-center">
          <p className="text-muted-foreground text-lg mb-4">
            {error ? 'Failed to load room details' : 'Room not found'}
          </p>
          <Link to="/rooms" className="text-primary hover:underline">
            Back to Rooms
          </Link>
        </div>
        <Footer hotel={hotel} />
      </div>
    );
  }

  const nextImage = () => {
    if (roomImages.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % roomImages.length);
    }
  };

  const prevImage = () => {
    if (roomImages.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + roomImages.length) % roomImages.length);
    }
  };

  const handleWhatsAppBooking = () => {
    const hotelName = hotel?.hotelName || hotelConfig.name;
    const message = `Hi, I'd like to book the ${roomName} at ${hotelName}.${
      checkIn ? ` Check-in: ${checkIn}` : ''
    }${checkOut ? `, Check-out: ${checkOut}` : ''}`;
    const whatsappNumber = hotel?.whatsappNumber || hotelConfig.whatsappNumber;
    window.open(
      `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header hotel={hotel} />

      {/* Breadcrumb */}
      <div className="pt-24 pb-4 bg-muted/50">
        <div className="container-hotel">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link 
              to={hotelIdFromQuery ? `/rooms?hotelId=${hotelIdFromQuery}` : '/rooms'} 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Rooms
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">{roomName}</span>
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
              {roomImages.length > 0 ? (
                <>
                  <div className="relative rounded-2xl overflow-hidden">
                    <img
                      src={roomImages[currentImageIndex] || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'}
                      alt={`${roomName} - Image ${currentImageIndex + 1}`}
                      className="w-full aspect-[16/10] object-cover"
                    />

                    {/* Navigation Arrows */}
                    {roomImages.length > 1 && (
                      <>
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
                          {roomImages.map((_, index) => (
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
                      </>
                    )}
                  </div>

                  {/* Thumbnails */}
                  {roomImages.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {roomImages.map((image, index) => (
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
                  )}
                </>
              ) : (
                <div className="relative rounded-2xl overflow-hidden bg-muted aspect-[16/10] flex items-center justify-center">
                  <p className="text-muted-foreground">No images available</p>
                </div>
              )}

              {/* Room Info */}
              <div>
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  {roomName}
                </h1>

                {/* Room Category and Type */}
                {(roomCategory || roomView || viewType) && (
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    {roomCategory && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        <Layers size={14} />
                        {roomCategory}
                      </span>
                    )}
                    {roomView && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-hotel-secondary/10 text-hotel-secondary text-sm font-medium">
                        <Eye size={14} />
                        {roomView}
                      </span>
                    )}
                    {viewType && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-sm">
                        {viewType}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-6">
                  {roomGuests > 0 && (
                    <span className="flex items-center gap-2">
                      <Users size={20} />
                      Up to {roomGuests} {roomGuests === 1 ? 'guest' : 'guests'}
                    </span>
                  )}
                  {roomSize && roomSize !== 'N/A' && (
                    <span className="flex items-center gap-2">
                      <Maximize size={20} />
                      {roomSize}
                      {roomDimensions && (
                        <span className="text-xs">({roomDimensions})</span>
                      )}
                    </span>
                  )}
                  {roomBedType && (
                    <span className="flex items-center gap-2">
                      <Bed size={20} />
                      {roomBedType} Bed
                    </span>
                  )}
                </div>

                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  {roomDescription}
                </p>

                {/* Detailed Room Information */}
                <div className="bg-muted/50 rounded-2xl p-6 mb-8">
                  <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                    Room Details
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    {/* Occupancy Details */}
                    {(minAdults > 0 || maxAdults > 0) && (
                      <div>
                        <p className="font-medium text-foreground mb-1">Adults</p>
                        <p className="text-muted-foreground">
                          {minAdults > 0 && maxAdults > 0 && minAdults !== maxAdults
                            ? `${minAdults} - ${maxAdults} adults`
                            : maxAdults > 0
                            ? `Up to ${maxAdults} adults`
                            : `Minimum ${minAdults} adults`}
                        </p>
                      </div>
                    )}
                    {maxChilds > 0 && (
                      <div>
                        <p className="font-medium text-foreground mb-1">Children</p>
                        <p className="text-muted-foreground">
                          Up to {maxChilds} {maxChilds === 1 ? 'child' : 'children'}
                          {childAge && ` (${childAge})`}
                        </p>
                      </div>
                    )}
                    {infantAge && (
                      <div>
                        <p className="font-medium text-foreground mb-1">Infants</p>
                        <p className="text-muted-foreground">
                          Up to {infantAge} old
                        </p>
                      </div>
                    )}
                    {totalRooms > 0 && (
                      <div>
                        <p className="font-medium text-foreground mb-1">Total Rooms</p>
                        <p className="text-muted-foreground">{totalRooms} {totalRooms === 1 ? 'room' : 'rooms'} available</p>
                      </div>
                    )}
                    {minRoomsForGroup > 0 && (
                      <div>
                        <p className="font-medium text-foreground mb-1">Group Booking</p>
                        <p className="text-muted-foreground">
                          Minimum {minRoomsForGroup} {minRoomsForGroup === 1 ? 'room' : 'rooms'} required
                        </p>
                      </div>
                    )}
                    {room?.drinkType && (
                      <div>
                        <p className="font-medium text-foreground mb-1">Welcome Drink</p>
                        <p className="text-muted-foreground">{room.drinkType}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* YouTube Video Link */}
                {room?.youtubeLink && (
                  <div className="mb-8">
                    <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                      Room Video
                    </h2>
                    <a
                      href={room.youtubeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors"
                    >
                      <Youtube size={20} />
                      Watch Room Tour
                    </a>
                  </div>
                )}
              </div>

              {/* Amenities */}
              {roomAmenities.length > 0 && (
                <div>
                  <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                    Room Amenities
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {roomAmenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-hotel-secondary/20 flex items-center justify-center shrink-0">
                          <Check size={16} className="text-hotel-secondary" />
                        </div>
                        <span className="text-foreground">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Special Inclusions */}
              {specialInclusions.length > 0 && (
                <div className="bg-muted/50 rounded-2xl p-6">
                  <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                    Special Inclusions
                  </h2>
                  <div className="space-y-3">
                    {specialInclusions.map((inclusion, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Check size={16} className="text-hotel-secondary shrink-0" />
                          <span className="text-foreground">{inclusion.name}</span>
                          {inclusion.included && (
                            <span className="text-xs text-hotel-secondary bg-hotel-secondary/10 px-2 py-0.5 rounded">
                              Included
                            </span>
                          )}
                        </div>
                        {inclusion.rate > 0 && !inclusion.included && (
                          <span className="text-sm font-semibold text-primary">
                            {hotelConfig.currencySymbol}{inclusion.rate.toLocaleString()}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Services */}
              {additionalServices.length > 0 && (
                <div className="bg-muted/50 rounded-2xl p-6">
                  <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                    Additional Services
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {additionalServices.map((service, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background">
                        <span className="text-foreground font-medium">{service.name}</span>
                        <span className="text-sm font-semibold text-primary">
                          {hotelConfig.currencySymbol}{service.rate.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Information */}
              {selectedPricing && selectedPricing.additionalRules && (
                <div className="bg-muted/50 rounded-2xl p-6">
                  <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                    Terms & Conditions
                  </h2>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">{selectedPricing.additionalRules}</p>
                    {selectedPricing.minRooms > 1 && (
                      <div className="pt-4 border-t border-border">
                        <p className="text-sm text-muted-foreground">
                          Minimum {selectedPricing.minRooms} {selectedPricing.minRooms === 1 ? 'room' : 'rooms'} required
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Policies */}
              <div className="bg-muted/50 rounded-2xl p-6">
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                  Room Policies
                </h2>
                <div className="grid sm:grid-cols-2 gap-6 text-sm">
                  <div>
                    <p className="font-medium text-foreground mb-1">Check-in</p>
                    <p className="text-muted-foreground">From {hotel?.checkInTime || '2:00 PM'}</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">Check-out</p>
                    <p className="text-muted-foreground">Until {hotel?.checkOutTime || '11:00 AM'}</p>
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
                {/* Price - Enhanced */}
                {selectedPricing && (
                  <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 border-2 border-primary/20">
                    <div className="text-center mb-4">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Base Rate</p>
                      <p className="text-5xl font-display font-bold text-primary mb-1">
                        {hotelConfig.currencySymbol}{selectedPricing.basePrice.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">per night</p>
                    </div>
                    
                    
                    
                    {/* Included Features */}
                    <div className="space-y-2 mt-4 pt-4 border-t border-border/50">
                      {selectedPricing.breakfastIncluded && (
                        <div className="flex items-center gap-2 text-sm">
                          <Check size={16} className="text-hotel-secondary shrink-0" />
                          <span className="text-foreground">Breakfast Included</span>
                        </div>
                      )}
                      {selectedPricing.haveWelcomeDrink && (
                        <div className="flex items-center gap-2 text-sm">
                          <Check size={16} className="text-hotel-secondary shrink-0" />
                          <span className="text-foreground">Welcome Drink</span>
                        </div>
                      )}
                      {selectedPricing.ac && (
                        <div className="flex items-center gap-2 text-sm">
                          <Check size={16} className="text-hotel-secondary shrink-0" />
                          <span className="text-foreground">Air Conditioning</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {!selectedPricing && roomPrice > 0 && (
                  <div className="text-center pb-6 border-b border-border">
                    <p className="text-sm text-muted-foreground mb-1">Starting from</p>
                    <p className="text-4xl font-display font-bold text-primary">
                      {hotelConfig.currencySymbol}{roomPrice.toLocaleString()}
                    </p>
                    <p className="text-muted-foreground">per night</p>
                  </div>
                )}

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

      <Footer hotel={hotel} />
      <WhatsAppButton />
    </div>
  );
}
