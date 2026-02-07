import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Download,
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  Users,
  CreditCard,
  FileText,
  Clock,
  Star,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { FloatingCart } from '@/components/cart/FloatingCart';
import { BookingTimeline } from '@/components/bookings/BookingTimeline';
import { ReviewForm, ReviewFormData } from '@/components/reviews/ReviewForm';
import { ReviewDisplay } from '@/components/reviews/ReviewDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useHotels } from '@/contexts/HotelContext';
import { Reservation } from '@/models/bookings.models';
import { Hotel } from '@/models/home.models';
import { BookingStatus, BookingReview } from '@/types/booking';
import bookingsService from '@/services/bookings.service';
import { homeService } from '@/services/home.service';
import { environment } from '../../environment';
import { cn } from '@/lib/utils';

const statusConfig: Record<BookingStatus, { label: string; className: string }> = {
  upcoming: { label: 'Upcoming', className: 'bg-primary/10 text-primary border-primary/20' },
  current: { label: 'Current Stay', className: 'bg-secondary/10 text-secondary border-secondary/20' },
  completed: { label: 'Completed', className: 'bg-muted text-muted-foreground border-border' },
  cancelled: { label: 'Cancelled', className: 'bg-destructive/10 text-destructive border-destructive/20' },
};

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-48 w-full rounded-xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// Helper function to map API reservation status to frontend status
function mapReservationStatus(
  bookingStatus: string,
  reservationStatus: string,
  checkInDate: string,
  checkOutDate: string
): BookingStatus {
  const bookingStatusUpper = bookingStatus?.toUpperCase();
  const reservationStatusUpper = reservationStatus?.toUpperCase();
  
  if (bookingStatusUpper === 'CANCELLED' || reservationStatusUpper === 'CANCELLED') {
    return 'cancelled';
  }
  if (bookingStatusUpper === 'COMPLETED' || reservationStatusUpper === 'COMPLETED' || 
      bookingStatusUpper === 'CHECKED_OUT' || reservationStatusUpper === 'CHECKED_OUT') {
    return 'completed';
  }
  if (bookingStatusUpper === 'CHECKED_IN' || reservationStatusUpper === 'CHECKED_IN') {
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

export default function BookingDetails() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { selectedHotel: hotel } = useHotels();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [hotelData, setHotelData] = useState<Hotel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [localReview, setLocalReview] = useState<BookingReview | null>(null);

  // Fetch reservation and hotel details
  useEffect(() => {
    const fetchData = async () => {
      if (!bookingId) {
        setError(new Error('Booking ID is required'));
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch reservation
        const reservationResponse = await bookingsService.getBookingById(bookingId);
        
        if (reservationResponse.status && reservationResponse.data) {
          setReservation(reservationResponse.data);
          
          // Fetch hotel details using hotelId from reservation
          if (reservationResponse.data.hotelId) {
            try {
              const hotelResponse = await homeService.getHotelById(reservationResponse.data.hotelId);
              if (hotelResponse.status && hotelResponse.data) {
                setHotelData(hotelResponse.data);
              }
            } catch (hotelErr) {
              console.error('Error fetching hotel details:', hotelErr);
              // Continue even if hotel fetch fails
            }
          }
        } else {
          setError(new Error(reservationResponse.msg || 'Failed to fetch booking'));
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch booking');
        setError(error);
        console.error('Error fetching booking:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [bookingId]);

  // Map reservation status
  const mappedStatus = reservation ? mapReservationStatus(
    reservation.bookingStatus || '',
    reservation.reservationStatus || '',
    reservation.reservationCheckInDate,
    reservation.reservationCheckOutDate
  ) : null;
  
  const status = mappedStatus ? statusConfig[mappedStatus] : null;
  const canReview = mappedStatus === 'completed' && !localReview;

  // Extract reservation data for easier access
  const hotelName = hotelData?.hotelName || 'Unknown Hotel';
  const location = hotelData?.locationName || hotelData?.townName || hotelData?.address || 'Unknown Location';
  const hotelImage = hotelData?.coverImages || hotelData?.interiorImage?.[0] || '/placeholder.svg';
  const hotelImageUrl = hotelImage.startsWith('http') ? hotelImage : `${environment.imageBaseUrl}${hotelImage}`;
  
  const bookedRoom = reservation?.bookedRooms?.[0];
  const roomType = bookedRoom?.roomTypeName || 'Standard Room';
  const referenceNumber = reservation ? `AR-${reservation.reservationNumber}` : '';
  const checkInDate = reservation ? new Date(reservation.reservationCheckInDate) : null;
  // Extract date part from checkout date to avoid timezone issues (checkout date is 23:59:59.999Z)
  // Parse only the date portion (YYYY-MM-DD) to ensure correct date display
  const checkOutDate = reservation 
    ? new Date(reservation.reservationCheckOutDate.split('T')[0] + 'T00:00:00.000Z')
    : null;
  
  const adultGuests = bookedRoom?.roomInfo?.adultGuest || 0;
  const childGuests = bookedRoom?.roomInfo?.childGuest || 0;
  const nights = reservation?.numberOfNights || bookedRoom?.roomInfo?.nights || 1;
  
  const guestDetails = reservation?.guestDetails;
  const guestName = guestDetails?.guestName || '';
  const guestFirstName = guestName.split(' ')[0] || '';
  const guestLastName = guestName.split(' ').slice(1).join(' ') || '';
  
  // Create timeline from payment transactions
  const timeline = [];
  if (reservation?.paymentTransactions && reservation.paymentTransactions.length > 0) {
    reservation.paymentTransactions.forEach((transaction, index) => {
      if (transaction.paymentStatus?.toLowerCase() === 'completed' || 
          transaction.paymentStatus === 'FULLY_SETTLED') {
        timeline.push({
          id: `payment-${index}`,
          type: 'payment' as const,
          title: 'Payment Completed',
          description: `Payment of ₹${transaction.amount?.toLocaleString()} received`,
          timestamp: new Date(),
        });
      }
    });
  }
  
  // Add check-in/check-out events
  if (checkInDate && checkOutDate) {
    const now = new Date();
    if (now >= checkInDate) {
      timeline.push({
        id: 'checkin',
        type: 'checkin' as const,
        title: 'Checked In',
        description: 'Guest checked in',
        timestamp: checkInDate,
      });
    }
    if (now >= checkOutDate) {
      timeline.push({
        id: 'checkout',
        type: 'checkout' as const,
        title: 'Checked Out',
        description: 'Guest checked out',
        timestamp: checkOutDate,
      });
    }
  }
  
  const sortedTimeline = timeline.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header hotel={hotel} />
        <main className="container-hotel pt-24 pb-16">
          <LoadingSkeleton />
        </main>
        <Footer hotel={hotel} />
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className="min-h-screen bg-background">
        <Header hotel={hotel} />
        <main className="container-hotel pt-24 pb-16">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <AlertTriangle className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-display font-semibold mb-2">Booking Not Found</h2>
            <p className="text-muted-foreground mb-6">
              {error?.message || "We couldn't find the booking you're looking for."}
            </p>
            <Button asChild>
              <Link to="/bookings">View All Bookings</Link>
            </Button>
          </div>
        </main>
        <Footer hotel={hotel} />
      </div>
    );
  }

  const handleDownloadInvoice = () => {
    toast({
      title: 'Downloading Invoice',
      description: `Invoice for ${referenceNumber} will be downloaded shortly.`,
    });
  };

  const handleContactHotel = () => {
    const phoneNumber = hotelData?.contactDetails?.phoneNumber?.[0] || hotelData?.whatsappNumber || '';
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  const handleWhatsAppSupport = () => {
    const whatsappNumber = hotelData?.whatsappNumber || '';
    if (whatsappNumber) {
      window.open(`https://wa.me/${whatsappNumber}?text=Hi, I need help with booking ${referenceNumber}`, '_blank');
    }
  };

  const handleRebook = () => {
    if (hotelData?._id) {
      navigate(`/rooms/${hotelData._id}`);
    }
  };

  const handleReviewSubmit = async (reviewData: ReviewFormData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newReview: BookingReview = {
      id: `review-${Date.now()}`,
      bookingId: reservation?._id || '',
      overallRating: reviewData.overallRating,
      cleanlinessRating: reviewData.cleanlinessRating,
      serviceRating: reviewData.serviceRating,
      locationRating: reviewData.locationRating,
      comment: reviewData.comment,
      photos: [],
      isAnonymous: reviewData.isAnonymous,
      createdAt: new Date(),
    };

    setLocalReview(newReview);
    setShowReviewForm(false);
    
    toast({
      title: 'Review Submitted!',
      description: 'Thank you for sharing your experience.',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header hotel={hotel} />

      <main className="container-hotel pt-24 pb-16">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6 -ml-2">
          <Link to="/bookings">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Bookings
          </Link>
        </Button>

        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden mb-8">
          <img
            src={hotelImageUrl}
            alt={hotelName}
            className="w-full h-48 sm:h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-overlay" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <Badge className={cn('mb-2', status?.className)}>
              {status?.label}
            </Badge>
            <h1 className="font-display text-2xl sm:text-3xl font-bold mb-1">
              {hotelName}
            </h1>
            <p className="flex items-center gap-1 text-white/80">
              <MapPin className="w-4 h-4" />
              {location}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Booking Details</span>
                  <span className="text-sm font-mono text-muted-foreground">
                    {referenceNumber}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Check-in</p>
                    {checkInDate && (
                      <>
                        <p className="font-medium">{format(checkInDate, 'EEE, dd MMM yyyy')}</p>
                        <p className="text-xs text-muted-foreground">{hotelData?.checkInTime || '2:00 PM'}</p>
                      </>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Check-out</p>
                    {checkOutDate && (
                      <>
                        <p className="font-medium">{format(checkOutDate, 'EEE, dd MMM yyyy')}</p>
                        <p className="text-xs text-muted-foreground">{hotelData?.checkOutTime || '11:00 AM'}</p>
                      </>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Room Type</p>
                    <p className="font-medium">{roomType}</p>
                    <p className="text-xs text-muted-foreground">{nights} nights</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Guests</p>
                    <p className="font-medium">{adultGuests} Adults</p>
                    {childGuests > 0 && (
                      <p className="text-xs text-muted-foreground">{childGuests} Children</p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Guest Information */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Guest Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span>{' '}
                      <span className="text-foreground">{guestFirstName} {guestLastName}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email:</span>{' '}
                      <span className="text-foreground">{guestDetails?.email || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone:</span>{' '}
                      <span className="text-foreground">{guestDetails?.phone || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Booking Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BookingTimeline events={sortedTimeline} />
              </CardContent>
            </Card>

            {/* Instructions */}
            {/* {(hotelData?.checkInTime || hotelData?.checkOutTime) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {hotelData?.checkInTime && (
                    <div>
                      <h4 className="font-medium mb-1">Check-in Instructions</h4>
                      <p className="text-sm text-muted-foreground">
                        Check-in time is {hotelData.checkInTime}. Please present valid ID and booking confirmation.
                      </p>
                    </div>
                  )}
                  {hotelData?.checkOutTime && (
                    <div>
                      <h4 className="font-medium mb-1">Check-out Instructions</h4>
                      <p className="text-sm text-muted-foreground">
                        Check-out time is {hotelData.checkOutTime}. Late check-out available on request.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )} */}

            {/* Review Section */}
            {mappedStatus === 'completed' && (
              <div>
                {showReviewForm ? (
                  <ReviewForm
                    bookingId={reservation?._id || ''}
                    onSubmit={handleReviewSubmit}
                    onCancel={() => setShowReviewForm(false)}
                  />
                ) : localReview ? (
                  <ReviewDisplay
                    review={localReview}
                    guestName={`${guestFirstName} ${guestLastName}`}
                  />
                ) : (
                  <Card className="border-dashed">
                    <CardContent className="py-8 text-center">
                      <Star className="w-10 h-10 text-accent mx-auto mb-3" />
                      <h3 className="font-medium text-lg mb-2">Share Your Experience</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Your feedback helps other travelers and the hotel improve
                      </p>
                      <Button onClick={() => setShowReviewForm(true)}>
                        Write a Review
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Room Rate x {nights} nights
                  </span>
                  <span>₹{((bookedRoom?.roomInfo?.totalAmount || reservation?.totalAmount || 0) / nights * nights).toLocaleString()}</span>
                </div>
                {reservation?.taxAndGstSplitUp && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Taxes & GST</span>
                    <span>₹{reservation.taxAndGstSplitUp.gstAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Amount</span>
                  <span>₹{(reservation?.totalAmount || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Paid Amount</span>
                  <span>₹{(reservation?.paidAmount || 0).toLocaleString()}</span>
                </div>
                {(reservation?.dueAmount || 0) > 0 && (
                  <div className="flex justify-between text-sm text-destructive">
                    <span>Due Amount</span>
                    <span>₹{(reservation?.dueAmount || 0).toLocaleString()}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Amount</span>
                  <span>₹{(reservation?.totalAmount || 0).toLocaleString()}</span>
                </div>
                {(reservation?.paymentStatus === 'REFUNDED' || reservation?.paymentStatus === 'PARTIAL_REFUND') && (
                  <Badge variant="secondary" className="w-full justify-center mt-2">
                    <RefreshCw className="w-3 h-3 mr-1" />
                    {reservation.paymentStatus === 'REFUNDED' ? 'Refunded' : 'Partially Refunded'}
                  </Badge>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            {/* <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleDownloadInvoice}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Invoice
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleContactHotel}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Hotel
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleWhatsAppSupport}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp Support
                </Button>
                {mappedStatus === 'completed' && (
                  <Button 
                    variant="secondary" 
                    className="w-full justify-start"
                    onClick={handleRebook}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Book Again
                  </Button>
                )}
              </CardContent>
            </Card> */}

            {/* Cancellation Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Cancellation Policy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {hotelData?.cancellationPolicy || 'Please contact hotel for cancellation policy.'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer hotel={hotel} />
      <WhatsAppButton />
      <FloatingCart />
    </div>
  );
}


