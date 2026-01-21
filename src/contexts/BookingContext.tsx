import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Location, Hotel, Room } from '@/types/hotel';
import { 
  getLocationById, 
  getHotelById, 
  getRoomById,
  hasMultipleHotels,
  hotels 
} from '@/data/companyData';

interface BookingContextType {
  // Selection state
  selectedLocationId: string | null;
  selectedHotelId: string | null;
  selectedRoomId: string | null;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;

  // Resolved objects
  selectedLocation: Location | undefined;
  selectedHotel: Hotel | undefined;
  selectedRoom: Room | undefined;

  // Actions
  setLocation: (locationId: string | null) => void;
  setHotel: (hotelId: string | null) => void;
  setRoom: (roomId: string | null) => void;
  setDates: (checkIn: Date | null, checkOut: Date | null) => void;
  setGuests: (guests: number) => void;
  clearSelection: () => void;

  // Helpers
  isMultiHotel: boolean;
  shouldShowLocationSelector: boolean;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

interface BookingProviderProps {
  children: ReactNode;
}

export function BookingProvider({ children }: BookingProviderProps) {
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuestsState] = useState<number>(2);

  const isMultiHotel = hasMultipleHotels();
  const shouldShowLocationSelector = isMultiHotel;

  // Resolve objects from IDs
  const selectedLocation = selectedLocationId ? getLocationById(selectedLocationId) : undefined;
  const selectedHotel = selectedHotelId ? getHotelById(selectedHotelId) : undefined;
  const selectedRoom = selectedRoomId ? getRoomById(selectedRoomId) : undefined;

  const setLocation = useCallback((locationId: string | null) => {
    setSelectedLocationId(locationId);
    // Clear hotel and room when location changes
    setSelectedHotelId(null);
    setSelectedRoomId(null);
  }, []);

  const setHotel = useCallback((hotelId: string | null) => {
    if (hotelId) {
      const hotel = getHotelById(hotelId);
      if (hotel) {
        setSelectedLocationId(hotel.locationId);
        setSelectedHotelId(hotelId);
      }
    } else {
      setSelectedHotelId(null);
    }
    setSelectedRoomId(null);
  }, []);

  const setRoom = useCallback((roomId: string | null) => {
    if (roomId) {
      const room = getRoomById(roomId);
      if (room) {
        const hotel = getHotelById(room.hotelId);
        if (hotel) {
          setSelectedLocationId(hotel.locationId);
          setSelectedHotelId(hotel.id);
          setSelectedRoomId(roomId);
        }
      }
    } else {
      setSelectedRoomId(null);
    }
  }, []);

  const setDates = useCallback((newCheckIn: Date | null, newCheckOut: Date | null) => {
    setCheckIn(newCheckIn);
    setCheckOut(newCheckOut);
  }, []);

  const setGuests = useCallback((newGuests: number) => {
    setGuestsState(newGuests);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedLocationId(null);
    setSelectedHotelId(null);
    setSelectedRoomId(null);
    setCheckIn(null);
    setCheckOut(null);
    setGuestsState(2);
  }, []);

  const value: BookingContextType = {
    selectedLocationId,
    selectedHotelId,
    selectedRoomId,
    checkIn,
    checkOut,
    guests,
    selectedLocation,
    selectedHotel,
    selectedRoom,
    setLocation,
    setHotel,
    setRoom,
    setDates,
    setGuests,
    clearSelection,
    isMultiHotel,
    shouldShowLocationSelector,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
