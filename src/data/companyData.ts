import { Company, Location, Hotel, Room, Review, GalleryImage, Amenity } from '@/types/hotel';

// Company configuration
export const companyConfig: Company = {
  id: 'staygroup',
  name: 'StayGroup Hotels',
  tagline: 'Exceptional Stays, Every Destination',
  logo: undefined,
  primaryColor: '#0A5EFF',
  secondaryColor: '#00C2A8',
  phone: '+91 800 123 4567',
  email: 'reservations@staygroup.com',
  whatsappNumber: '+919876543210',
  currency: 'INR',
  currencySymbol: '₹',
};

// Locations / Destinations
export const locations: Location[] = [
  {
    id: 'goa',
    name: 'Goa',
    slug: 'goa',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800',
    description: 'Sun-kissed beaches, vibrant nightlife, and Portuguese heritage',
    hotelCount: 2,
    tags: ['Beach', 'Nightlife', 'Heritage'],
    featured: true,
  },
  {
    id: 'bangalore',
    name: 'Bangalore',
    slug: 'bangalore',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800',
    description: 'India\'s tech hub with gardens, craft beer, and modern culture',
    hotelCount: 2,
    tags: ['City', 'Business', 'Tech Hub'],
    featured: true,
  },
  {
    id: 'kochi',
    name: 'Kochi',
    slug: 'kochi',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800',
    description: 'Serene backwaters, spice gardens, and rich maritime history',
    hotelCount: 1,
    tags: ['Backwaters', 'Heritage', 'Spices'],
    featured: true,
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    slug: 'jaipur',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800',
    description: 'The Pink City with majestic forts and royal heritage',
    hotelCount: 0,
    tags: ['Heritage', 'Culture', 'Royal'],
    featured: false,
  },
];

// Hotels across all locations
export const hotels: Hotel[] = [
  // Goa Hotels
  {
    id: 'ocean-pearl-resort',
    slug: 'ocean-pearl-resort',
    locationId: 'goa',
    name: 'Ocean Pearl Resort',
    tagline: 'Where Luxury Meets the Sea',
    description: 'Nestled along the pristine shores of Candolim Beach, Ocean Pearl Resort offers an unparalleled luxury experience. With panoramic ocean views, world-class amenities, and impeccable service, we create memories that last a lifetime.',
    shortDescription: 'Luxury beachfront resort with stunning ocean views',
    accentColor: '#0A5EFF',
    address: '123 Beachfront Road, Candolim, Goa 403515, India',
    phone: '+91 832 123 4567',
    email: 'reservations@oceanpearlresort.com',
    whatsappNumber: '+919876543210',
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800',
    ],
    rating: 4.8,
    reviewCount: 256,
    priceFrom: 5500,
    starRating: 5,
    amenities: ['Pool', 'Spa', 'Beach Access', 'Restaurant', 'WiFi', 'Parking'],
    featured: true,
  },
  {
    id: 'palm-bay-hotel',
    slug: 'palm-bay-hotel',
    locationId: 'goa',
    name: 'Palm Bay Hotel',
    tagline: 'Boutique Charm by the Sea',
    description: 'A charming boutique hotel offering personalized service and intimate atmosphere. Perfect for couples and solo travelers seeking a peaceful retreat.',
    shortDescription: 'Boutique hotel with personalized service',
    accentColor: '#E67E22',
    address: '45 Palm Grove, Calangute, Goa 403516, India',
    phone: '+91 832 234 5678',
    email: 'hello@palmbayhotel.com',
    whatsappNumber: '+919876543211',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800',
    ],
    rating: 4.5,
    reviewCount: 128,
    priceFrom: 3200,
    starRating: 4,
    amenities: ['Pool', 'Restaurant', 'WiFi', 'Garden', 'Bar'],
    featured: false,
  },
  // Bangalore Hotels
  {
    id: 'city-inn',
    slug: 'city-inn',
    locationId: 'bangalore',
    name: 'City Inn',
    tagline: 'Your Business Home in Bangalore',
    description: 'Strategically located in the heart of the tech corridor, City Inn offers modern amenities for business travelers with easy access to major IT parks and the airport.',
    shortDescription: 'Modern business hotel in tech corridor',
    accentColor: '#2ECC71',
    address: '78 MG Road, Bangalore 560001, India',
    phone: '+91 80 4567 8901',
    email: 'reservations@cityinn.com',
    whatsappNumber: '+919876543212',
    images: [
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800',
    ],
    rating: 4.3,
    reviewCount: 342,
    priceFrom: 4500,
    starRating: 4,
    amenities: ['Business Center', 'WiFi', 'Gym', 'Restaurant', 'Parking', 'Meeting Rooms'],
    featured: true,
  },
  {
    id: 'metro-suites',
    slug: 'metro-suites',
    locationId: 'bangalore',
    name: 'Metro Suites',
    tagline: 'Live Like a Local, Stay Like a Guest',
    description: 'Fully serviced apartments perfect for extended stays. Each suite comes with a kitchen, workspace, and all the comforts of home.',
    shortDescription: 'Serviced apartments for extended stays',
    accentColor: '#9B59B6',
    address: '234 Indiranagar, Bangalore 560038, India',
    phone: '+91 80 5678 9012',
    email: 'stay@metrosuites.com',
    whatsappNumber: '+919876543213',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
    ],
    rating: 4.6,
    reviewCount: 189,
    priceFrom: 6000,
    starRating: 4,
    amenities: ['Kitchen', 'WiFi', 'Laundry', 'Gym', 'Workspace', 'Housekeeping'],
    featured: false,
  },
  // Kochi Hotels
  {
    id: 'backwater-residency',
    slug: 'backwater-residency',
    locationId: 'kochi',
    name: 'Backwater Residency',
    tagline: 'Heritage Meets Tranquility',
    description: 'A heritage property overlooking the serene backwaters of Kerala. Experience authentic Kerala hospitality with Ayurvedic spa treatments and traditional cuisine.',
    shortDescription: 'Heritage hotel with backwater views',
    accentColor: '#16A085',
    address: '12 Fort Kochi, Kochi 682001, India',
    phone: '+91 484 234 5678',
    email: 'info@backwaterresidency.com',
    whatsappNumber: '+919876543214',
    images: [
      'https://images.unsplash.com/photo-1587922546307-776227941871?w=800',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
    ],
    rating: 4.7,
    reviewCount: 156,
    priceFrom: 4800,
    starRating: 4,
    amenities: ['Ayurvedic Spa', 'Restaurant', 'WiFi', 'Garden', 'Boat Tours', 'Cultural Shows'],
    featured: true,
  },
];

