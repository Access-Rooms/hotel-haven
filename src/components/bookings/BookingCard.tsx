import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Eye, Edit, X, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Booking, BookingStatus } from '@/types/booking';
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

export function BookingCard({ booking, onCancel, onModify }: BookingCardProps) {
  const status = statusConfig[booking.status];
  const canModify = booking.status === 'upcoming';
  const canCancel = booking.status === 'upcoming';
  const canReview = booking.status === 'completed' && !booking.review;

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-card">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="relative w-full sm:w-48 h-40 sm:h-auto flex-shrink-0">
            <img
              src={booking.hotelImage}
              alt={booking.hotelName}
              className="w-full h-full object-cover"
            />
            <Badge className={cn('absolute top-3 left-3', status.className)}>
              {status.label}
            </Badge>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 sm:p-5">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-display font-semibold text-lg text-foreground">
                    {booking.hotelName}
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {booking.location}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground font-mono">
                  {booking.referenceNumber}
                </p>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {format(booking.checkIn, 'dd MMM')} - {format(booking.checkOut, 'dd MMM yyyy')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>
                    {booking.guests.adults} Adults{booking.guests.children > 0 && `, ${booking.guests.children} Child`}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Room:</span>{' '}
                  <span className="text-foreground">{booking.roomType}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Total:</span>{' '}
                  <span className="text-foreground font-semibold">₹{booking.pricing.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 mt-auto pt-3 border-t border-border">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/bookings/${booking.id}`}>
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Link>
                </Button>
                
                {canModify && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onModify?.(booking.id)}
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
                    onClick={() => onCancel?.(booking.id)}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                )}
                
                {canReview && (
                  <Button variant="secondary" size="sm" asChild>
                    <Link to={`/bookings/${booking.id}/review`}>
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
