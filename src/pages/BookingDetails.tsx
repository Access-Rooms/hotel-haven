import { useState } from 'react';
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
import { mockBookings } from '@/data/mockBookings';
import { BookingStatus, BookingReview } from '@/types/booking';
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

export default function BookingDetails() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { selectedHotel: hotel } = useHotels();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [localReview, setLocalReview] = useState<BookingReview | null>(null);

  // Find booking from mock data
  const booking = mockBookings.find(b => b.id === bookingId);
  const status = booking ? statusConfig[booking.status] : null;
  const canReview = booking?.status === 'completed' && !booking.review && !localReview;

  if (!booking) {
    return (
      <div className="min-h-screen bg-background">
        <Header hotel={hotel} />
        <main className="container-hotel pt-24 pb-16">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <AlertTriangle className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-display font-semibold mb-2">Booking Not Found</h2>
            <p className="text-muted-foreground mb-6">
              We couldn't find the booking you're looking for.
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
      description: `Invoice for ${booking.referenceNumber} will be downloaded shortly.`,
    });
  };

  const handleContactHotel = () => {
    window.location.href = `tel:+919876543210`;
  };

  const handleWhatsAppSupport = () => {
    window.open(`https://wa.me/919876543210?text=Hi, I need help with booking ${booking.referenceNumber}`, '_blank');
  };

  const handleRebook = () => {
    navigate(`/rooms/${booking.hotelId}`);
  };

  const handleReviewSubmit = async (reviewData: ReviewFormData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newReview: BookingReview = {
      id: `review-${Date.now()}`,
      bookingId: booking.id,
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
            src={booking.hotelImage}
            alt={booking.hotelName}
            className="w-full h-48 sm:h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-overlay" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <Badge className={cn('mb-2', status?.className)}>
              {status?.label}
            </Badge>
            <h1 className="font-display text-2xl sm:text-3xl font-bold mb-1">
              {booking.hotelName}
            </h1>
            <p className="flex items-center gap-1 text-white/80">
              <MapPin className="w-4 h-4" />
              {booking.location}
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
                    {booking.referenceNumber}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Check-in</p>
                    <p className="font-medium">{format(booking.checkIn, 'EEE, dd MMM yyyy')}</p>
                    <p className="text-xs text-muted-foreground">2:00 PM</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Check-out</p>
                    <p className="font-medium">{format(booking.checkOut, 'EEE, dd MMM yyyy')}</p>
                    <p className="text-xs text-muted-foreground">11:00 AM</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Room Type</p>
                    <p className="font-medium">{booking.roomType}</p>
                    <p className="text-xs text-muted-foreground">{booking.pricing.nights} nights</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Guests</p>
                    <p className="font-medium">{booking.guests.adults} Adults</p>
                    {booking.guests.children > 0 && (
                      <p className="text-xs text-muted-foreground">{booking.guests.children} Children</p>
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
                      <span className="text-foreground">{booking.guestInfo.firstName} {booking.guestInfo.lastName}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email:</span>{' '}
                      <span className="text-foreground">{booking.guestInfo.email}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone:</span>{' '}
                      <span className="text-foreground">{booking.guestInfo.phone}</span>
                    </div>
                  </div>
                </div>

                {booking.specialRequests && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2">Special Requests</h4>
                      <p className="text-sm text-muted-foreground">{booking.specialRequests}</p>
                    </div>
                  </>
                )}
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
                <BookingTimeline events={booking.timeline} />
              </CardContent>
            </Card>

            {/* Instructions */}
            {(booking.checkInInstructions || booking.checkOutInstructions) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {booking.checkInInstructions && (
                    <div>
                      <h4 className="font-medium mb-1">Check-in Instructions</h4>
                      <p className="text-sm text-muted-foreground">{booking.checkInInstructions}</p>
                    </div>
                  )}
                  {booking.checkOutInstructions && (
                    <div>
                      <h4 className="font-medium mb-1">Check-out Instructions</h4>
                      <p className="text-sm text-muted-foreground">{booking.checkOutInstructions}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Review Section */}
            {booking.status === 'completed' && (
              <div>
                {showReviewForm ? (
                  <ReviewForm
                    bookingId={booking.id}
                    onSubmit={handleReviewSubmit}
                    onCancel={() => setShowReviewForm(false)}
                  />
                ) : localReview || booking.review ? (
                  <ReviewDisplay
                    review={localReview || booking.review!}
                    guestName={`${booking.guestInfo.firstName} ${booking.guestInfo.lastName}`}
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
                    Room Rate x {booking.pricing.nights} nights
                  </span>
                  <span>₹{(booking.pricing.roomRate * booking.pricing.nights).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxes & GST</span>
                  <span>₹{booking.pricing.taxes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service Fees</span>
                  <span>₹{booking.pricing.fees.toLocaleString()}</span>
                </div>
                {booking.pricing.discount > 0 && (
                  <div className="flex justify-between text-sm text-secondary">
                    <span>Discount</span>
                    <span>-₹{booking.pricing.discount.toLocaleString()}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Paid</span>
                  <span>₹{booking.pricing.total.toLocaleString()}</span>
                </div>
                {booking.paymentStatus === 'refunded' && (
                  <Badge variant="secondary" className="w-full justify-center mt-2">
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Refunded
                  </Badge>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
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
                {booking.status === 'completed' && (
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
            </Card>

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
                  {booking.cancellationPolicy}
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