// Rooms for all hotels
export const rooms: Room[] = [
  // Ocean Pearl Resort Rooms
  {
    id: 'opr-deluxe-sea-view',
    hotelId: 'ocean-pearl-resort',
    name: 'Deluxe Sea View',
    description: 'Wake up to breathtaking ocean views in our elegantly appointed Deluxe Sea View room. Featuring a private balcony, luxurious king-size bed, and premium amenities.',
    shortDescription: 'Ocean views with private balcony',
    price: 5500,
    maxGuests: 2,
    bedType: 'King',
    size: '35 sqm',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
    ],
    amenities: ['Ocean View', 'Private Balcony', 'King Bed', 'Free WiFi', 'Mini Bar'],
    featured: true,
  },
  {
    id: 'opr-family-suite',
    hotelId: 'ocean-pearl-resort',
    name: 'Family Suite',
    description: 'Spacious and thoughtfully designed for families, featuring separate living and sleeping areas with garden views.',
    shortDescription: 'Spacious suite for the whole family',
    price: 8900,
    maxGuests: 4,
    bedType: 'King + Twin',
    size: '55 sqm',
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800',
      'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800',
    ],
    amenities: ['Garden View', 'Living Area', 'Two Bathrooms', 'Free WiFi', 'Kids Amenities'],
    featured: true,
  },
  {
    id: 'opr-premium-suite',
    hotelId: 'ocean-pearl-resort',
    name: 'Premium Suite',
    description: 'Ultimate luxury with panoramic sea views, private jacuzzi, and butler service.',
    shortDescription: 'Ultimate luxury with private jacuzzi',
    price: 15000,
    maxGuests: 2,
    bedType: 'King',
    size: '75 sqm',
    images: [
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
    ],
    amenities: ['Panoramic View', 'Private Jacuzzi', 'Butler Service', 'Premium Mini Bar'],
    featured: true,
  },
  // Palm Bay Hotel Rooms
  {
    id: 'pbh-garden-room',
    hotelId: 'palm-bay-hotel',
    name: 'Garden Room',
    description: 'Cozy room overlooking our lush tropical garden. Perfect for a peaceful retreat.',
    shortDescription: 'Cozy room with garden views',
    price: 3200,
    maxGuests: 2,
    bedType: 'Queen',
    size: '28 sqm',
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
    ],
    amenities: ['Garden View', 'Queen Bed', 'Free WiFi', 'Air Conditioning'],
    featured: false,
  },
  {
    id: 'pbh-pool-view',
    hotelId: 'palm-bay-hotel',
    name: 'Pool View Room',
    description: 'Modern room with direct views of our stunning pool area.',
    shortDescription: 'Modern room overlooking the pool',
    price: 4200,
    maxGuests: 2,
    bedType: 'King',
    size: '32 sqm',
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800',
    ],
    amenities: ['Pool View', 'King Bed', 'Free WiFi', 'Mini Bar', 'Balcony'],
    featured: true,
  },
  // City Inn Rooms
  {
    id: 'ci-executive',
    hotelId: 'city-inn',
    name: 'Executive Room',
    description: 'Perfect for business travelers with a dedicated workspace and high-speed internet.',
    shortDescription: 'Business-ready room with workspace',
    price: 4500,
    maxGuests: 2,
    bedType: 'King',
    size: '30 sqm',
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800',
    ],
    amenities: ['Workspace', 'High-Speed WiFi', 'Coffee Maker', 'City View'],
    featured: true,
  },
  {
    id: 'ci-business-suite',
    hotelId: 'city-inn',
    name: 'Business Suite',
    description: 'Spacious suite with separate living area, ideal for extended business stays.',
    shortDescription: 'Suite with separate living area',
    price: 7500,
    maxGuests: 2,
    bedType: 'King',
    size: '45 sqm',
    images: [
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    ],
    amenities: ['Living Area', 'Meeting Table', 'High-Speed WiFi', 'Espresso Machine', 'Gym Access'],
    featured: true,
  },
  // Metro Suites Rooms
  {
    id: 'ms-studio',
    hotelId: 'metro-suites',
    name: 'Studio Apartment',
    description: 'Compact yet complete studio with kitchenette and workspace.',
    shortDescription: 'Compact studio with kitchenette',
    price: 6000,
    maxGuests: 2,
    bedType: 'Queen',
    size: '40 sqm',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
    ],
    amenities: ['Kitchenette', 'Workspace', 'Washer/Dryer', 'High-Speed WiFi'],
    featured: true,
  },
  {
    id: 'ms-1bhk',
    hotelId: 'metro-suites',
    name: 'One Bedroom Suite',
    description: 'Full apartment with separate bedroom, living room, and complete kitchen.',
    shortDescription: 'Full apartment with kitchen',
    price: 8500,
    maxGuests: 3,
    bedType: 'King',
    size: '60 sqm',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800',
    ],
    amenities: ['Full Kitchen', 'Living Room', 'Workspace', 'Washer/Dryer', 'Balcony'],
    featured: true,
  },
  // Backwater Residency Rooms
  {
    id: 'br-heritage',
    hotelId: 'backwater-residency',
    name: 'Heritage Room',
    description: 'Traditional Kerala architecture with antique furniture and modern comforts.',
    shortDescription: 'Traditional Kerala charm',
    price: 4800,
    maxGuests: 2,
    bedType: 'King',
    size: '35 sqm',
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
      'https://images.unsplash.com/photo-1587922546307-776227941871?w=800',
    ],
    amenities: ['Heritage Decor', 'Garden View', 'Free WiFi', 'Tea/Coffee Maker'],
    featured: false,
  },
  {
    id: 'br-backwater-suite',
    hotelId: 'backwater-residency',
    name: 'Backwater Suite',
    description: 'Premium suite with private sit-out overlooking the serene backwaters.',
    shortDescription: 'Suite with backwater views',
    price: 7200,
    maxGuests: 2,
    bedType: 'King',
    size: '50 sqm',
    images: [
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800',
    ],
    amenities: ['Backwater View', 'Private Sit-out', 'Spa Access', 'Traditional Breakfast'],
    featured: true,
  },
];

