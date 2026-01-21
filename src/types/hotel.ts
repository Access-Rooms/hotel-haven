// Company represents the top-level brand that owns multiple hotels
export interface Company {
  id: string;
  name: string;
  tagline: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  phone: string;
  email: string;
  whatsappNumber: string;
  currency: string;
  currencySymbol: string;
}

// Location represents a city/destination with multiple hotels
export interface Location {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  hotelCount: number;
  tags: string[];
  featured: boolean;
}

// Hotel represents an individual property within a location
export interface Hotel {
  id: string;
  slug: string;
  locationId: string;
  name: string;
  tagline: string;
  description: string;
  shortDescription: string;
  logo?: string;
  accentColor: string;
  address: string;
  phone: string;
  email: string;
  whatsappNumber: string;
  images: string[];
  rating: number;
  reviewCount: number;
  priceFrom: number;
  starRating: number;
  amenities: string[];
  featured: boolean;
}

// Legacy HotelConfig for backward compatibility
export interface HotelConfig {
  id: string;
  name: string;
  tagline: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  location: string;
  address: string;
  phone: string;
  email: string;
  whatsappNumber: string;
  currency: string;
  currencySymbol: string;
}

export interface Room {
  id: string;
  hotelId: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  maxGuests: number;
  bedType: string;
  size: string;
  images: string[];
  amenities: string[];
  featured: boolean;
}

export interface Amenity {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

export interface Review {
  id: string;
  hotelId: string;
  guestName: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

export interface GalleryImage {
  id: string;
  hotelId: string;
  url: string;
  category: 'room' | 'dining' | 'pool' | 'spa' | 'exterior' | 'events';
  caption?: string;
}

export interface BookingContext {
  locationId: string | null;
  hotelId: string | null;
  roomId: string | null;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;
}

export interface BookingDetails {
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;
  roomId: string | null;
  hotelId: string | null;
  locationId: string | null;
  guestInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    specialRequests?: string;
  };
}
