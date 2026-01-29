import { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Calendar, Hotel, Search, Plus } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { FloatingCart } from '@/components/cart/FloatingCart';
import { BookingCard } from '@/components/bookings/BookingCard';
import { BookingFilters, FilterState } from '@/components/bookings/BookingFilters';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useHotels } from '@/contexts/HotelContext';
import { BookingStatus } from '@/types/booking';
import { Booking, GetBookingsListPayload, DateFilter } from '@/models/bookings.models';
import bookingsService from '@/services/bookings.service';
import { AuthService } from '@/services/auth.service';
import { environment } from '../../environment';
import { cn } from '@/lib/utils';

const statusTabs: { value: BookingStatus | 'all'; label: string; count?: number }[] = [
  { value: 'all', label: 'All Bookings' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'current', label: 'Current Stay' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

function EmptyState({ status }: { status: BookingStatus | 'all' }) {
  const messages = {
    all: 'You haven\'t made any bookings yet',
    upcoming: 'No upcoming bookings',
    current: 'You\'re not currently checked in anywhere',
    completed: 'No completed stays yet',
    cancelled: 'No cancelled bookings',
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
        <Calendar className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="font-display font-semibold text-xl text-foreground mb-2">
        {messages[status]}
      </h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Start planning your next getaway and book your perfect room today
      </p>
      <Button asChild>
        <Link to="/rooms">
          <Plus className="w-4 h-4 mr-2" />
          Browse Rooms
        </Link>
      </Button>
    </div>
  );
}

function BookingsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4 p-4 border border-border rounded-xl">
          <Skeleton className="w-48 h-32 rounded-lg" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-2 mt-4">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MyBookings() {
  const { selectedHotel: hotel, hotels } = useHotels();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({});
  const isFetchingRef = useRef(false);
  const mountedRef = useRef(true);
  
  const activeTab = (searchParams.get('status') as BookingStatus | 'all') || 'all';

  const setActiveTab = (tab: string) => {
    setSearchParams({ status: tab });
  };

  // Memoize stable values to prevent unnecessary re-renders
  const hotelId = useMemo(() => hotel?._id || '', [hotel?._id]);
  const hotelsLength = useMemo(() => hotels?.length || 0, [hotels?.length]);
  const dateFromTimestamp = useMemo(() => filters.dateFrom ? filters.dateFrom.getTime() : 1, [filters.dateFrom]);
  const dateToTimestamp = useMemo(() => filters.dateTo ? filters.dateTo.getTime() : Date.now() + (365 * 24 * 60 * 60 * 1000), [filters.dateTo]);

  // Fetch bookings from API
  useEffect(() => {
    // Skip if already fetching
    if (isFetchingRef.current) {
      return;
    }

    const fetchBookings = async () => {
      // Mark as fetching
      isFetchingRef.current = true;

      try {
        setIsLoading(true);
        setError(null);

        const userId = AuthService.getUserId();
        if (!userId) {
          setError(new Error('User not logged in'));
          setIsLoading(false);
          isFetchingRef.current = false;
          return;
        }

        if (!hotelId) {
          setError(new Error('No hotel selected'));
          setIsLoading(false);
          isFetchingRef.current = false;
          return;
        }

        // Build date filter
        const dateFilter: DateFilter = {
          from: dateFromTimestamp,
          to: dateToTimestamp,
        };

        // Fetch bookings based on active tab
        const allBookings: Booking[] = [];
        
        if (activeTab === 'all') {
          // For 'all', don't pass bookingFor field
          try {
            const payload: GetBookingsListPayload = {
              userId,
              dateFilter,
              hotelId,
            };
            const response = await bookingsService.getBookingsList(payload);
            if (response.status && response.data) {
              allBookings.push(...response.data);
            }
          } catch (err) {
            console.error('Error fetching all bookings:', err);
          }
        } else if (activeTab === 'cancelled') {
          // For cancelled, fetch all and filter client-side
          try {
            const payload: GetBookingsListPayload = {
              userId,
              dateFilter,
              hotelId,
            };
            const response = await bookingsService.getBookingsList(payload);
            if (response.status && response.data) {
              allBookings.push(...response.data);
            }
          } catch (err) {
            console.error('Error fetching bookings for cancelled filter:', err);
          }
        } else {
          // For specific status, pass bookingFor
          let bookingFor: ("UPCOMING" | "COMPLETED" | "CURRENT") | null = null;
          if (activeTab === 'upcoming') {
            bookingFor = 'UPCOMING';
          } else if (activeTab === 'current') {
            bookingFor = 'CURRENT';
          } else if (activeTab === 'completed') {
            bookingFor = 'COMPLETED';
          }

          if (bookingFor) {
            try {
              const payload: GetBookingsListPayload = {
                userId,
                bookingFor: [bookingFor] as ["UPCOMING" | "COMPLETED" | "CURRENT"],
                dateFilter,
                hotelId,
              };
              const response = await bookingsService.getBookingsList(payload);
              if (response.status && response.data) {
                allBookings.push(...response.data);
              }
            } catch (err) {
              console.error(`Error fetching ${bookingFor} bookings:`, err);
            }
          }
        }

        // Filter by status if needed (for cancelled or specific status)
        let filtered = allBookings;
        if (activeTab === 'cancelled') {
          filtered = allBookings.filter(b => 
            b.bookingStatus === 'CANCELLED' || b.reservationStatus === 'CANCELLED'
          );
        } else if (activeTab === 'completed') {
          filtered = allBookings.filter(b => 
            b.bookingStatus === 'COMPLETED' || b.reservationStatus === 'COMPLETED' ||
            b.bookingStatus === 'CHECKED_OUT' || b.reservationStatus === 'CHECKED_OUT'
          );
        } else if (activeTab === 'current') {
          filtered = allBookings.filter(b => 
            b.bookingStatus === 'CHECKED_IN' || b.reservationStatus === 'CHECKED_IN'
          );
        } else if (activeTab === 'upcoming') {
          filtered = allBookings.filter(b => {
            const status = b.bookingStatus || b.reservationStatus;
            return status === 'PENDING' || status === 'CONFIRMED';
          });
        }
        
        setBookings(filtered);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch bookings');
        setError(error);
        console.error('Error fetching bookings:', err);
        setBookings([]);
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;
      }
    };

    if (hotelId && hotelsLength > 0) {
      fetchBookings();
    } else {
      setIsLoading(false);
      isFetchingRef.current = false;
    }

    // Cleanup function - only reset fetching flag, don't set mounted to false
    return () => {
      isFetchingRef.current = false;
    };
  }, [activeTab, hotelId, hotelsLength, dateFromTimestamp, dateToTimestamp, hotels]);

  // Reset mounted ref when component mounts
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Helper function to get booking status for filtering
  const getBookingStatus = (booking: Booking): BookingStatus | 'cancelled' => {
    if (booking.bookingStatus === 'CANCELLED' || booking.reservationStatus === 'CANCELLED') {
      return 'cancelled';
    }
    if (booking.bookingStatus === 'COMPLETED' || booking.reservationStatus === 'COMPLETED' ||
        booking.bookingStatus === 'CHECKED_OUT' || booking.reservationStatus === 'CHECKED_OUT') {
      return 'completed';
    }
    if (booking.bookingStatus === 'CHECKED_IN' || booking.reservationStatus === 'CHECKED_IN') {
      return 'current';
    }
    return 'upcoming';
  };

  // Filter bookings based on search and filters (client-side filtering)
  const filteredBookings = useMemo(() => {
    let filtered = [...bookings];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(b => {
        const hotelName = b.hotelId?.hotelName || '';
        const referenceNumber = `AR-${b.reservationNumber}`;
        const roomType = b.bookedRooms?.[0]?.roomTypeName || '';
        const location = b.hotelId?.locationName || b.hotelId?.townName || b.hotelId?.address || '';
        
        return hotelName.toLowerCase().includes(query) ||
               referenceNumber.toLowerCase().includes(query) ||
               roomType.toLowerCase().includes(query) ||
               location.toLowerCase().includes(query);
      });
    }

    // Apply filters
    if (filters.hotel) {
      filtered = filtered.filter(b => b.hotelId?.hotelName === filters.hotel);
    }
    if (filters.location) {
      filtered = filtered.filter(b => {
        const location = b.hotelId?.locationName || b.hotelId?.townName || b.hotelId?.address || '';
        return location === filters.location;
      });
    }
    if (filters.priceMin) {
      filtered = filtered.filter(b => b.totalAmount >= filters.priceMin!);
    }
    if (filters.priceMax) {
      filtered = filtered.filter(b => b.totalAmount <= filters.priceMax!);
    }
    if (filters.dateFrom) {
      filtered = filtered.filter(b => {
        const checkIn = new Date(b.checkInDate || b.reservationCheckInDate);
        return checkIn >= filters.dateFrom!;
      });
    }
    if (filters.dateTo) {
      filtered = filtered.filter(b => {
        const checkOut = new Date(b.checkOutDate || b.reservationCheckOutDate);
        return checkOut <= filters.dateTo!;
      });
    }

    return filtered;
  }, [bookings, searchQuery, filters]);

  // Get counts for each tab
  const tabCounts = useMemo(() => ({
    all: bookings.length,
    upcoming: bookings.filter(b => {
      const status = b.bookingStatus || b.reservationStatus;
      return status === 'PENDING' || status === 'CONFIRMED';
    }).length,
    current: bookings.filter(b => 
      b.bookingStatus === 'CHECKED_IN' || b.reservationStatus === 'CHECKED_IN'
    ).length,
    completed: bookings.filter(b => 
      b.bookingStatus === 'COMPLETED' || b.reservationStatus === 'COMPLETED' ||
      b.bookingStatus === 'CHECKED_OUT' || b.reservationStatus === 'CHECKED_OUT'
    ).length,
    cancelled: bookings.filter(b => 
      b.bookingStatus === 'CANCELLED' || b.reservationStatus === 'CANCELLED'
    ).length,
  }), [bookings]);

  const handleCancel = (id: string) => {
    console.log('Cancel booking:', id);
    // TODO: Implement cancel logic
  };

  const handleModify = (id: string) => {
    console.log('Modify booking:', id);
    // TODO: Implement modify logic
  };

  return (
    <div className="min-h-screen bg-background">
      <Header hotel={hotel} />
      
      <main className="container-hotel pt-24 pb-16">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">My Bookings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your reservations and view booking history
            </p>
          </div>
          <Button asChild>
            <Link to="/rooms">
              <Plus className="w-4 h-4 mr-2" />
              New Booking
            </Link>
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by hotel, reference, or room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <BookingFilters onFiltersChange={setFilters} />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full h-auto flex-wrap gap-1 bg-transparent p-0 mb-6">
            {statusTabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground',
                  'rounded-full px-4 py-2'
                )}
              >
                {tab.label}
                <span className="ml-2 text-xs opacity-70">
                  ({tabCounts[tab.value as keyof typeof tabCounts]})
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Content */}
          {statusTabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-0">
              {error ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                    <Calendar className="w-10 h-10 text-destructive" />
                  </div>
                  <h3 className="font-display font-semibold text-xl text-foreground mb-2">
                    Error Loading Bookings
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-sm">
                    {error.message}
                  </p>
                  <Button onClick={() => window.location.reload()}>
                    Retry
                  </Button>
                </div>
              ) : isLoading ? (
                <BookingsSkeleton />
              ) : filteredBookings.length === 0 ? (
                <EmptyState status={tab.value} />
              ) : (
                <div className="space-y-4">
                  {filteredBookings.map((booking) => (
                    <BookingCard
                      key={booking._id}
                      booking={booking}
                      onCancel={handleCancel}
                      onModify={handleModify}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>

      <Footer hotel={hotel} />
      <WhatsAppButton />
      <FloatingCart />
    </div>
  );
}