// Reviews for all hotels
export const reviews: Review[] = [
  {
    id: '1',
    hotelId: 'ocean-pearl-resort',
    guestName: 'Sarah Mitchell',
    rating: 5,
    comment: 'Absolutely stunning property! The sea view from our room was breathtaking.',
    date: '2024-01-15',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  },
  {
    id: '2',
    hotelId: 'ocean-pearl-resort',
    guestName: 'Rajesh Kumar',
    rating: 5,
    comment: 'Best hotel experience in Goa. The infinity pool is a must-experience!',
    date: '2024-01-10',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
  },
  {
    id: '3',
    hotelId: 'palm-bay-hotel',
    guestName: 'Emma Thompson',
    rating: 4,
    comment: 'Charming boutique hotel with excellent service. Perfect for couples.',
    date: '2024-01-05',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
  },
  {
    id: '4',
    hotelId: 'city-inn',
    guestName: 'David Chen',
    rating: 5,
    comment: 'Perfect for business travel. Great location and amenities.',
    date: '2023-12-28',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
  },
  {
    id: '5',
    hotelId: 'backwater-residency',
    guestName: 'Priya Nair',
    rating: 5,
    comment: 'The backwater views are magical. Ayurvedic spa was incredible.',
    date: '2024-01-20',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
  },
];

