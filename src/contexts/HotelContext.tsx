import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Hotel } from '@/models/home.models';
import { GetHotelsListPayload } from '@/models/home.models';
import { ApiResponse } from '@/models/common.models';
import { homeService } from '@/services/home.service';
import { environment } from '../../environment';
import { useBooking } from './BookingContext';

interface HotelContextType {
  hotels: Hotel[] | undefined;
  selectedHotel: Hotel | null;
  isLoading: boolean;
  error: Error | null;
  setSelectedHotel: (hotel: Hotel | null) => void;
  refreshHotels: () => Promise<void>;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

const HOTELS_STORAGE_KEY = 'hotel_haven_hotels';
const HOTELS_STORAGE_TIMESTAMP_KEY = 'hotel_haven_hotels_timestamp';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Helper to load hotels from localStorage
const loadHotelsFromStorage = (): Hotel[] | null => {
  try {
    const stored = localStorage.getItem(HOTELS_STORAGE_KEY);
    const timestamp = localStorage.getItem(HOTELS_STORAGE_TIMESTAMP_KEY);
    
    if (stored && timestamp) {
      const age = Date.now() - parseInt(timestamp, 10);
      if (age < CACHE_DURATION) {
        return JSON.parse(stored);
      }
    }
  } catch (error) {
    console.error('Error loading hotels from storage:', error);
  }
  return null;
};

// Helper to save hotels to localStorage
const saveHotelsToStorage = (hotels: Hotel[]): void => {
  try {
    localStorage.setItem(HOTELS_STORAGE_KEY, JSON.stringify(hotels));
    localStorage.setItem(HOTELS_STORAGE_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.error('Error saving hotels to storage:', error);
  }
};

interface HotelProviderProps {
  children: ReactNode;
}

export function HotelProvider({ children }: HotelProviderProps) {
  const [hotels, setHotels] = useState<Hotel[] | undefined>(undefined);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { dateFilter } = useBooking();
  const fetchHotels = async (useCache: boolean = true) => {
    try {
      setIsLoading(true);
      setError(null);

      // Try to load from cache first
      if (useCache) {
        const cachedHotels = loadHotelsFromStorage();
        if (cachedHotels) {
          setHotels(cachedHotels);
          setSelectedHotel(cachedHotels[0] || null);
          setIsLoading(false);
          // Still fetch in background to update cache
          fetchHotels(false).catch(() => {
            // Silent fail for background refresh
          });
          return;
        }
      }

      // Fetch from API
      const payload: GetHotelsListPayload = {
        userId: environment.userId,
        packageType: 'B2B',
        showRoomsWithRate: true,
        dateFilter: dateFilter,
      };

      const response: ApiResponse<Hotel[]> = await homeService.getHotelsList(payload);
      setHotels(response.data);
      
      // Set first hotel as selected by default
      if (response.data && response.data.length > 0) {
        setSelectedHotel(response.data[0]);
      }

      // Save to localStorage
      saveHotelsToStorage(response.data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch hotels');
      setError(error);
      console.error('Error fetching hotels:', err);

      // Try to use cached data as fallback
      const cachedHotels = loadHotelsFromStorage();
      if (cachedHotels) {
        setHotels(cachedHotels);
        setSelectedHotel(cachedHotels[0] || null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const refreshHotels = async () => {
    await fetchHotels(false); // Force refresh, skip cache
  };

  // Fetch hotels on mount
  useEffect(() => {
    fetchHotels();
  }, []);

  // Update selected hotel when hotels change
  useEffect(() => {
    if (hotels && hotels.length > 0 && !selectedHotel) {
      setSelectedHotel(hotels[0]);
    }
  }, [hotels, selectedHotel]);

  const value: HotelContextType = {
    hotels,
    selectedHotel,
    isLoading,
    error,
    setSelectedHotel,
    refreshHotels,
  };

  return <HotelContext.Provider value={value}>{children}</HotelContext.Provider>;
}

export function useHotels() {
  const context = useContext(HotelContext);
  if (context === undefined) {
    throw new Error('useHotels must be used within a HotelProvider');
  }
  return context;
}

