import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Eye, Edit, X, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Booking } from '@/models/bookings.models';
import { BookingStatus } from '@/types/booking';
import { environment } from '../../../environment';
import { cn } from '@/lib/utils';

interface BookingCardProps {
  booking: Booking;
  onCancel?: (id: string) => void;
  onModify?: (id: string) => void;
}

const statusConfig: Record<BookingStatus, { label: string; className: string }> = {
  upcoming: { label: 'Upcoming', className: 'bg-primary/10 text-primary border-primary/20' },
  current: { label: 'Current Stay', className: 'bg-secondary/10 text-secondary border-secondary/20' },
  completed: { label: 'Completed', className: 'bg-muted text-muted-foreground border-border' },
  cancelled: { label: 'Cancelled', className: 'bg-destructive/10 text-destructive border-destructive/20' },
};

// Helper function to map API booking status to frontend status
function mapBookingStatus(
  bookingStatus: Booking['bookingStatus'],
  reservationStatus: Booking['reservationStatus'],
  checkInDate: string,
  checkOutDate: string
): BookingStatus {
  if (bookingStatus === 'CANCELLED' || reservationStatus === 'CANCELLED') {
    return 'cancelled';
  }
  if (bookingStatus === 'COMPLETED' || reservationStatus === 'COMPLETED' || bookingStatus === 'CHECKED_OUT' || reservationStatus === 'CHECKED_OUT') {
    return 'completed';
  }
  if (bookingStatus === 'CHECKED_IN' || reservationStatus === 'CHECKED_IN') {
    return 'current';
  }
  
  // Determine based on dates
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const now = new Date();
  
  if (now >= checkIn && now < checkOut) {
    return 'current';
  } else if (now < checkIn) {
    return 'upcoming';
  } else {
    return 'completed';
  }
}

export function BookingCard({ booking, onCancel, onModify }: BookingCardProps) {
  // Extract data from API model
  const hotel = booking.hotelId;
  const hotelName = hotel?.hotelName || 'Unknown Hotel';
  const location = hotel?.locationName || hotel?.townName || hotel?.address || 'Unknown Location';
  const hotelImage = hotel?.coverImages || hotel?.interiorImage?.[0] || '/placeholder.svg';
  const hotelImageUrl = hotelImage.startsWith('http') ? hotelImage : `${environment.imageBaseUrl}${hotelImage}`;
  
  const bookedRoom = booking.bookedRooms?.[0];
  const roomType = bookedRoom?.roomTypeName || 'Standard Room';
  const roomImage = hotel?.interiorImage?.[0] || hotelImage;
  const roomImageUrl = roomImage.startsWith('http') ? roomImage : `${environment.imageBaseUrl}${roomImage}`;
  
  const referenceNumber = `AR-${booking.reservationNumber}`;
  const checkInDate = new Date(booking.checkInDate || booking.reservationCheckInDate);
  // Extract date part from checkout date to avoid timezone issues (checkout date is 23:59:59.999Z)
  // Parse only the date portion (YYYY-MM-DD) to ensure correct date display
  const checkoutDateStr = booking.checkOutDate || booking.reservationCheckOutDate;
  const checkOutDate = checkoutDateStr 
    ? new Date(checkoutDateStr.split('T')[0] + 'T00:00:00.000Z')
    : new Date();
  
  const adultGuests = bookedRoom?.roomInfo?.adultGuest || 0;
  const childGuests = bookedRoom?.roomInfo?.childGuest || 0;
  
  const status = mapBookingStatus(booking.bookingStatus, booking.reservationStatus, booking.checkInDate || booking.reservationCheckInDate, booking.checkOutDate || booking.reservationCheckOutDate);
  const statusDisplay = statusConfig[status];
  
  const canModify = status === 'upcoming';
  const canCancel = status === 'upcoming';
  const canReview = status === 'completed';

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-card">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="relative w-full sm:w-48 h-40 sm:h-auto flex-shrink-0">
            <img
              src={hotelImageUrl}
              alt={hotelName}
              className="w-full h-full object-cover"
            />
            <Badge className={cn('absolute top-3 left-3', statusDisplay.className)}>
              {statusDisplay.label}
            </Badge>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 sm:p-5">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-display font-semibold text-lg text-foreground">
                    {hotelName}
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {location}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground font-mono">
                  {referenceNumber}
                </p>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {format(checkInDate, 'dd MMM')} - {format(checkOutDate, 'dd MMM yyyy')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>
                    {adultGuests} Adults{childGuests > 0 && `, ${childGuests} Child`}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Room:</span>{' '}
                  <span className="text-foreground">{roomType}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Total:</span>{' '}
                  <span className="text-foreground font-semibold">₹{booking.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 mt-auto pt-3 border-t border-border">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/bookings/${booking._id}`}>
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Link>
                </Button>
                
                {canModify && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onModify?.(booking._id)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Modify
                  </Button>
                )}
                
                {canCancel && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => onCancel?.(booking._id)}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                )}
                
                {canReview && (
                  <Button variant="secondary" size="sm" asChild>
                    <Link to={`/bookings/${booking._id}/review`}>
                      <Star className="w-4 h-4 mr-1" />
                      Add Review
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
