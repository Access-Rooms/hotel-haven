import { HotelConfig, Room, Amenity, Review, GalleryImage } from '@/types/hotel';

export const hotelConfig: HotelConfig = {
  id: 'ocean-pearl-resort',
  name: 'Ocean Pearl Resort',
  tagline: 'Where Luxury Meets the Sea',
  primaryColor: '#0A5EFF',
  secondaryColor: '#00C2A8',
  location: 'Goa, India',
  address: '123 Beachfront Road, Candolim, Goa 403515, India',
  phone: '+91 832 123 4567',
  email: 'reservations@oceanpearlresort.com',
  whatsappNumber: '+919876543210',
  currency: 'INR',
  currencySymbol: '₹',
};

export const rooms: Room[] = [
  {
    id: 'deluxe-sea-view',
    name: 'Deluxe Sea View',
    description: 'Wake up to breathtaking ocean views in our elegantly appointed Deluxe Sea View room. Featuring a private balcony, luxurious king-size bed, and premium amenities, this room offers the perfect blend of comfort and coastal charm.',
    shortDescription: 'Ocean views with private balcony',
    price: 5500,
    maxGuests: 2,
    bedType: 'King',
    size: '35 sqm',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800',
    ],
    amenities: ['Ocean View', 'Private Balcony', 'King Bed', 'Free WiFi', 'Mini Bar', 'Room Service'],
    featured: true,
  },
  {
    id: 'family-suite',
    name: 'Family Suite',
    description: 'Spacious and thoughtfully designed for families, our Family Suite features separate living and sleeping areas, two bathrooms, and ample space for everyone to relax. Enjoy quality time together with stunning garden views.',
    shortDescription: 'Spacious suite for the whole family',
    price: 8900,
    maxGuests: 4,
    bedType: 'King + Twin',
    size: '55 sqm',
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800',
      'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800',
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800',
    ],
    amenities: ['Garden View', 'Living Area', 'Two Bathrooms', 'Free WiFi', 'Mini Bar', 'Kids Amenities'],
    featured: true,
  },
  {
    id: 'standard-room',
    name: 'Standard Room',
    description: 'Our cozy Standard Room offers all the essentials for a comfortable stay. Modern amenities, plush bedding, and thoughtful touches make this the perfect choice for travelers seeking quality and value.',
    shortDescription: 'Comfortable and affordable',
    price: 3200,
    maxGuests: 2,
    bedType: 'Queen',
    size: '25 sqm',
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800',
    ],
    amenities: ['City View', 'Queen Bed', 'Free WiFi', 'Work Desk', 'Room Service'],
    featured: false,
  },
  {
    id: 'premium-suite',
    name: 'Premium Suite',
    description: 'Indulge in ultimate luxury in our Premium Suite. Featuring panoramic sea views, a private jacuzzi, separate living area, and butler service, this suite is designed for guests who expect nothing but the finest.',
    shortDescription: 'Ultimate luxury with private jacuzzi',
    price: 15000,
    maxGuests: 2,
    bedType: 'King',
    size: '75 sqm',
    images: [
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
      'https://images.unsplash.com/photo-1602002418082-dd4a8f7a3b63?w=800',
    ],
    amenities: ['Panoramic View', 'Private Jacuzzi', 'Butler Service', 'Living Area', 'Premium Mini Bar', '24/7 Room Service'],
    featured: true,
  },
];

export const amenities: Amenity[] = [
  { id: 'wifi', name: 'Free WiFi', icon: 'Wifi' },
  { id: 'pool', name: 'Swimming Pool', icon: 'Waves' },
  { id: 'spa', name: 'Spa & Wellness', icon: 'Sparkles' },
  { id: 'restaurant', name: 'Restaurant', icon: 'UtensilsCrossed' },
  { id: 'parking', name: 'Free Parking', icon: 'Car' },
  { id: 'airport', name: 'Airport Pickup', icon: 'Plane' },
  { id: 'gym', name: 'Fitness Center', icon: 'Dumbbell' },
  { id: 'beach', name: 'Private Beach', icon: 'Umbrella' },
];

export const reviews: Review[] = [
  {
    id: '1',
    guestName: 'Sarah Mitchell',
    rating: 5,
    comment: 'Excellent location, well maintained rooms,Good service and amiable staffs.',
    date: '2024-01-15',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  },
  {
    id: '2',
    guestName: 'Rajesh Kumar',
    rating: 5,
    comment: 'Very neat, comfortable, value for money and homely treatment by staff.',
    date: '2024-01-10',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
  },
  {
    id: '3',
    guestName: 'Emma Thompson',
    rating: 4,
    comment: 'We booked this hotel on 11 December 2025. It is good value for money. Everything is nearby being it bus stand, culture shows ,cafes etc. It also has in-house restaurant.The staffs were very helpful and polite. They respected our each request. We had a wonderful stay. Recommended for budget stays.',
    date: '2024-01-05',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
  },
  {
    id: '4',
    guestName: 'David Chen',
    rating: 5,
    comment: 'Very neat room for a reasonable price. Thank you so much for arranging this comfortable stay. He helped with all the bookings   for ride and activities. Kind and helpful staffs. Overall we had such a wonderful stay',
    date: '2023-12-28',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
  },
];

export const galleryImages: GalleryImage[] = [
  { id: '1', url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', category: 'exterior', caption: 'Resort Entrance' },
  { id: '2', url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', category: 'room', caption: 'Deluxe Sea View Room' },
  { id: '3', url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800', category: 'pool', caption: 'Infinity Pool' },
  { id: '4', url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800', category: 'spa', caption: 'Spa Treatment Room' },
  { id: '5', url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', category: 'dining', caption: 'Fine Dining Restaurant' },
  { id: '6', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', category: 'exterior', caption: 'Private Beach' },
  { id: '7', url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800', category: 'room', caption: 'Family Suite' },
  { id: '8', url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800', category: 'events', caption: 'Wedding Venue' },
];
