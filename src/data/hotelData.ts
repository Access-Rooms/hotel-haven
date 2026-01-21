// Legacy hotel data file - kept for backward compatibility
// New multi-hotel data is in companyData.ts

import { Room, Review, GalleryImage, Amenity } from '@/types/hotel';
import { companyConfig, hotels, rooms as allRooms, reviews as allReviews, galleryImages as allGalleryImages, amenities } from './companyData';

// Legacy HotelConfig export - points to first hotel for compatibility
const defaultHotel = hotels[0];

export const hotelConfig = {
  id: defaultHotel.id,
  name: defaultHotel.name,
  tagline: defaultHotel.tagline,
  logo: defaultHotel.logo,
  primaryColor: companyConfig.primaryColor,
  secondaryColor: companyConfig.secondaryColor,
  location: 'Goa, India',
  address: defaultHotel.address,
  phone: defaultHotel.phone,
  email: defaultHotel.email,
  whatsappNumber: defaultHotel.whatsappNumber,
  currency: companyConfig.currency,
  currencySymbol: companyConfig.currencySymbol,
};

// Filter rooms/reviews/gallery for the default hotel
export const rooms: Room[] = allRooms.filter(r => r.hotelId === defaultHotel.id);
export const reviews: Review[] = allReviews.filter(r => r.hotelId === defaultHotel.id);
export const galleryImages: GalleryImage[] = allGalleryImages.filter(g => g.hotelId === defaultHotel.id);

// Re-export amenities
export { amenities };
