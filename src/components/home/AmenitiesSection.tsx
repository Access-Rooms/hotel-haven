import { ApiResponse } from '@/models/common.models';
import { Hotel, Facilities } from '@/models/home.models';
import { homeService } from '@/services/home.service';
import { 
  Wifi, Waves, Sparkles, UtensilsCrossed, Car, Plane, Dumbbell, Umbrella,
  Gamepad2, Bell, Building2, Baby, ChefHat, Camera, Activity, Luggage,
  CigaretteOff, ParkingCircle, Flame, Zap, Bath, Eye, Store, Languages,
  Stethoscope, Sofa, Building, Home, Gift, Printer, Users, Trophy, PartyPopper,
  TreePine, Tv, Coffee, Briefcase, GamepadIcon, Armchair, Flame as Campfire,
  IceCream, Shield, Wine, Calendar, Trees, Dumbbell as Fitness, Sparkles as Spa,
  ChefHat as Barbeque, Table
} from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';

// Map facility keys to display names and icons
const facilityMap: Record<keyof Facilities, { name: string; icon: React.ReactNode }> = {
  indoorGames: { name: 'Indoor Games', icon: <Gamepad2 size={28} /> },
  roomService: { name: 'Room Service', icon: <Bell size={28} /> },
  elivatorOrLift: { name: 'Elevator', icon: <Building2 size={28} /> },
  paidAirportTransfer: { name: 'Airport Transfer', icon: <Plane size={28} /> },
  kidsPlayArea: { name: 'Kids Play Area', icon: <Baby size={28} /> },
  dinningArea: { name: 'Dining Area', icon: <UtensilsCrossed size={28} /> },
  cctv: { name: 'CCTV Security', icon: <Camera size={28} /> },
  activityCenter: { name: 'Activity Center', icon: <Activity size={28} /> },
  lugggeStorage: { name: 'Luggage Storage', icon: <Luggage size={28} /> },
  nonSmokingRooms: { name: 'Non-Smoking Rooms', icon: <CigaretteOff size={28} /> },
  privateParking: { name: 'Private Parking', icon: <ParkingCircle size={28} /> },
  fireExtinguisher: { name: 'Fire Safety', icon: <Flame size={28} /> },
  powerBackup: { name: 'Power Backup', icon: <Zap size={28} /> },
  bathRooms: { name: 'Private Bathrooms', icon: <Bath size={28} /> },
  view: { name: 'Scenic Views', icon: <Eye size={28} /> },
  restaurant: { name: 'Restaurant', icon: <ChefHat size={28} /> },
  concierge: { name: 'Concierge', icon: <Bell size={28} /> },
  multilingualStaff: { name: 'Multilingual Staff', icon: <Languages size={28} /> },
  doctorOnCall: { name: 'Doctor on Call', icon: <Stethoscope size={28} /> },
  lounge: { name: 'Lounge', icon: <Sofa size={28} /> },
  reception: { name: '24/7 Reception', icon: <Building size={28} /> },
  balconyOrTerrace: { name: 'Balcony/Terrace', icon: <Home size={28} /> },
  souvenirShop: { name: 'Souvenir Shop', icon: <Gift size={28} /> },
  printer: { name: 'Printing Service', icon: <Printer size={28} /> },
  conference: { name: 'Conference Room', icon: <Users size={28} /> },
  sportsCourt: { name: 'Sports Court', icon: <Trophy size={28} /> },
  banquetHall: { name: 'Banquet Hall', icon: <PartyPopper size={28} /> },
  outdoors: { name: 'Outdoor Activities', icon: <TreePine size={28} /> },
  mediaAndTechnology: { name: 'Media & Technology', icon: <Tv size={28} /> },
  internet: { name: 'Free WiFi', icon: <Wifi size={28} /> },
  swimmingPool: { name: 'Swimming Pool', icon: <Waves size={28} /> },
  cafes: { name: 'Cafes', icon: <Coffee size={28} /> },
  businessCenter: { name: 'Business Center', icon: <Briefcase size={28} /> },
  gameRoom: { name: 'Game Room', icon: <GamepadIcon size={28} /> },
  sitoutArea: { name: 'Sit-out Area', icon: <Armchair size={28} /> },
  bonfirePit: { name: 'Bonfire Pit', icon: <Campfire size={28} /> },
  picnicArea: { name: 'Picnic Area', icon: <Table size={28} /> },
  kidsMenu: { name: 'Kids Menu', icon: <IceCream size={28} /> },
  securityGuards: { name: 'Security Guards', icon: <Shield size={28} /> },
  barLounges: { name: 'Bar & Lounges', icon: <Wine size={28} /> },
  meetingrooms: { name: 'Meeting Rooms', icon: <Calendar size={28} /> },
  outdoorArea: { name: 'Outdoor Area', icon: <Trees size={28} /> },
  parking: { name: 'Parking', icon: <Car size={28} /> },
  general: { name: 'General Facilities', icon: <Building2 size={28} /> },
  langagesSpoken: { name: 'Multiple Languages', icon: <Languages size={28} /> },
  barOrLounges: { name: 'Bar/Lounges', icon: <Wine size={28} /> },
  fitness: { name: 'Fitness Center', icon: <Fitness size={28} /> },
  spa: { name: 'Spa', icon: <Spa size={28} /> },
  barbeque: { name: 'Barbeque', icon: <Barbeque size={28} /> },
  campFire: { name: 'Camp Fire', icon: <Campfire size={28} /> },
};

export function AmenitiesSection({ hotelId }: { hotelId: string | null }) {
  const [hotel, setHotel] = useState<Hotel | null>(null);
  
  useEffect(() => {
    if (hotelId) {
      const fetchHotel = async () => {
        try {
          const response: ApiResponse<Hotel> = await homeService.getHotelById(hotelId);
          setHotel(response.data);
        } catch (error) {
          console.error('Error fetching hotel:', error);
        }
      };
      fetchHotel();
    }
  }, [hotelId]);

  // Convert Facilities object to array of active amenities
  const amenities = useMemo(() => {
    if (!hotel?.facilities) return [];
    
    const activeAmenities: Array<{ id: string; name: string; icon: React.ReactNode }> = [];
    
    // Handle facilities as a single object (not array)
    const facilitiesObj = Array.isArray(hotel.facilities) ? hotel.facilities[0] : hotel.facilities;
    
    if (!facilitiesObj) return [];
    
    // Iterate through all facility properties and add active ones
    Object.entries(facilitiesObj).forEach(([key, value]) => {
      if (value === true && facilityMap[key as keyof Facilities]) {
        const facilityInfo = facilityMap[key as keyof Facilities];
        activeAmenities.push({
          id: key,
          name: facilityInfo.name,
          icon: facilityInfo.icon,
        });
      }
    });
    
    return activeAmenities;
  }, [hotel?.facilities]);

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container-hotel">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-hotel-secondary font-medium tracking-wider uppercase text-sm mb-4">
            {hotel?.hotelName} Amenities
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Everything You Need
          </h2>
          <p className="text-muted-foreground text-lg">
            From world-class wellness facilities to gourmet dining, we've curated every amenity for your perfect stay.
          </p>
        </div>

        {/* Amenities Grid */}
        {amenities.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {amenities.map((amenity, index) => (
              <div
                key={amenity.id}
                className="group bg-card rounded-2xl p-6 text-center shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-secondary flex items-center justify-center text-secondary-foreground group-hover:scale-110 transition-transform duration-300">
                  {amenity.icon}
                </div>
                <h3 className="font-display font-semibold text-foreground">
                  {amenity.name}
                </h3>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No amenities available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
