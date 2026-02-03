export interface HotelConfig {
  id: string;

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

export interface Amenity {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

export interface Review {
  id: string;
  guestName: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  category: 'room' | 'dining' | 'pool' | 'spa' | 'exterior' | 'events';
  caption?: string;
}

export interface BookingDetails {
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;
  roomId: string | null;
  guestInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    specialRequests?: string;
  };
}
