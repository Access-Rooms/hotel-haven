export type BookingStatus = 'upcoming' | 'current' | 'completed' | 'cancelled';

export interface BookingTimelineEvent {
  id: string;
  type: 'created' | 'payment' | 'checkin' | 'checkout' | 'modified' | 'refund' | 'cancelled';
  title: string;
  description: string;
  timestamp: Date;
  icon?: string;
}

export interface BookingReview {
  id: string;
  bookingId: string;
  overallRating: number;
  cleanlinessRating: number;
  serviceRating: number;
  locationRating: number;
  comment: string;
  photos: string[];
  isAnonymous: boolean;
  createdAt: Date;
}

export interface Booking {
  id: string;
  referenceNumber: string;
  hotelId: string;
  hotelName: string;
  hotelImage: string;
  location: string;
  roomType: string;
  roomImage: string;
  checkIn: Date;
  checkOut: Date;
  guests: {
    adults: number;
    children: number;
  };
  guestInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  pricing: {
    roomRate: number;
    nights: number;
    taxes: number;
    fees: number;
    discount: number;
    total: number;
  };
  status: BookingStatus;
  paymentStatus: 'pending' | 'completed' | 'refunded' | 'partial_refund';
  specialRequests?: string;
  timeline: BookingTimelineEvent[];
  review?: BookingReview;
  cancellationPolicy: string;
  checkInInstructions?: string;
  checkOutInstructions?: string;
  createdAt: Date;
}

export interface CartItem {
  id: string;
  hotelId: string;
  hotelName: string;
  hotelImage: string;
  location: string;
  roomId: string;
  roomType: string;
  roomImage: string;
  checkIn: Date;
  checkOut: Date;
  guests: {
    adults: number;
    children: number;
  };
  pricePerNight: number;
  nights: number;
  totalPrice: number;
  isAvailable: boolean;
  priceChanged: boolean;
  originalPrice?: number;
  addedAt: Date;
}
