import { createContext, useContext, useState, ReactNode } from 'react';
import { DateFilter } from '@/models/common.models';

interface BookingContextType {
  checkIn: string;
  checkOut: string;
  guests: number;
  dateFilter: DateFilter;
  setCheckIn: (date: string) => void;
  setCheckOut: (date: string) => void;
  setGuests: (guests: number) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Helper function to convert date string (YYYY-MM-DD) to milliseconds (start of day)
const dateStringToMilliseconds = (dateString: string): number => {
  const date = new Date(dateString);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
};

// Helper function to format date as YYYY-MM-DD
const formatDateForInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

interface BookingProviderProps {
  children: ReactNode;
}

export function BookingProvider({ children }: BookingProviderProps) {
  // Set default dates: today and tomorrow
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [checkIn, setCheckIn] = useState<string>(formatDateForInput(today));
  const [checkOut, setCheckOut] = useState<string>(formatDateForInput(tomorrow));
  const [guests, setGuests] = useState<number>(2);

  // Create date filter with milliseconds
  const dateFilter: DateFilter = {
    from: dateStringToMilliseconds(checkIn),
    to: dateStringToMilliseconds(checkOut),
  };

  const value: BookingContextType = {
    checkIn,
    checkOut,
    guests,
    dateFilter,
    setCheckIn,
    setCheckOut,
    setGuests,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}

