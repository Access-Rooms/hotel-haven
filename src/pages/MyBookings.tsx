import { useState, useMemo } from 'react';
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
import { mockBookings } from '@/data/mockBookings';
import { Booking, BookingStatus } from '@/types/booking';
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
  const { selectedHotel: hotel } = useHotels();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({});
  
  const activeTab = (searchParams.get('status') as BookingStatus | 'all') || 'all';

  const setActiveTab = (tab: string) => {
    setSearchParams({ status: tab });
  };

  // Filter bookings based on tab, search, and filters
  const filteredBookings = useMemo(() => {
    let bookings = [...mockBookings];

    // Filter by status tab
    if (activeTab !== 'all') {
      bookings = bookings.filter(b => b.status === activeTab);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      bookings = bookings.filter(b => 
        b.hotelName.toLowerCase().includes(query) ||
        b.referenceNumber.toLowerCase().includes(query) ||
        b.roomType.toLowerCase().includes(query) ||
        b.location.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.hotel) {
      bookings = bookings.filter(b => b.hotelName === filters.hotel);
    }
    if (filters.location) {
      bookings = bookings.filter(b => b.location === filters.location);
    }
    if (filters.priceMin) {
      bookings = bookings.filter(b => b.pricing.total >= filters.priceMin!);
    }
    if (filters.priceMax) {
      bookings = bookings.filter(b => b.pricing.total <= filters.priceMax!);
    }
    if (filters.dateFrom) {
      bookings = bookings.filter(b => new Date(b.checkIn) >= filters.dateFrom!);
    }
    if (filters.dateTo) {
      bookings = bookings.filter(b => new Date(b.checkOut) <= filters.dateTo!);
    }

    return bookings;
  }, [activeTab, searchQuery, filters]);

  // Get counts for each tab
  const tabCounts = useMemo(() => ({
    all: mockBookings.length,
    upcoming: mockBookings.filter(b => b.status === 'upcoming').length,
    current: mockBookings.filter(b => b.status === 'current').length,
    completed: mockBookings.filter(b => b.status === 'completed').length,
    cancelled: mockBookings.filter(b => b.status === 'cancelled').length,
  }), []);

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
              {isLoading ? (
                <BookingsSkeleton />
              ) : filteredBookings.length === 0 ? (
                <EmptyState status={tab.value} />
              ) : (
                <div className="space-y-4">
                  {filteredBookings.map((booking) => (
                    <BookingCard
                      key={booking.id}
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