// Gallery images for all hotels
export const galleryImages: GalleryImage[] = [
  // Ocean Pearl Resort
  { id: '1', hotelId: 'ocean-pearl-resort', url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', category: 'exterior', caption: 'Resort Entrance' },
  { id: '2', hotelId: 'ocean-pearl-resort', url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', category: 'room', caption: 'Deluxe Sea View Room' },
  { id: '3', hotelId: 'ocean-pearl-resort', url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800', category: 'pool', caption: 'Infinity Pool' },
  { id: '4', hotelId: 'ocean-pearl-resort', url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800', category: 'spa', caption: 'Spa Treatment Room' },
  // Palm Bay Hotel
  { id: '5', hotelId: 'palm-bay-hotel', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', category: 'exterior', caption: 'Hotel Exterior' },
  { id: '6', hotelId: 'palm-bay-hotel', url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', category: 'pool', caption: 'Pool Area' },
  // City Inn
  { id: '7', hotelId: 'city-inn', url: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800', category: 'exterior', caption: 'Hotel Lobby' },
  { id: '8', hotelId: 'city-inn', url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800', category: 'room', caption: 'Executive Room' },
  // Backwater Residency
  { id: '9', hotelId: 'backwater-residency', url: 'https://images.unsplash.com/photo-1587922546307-776227941871?w=800', category: 'exterior', caption: 'Heritage Building' },
  { id: '10', hotelId: 'backwater-residency', url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800', category: 'spa', caption: 'Ayurvedic Spa' },
];

// Amenities
export const amenities: Amenity[] = [
  { id: 'wifi', name: 'Free WiFi', icon: 'Wifi' },
  { id: 'pool', name: 'Swimming Pool', icon: 'Waves' },
  { id: 'spa', name: 'Spa & Wellness', icon: 'Sparkles' },
  { id: 'restaurant', name: 'Restaurant', icon: 'UtensilsCrossed' },
  { id: 'parking', name: 'Free Parking', icon: 'Car' },
  { id: 'airport', name: 'Airport Pickup', icon: 'Plane' },
  { id: 'gym', name: 'Fitness Center', icon: 'Dumbbell' },
  { id: 'beach', name: 'Private Beach', icon: 'Umbrella' },
  { id: 'business', name: 'Business Center', icon: 'Briefcase' },
  { id: 'kitchen', name: 'Kitchen', icon: 'ChefHat' },
];

// Helper functions
export function getLocationById(id: string): Location | undefined {
  return locations.find(loc => loc.id === id);
}

export function getLocationBySlug(slug: string): Location | undefined {
  return locations.find(loc => loc.slug === slug);
}

export function getHotelsByLocation(locationId: string): Hotel[] {
  return hotels.filter(hotel => hotel.locationId === locationId);
}

export function getHotelById(id: string): Hotel | undefined {
  return hotels.find(hotel => hotel.id === id);
}

export function getHotelBySlug(slug: string): Hotel | undefined {
  return hotels.find(hotel => hotel.slug === slug);
}

export function getRoomsByHotel(hotelId: string): Room[] {
  return rooms.filter(room => room.hotelId === hotelId);
}

export function getRoomById(id: string): Room | undefined {
  return rooms.find(room => room.id === id);
}

export function getReviewsByHotel(hotelId: string): Review[] {
  return reviews.filter(review => review.hotelId === hotelId);
}

export function getGalleryByHotel(hotelId: string): GalleryImage[] {
  return galleryImages.filter(img => img.hotelId === hotelId);
}

export function hasMultipleHotels(): boolean {
  return hotels.length > 1;
}

export function getLocationsWithHotels(): Location[] {
  return locations.filter(loc => loc.hotelCount > 0);
}
