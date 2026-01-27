import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ReviewForm, ReviewFormData } from '@/components/reviews/ReviewForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useHotels } from '@/contexts/HotelContext';
import { mockBookings } from '@/data/mockBookings';
import { cn } from '@/lib/utils';

export default function AddReview() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { selectedHotel: hotel } = useHotels();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const booking = mockBookings.find(b => b.id === bookingId);

  if (!booking || booking.status !== 'completed') {
    return (
      <div className="min-h-screen bg-background">
        <Header hotel={hotel} />
        <main className="container-hotel pt-24 pb-16">
          <div className="text-center py-16">
            <h2 className="text-2xl font-display font-semibold mb-2">
              Review Not Available
            </h2>
            <p className="text-muted-foreground mb-6">
              Reviews can only be added for completed stays.
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

  if (booking.review) {
    navigate(`/bookings/${bookingId}`);
    return null;
  }

  const handleSubmit = async (reviewData: ReviewFormData) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitted(true);
    
    toast({
      title: 'Review Submitted!',
      description: 'Thank you for sharing your experience.',
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header hotel={hotel} />
        <main className="container-hotel pt-24 pb-16">
          <Card className="max-w-lg mx-auto">
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-secondary" />
              </div>
              <h2 className="text-2xl font-display font-semibold mb-2">
                Thank You!
              </h2>
              <p className="text-muted-foreground mb-6">
                Your review has been submitted successfully.
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" asChild>
                  <Link to="/bookings">View Bookings</Link>
                </Button>
                <Button asChild>
                  <Link to={`/bookings/${bookingId}`}>View Booking Details</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer hotel={hotel} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header hotel={hotel} />

      <main className="container-hotel pt-24 pb-16">
        <Button variant="ghost" asChild className="mb-6 -ml-2">
          <Link to={`/bookings/${bookingId}`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Booking
          </Link>
        </Button>

        {/* Booking Context */}
        <div className="mb-6 p-4 bg-muted/50 rounded-xl flex items-center gap-4">
          <img
            src={booking.hotelImage}
            alt={booking.hotelName}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div>
            <h2 className="font-display font-semibold">{booking.hotelName}</h2>
            <p className="text-sm text-muted-foreground">
              {booking.roomType} • {booking.location}
            </p>
          </div>
        </div>

        <div className="max-w-2xl">
          <ReviewForm
            bookingId={booking.id}
            onSubmit={handleSubmit}
            onCancel={() => navigate(`/bookings/${bookingId}`)}
          />
        </div>
      </main>

      <Footer hotel={hotel} />
    </div>
  );
}
