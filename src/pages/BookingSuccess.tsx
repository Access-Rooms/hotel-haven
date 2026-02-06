import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  Copy, 
  Check, 
  Download, 
  Calendar, 
  Phone, 
  MessageCircle,
  MapPin,
  Users,
  Moon,
  CreditCard,
  Mail,
  Smartphone,
  Shield,
  ArrowRight,
  Hotel,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { hotelConfig } from '@/data/hotelData';
import { useHotels } from '@/contexts/HotelContext';
import { useBooking } from '@/contexts/BookingContext';
import { environment } from '../../environment';

// Helper function to format date
const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateString;
  }
};

// Helper function to calculate nights
const calculateNights = (checkIn: string | null, checkOut: string | null): number => {
  if (!checkIn || !checkOut) return 0;
  try {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  } catch {
    return 0;
  }
};

// Helper function to get image URL
const getImageUrl = (imagePath: string | undefined): string | null => {
  if (!imagePath) return null;
  if (typeof imagePath === 'string' && (imagePath.startsWith('http://') || imagePath.startsWith('https://'))) {
    return imagePath;
  }
  return `${environment.imageBaseUrl}${imagePath}`;
};

const confettiColors = ['#0A5EFF', '#00C2A8', '#FFB800', '#FF6B6B', '#A855F7'];

function ConfettiPiece({ delay, x }: { delay: number; x: number }) {
  const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
  
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-sm"
      style={{ backgroundColor: color, left: `${x}%` }}
      initial={{ y: -20, opacity: 1, rotate: 0, scale: 1 }}
      animate={{ 
        y: 400, 
        opacity: 0, 
        rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
        scale: 0.5,
        x: (Math.random() - 0.5) * 100
      }}
      transition={{ 
        duration: 2 + Math.random(), 
        delay: delay,
        ease: "easeOut"
      }}
    />
  );
}

function SuccessAnimation() {
  const [showConfetti, setShowConfetti] = useState(true);
  
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setShowConfetti(false);
    }
    
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none -top-20">
            {Array.from({ length: 30 }).map((_, i) => (
              <ConfettiPiece key={i} delay={i * 0.05} x={Math.random() * 100} />
            ))}
          </div>
        )}
      </AnimatePresence>
      
      {/* Success Icon */}
      <motion.div
        className="relative"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
      >
        {/* Glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full bg-secondary/20"
          initial={{ scale: 1 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 1, repeat: 2, repeatDelay: 0.5 }}
        />
        
        {/* Icon container */}
        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-secondary to-secondary-light flex items-center justify-center shadow-glow">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.4 }}
          >
            <CheckCircle className="w-12 h-12 md:w-16 md:h-16 text-white" strokeWidth={2.5} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function CopyableReference({ reference }: { reference: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors group"
    >
      <span className="font-mono font-semibold text-foreground">{reference}</span>
      {copied ? (
        <Check className="w-4 h-4 text-secondary" />
      ) : (
        <Copy className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
      )}
    </button>
  );
}

function DeliveryStatus() {
  const deliveryMethods = [
    { icon: Mail, label: 'Email sent', status: 'sent' },
    { icon: Smartphone, label: 'SMS sent', status: 'sent' },
    { icon: MessageCircle, label: 'WhatsApp sent', status: 'sent' },
  ];

  return (
    <motion.div 
      className="flex flex-wrap justify-center gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      {deliveryMethods.map((method, index) => (
        <motion.div
          key={method.label}
          className="flex items-center gap-2 text-sm text-muted-foreground"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 + index * 0.1 }}
        >
          <div className="w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center">
            <Check className="w-3 h-3 text-secondary" />
          </div>
          <method.icon className="w-4 h-4" />
          <span>{method.label}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function BookingSuccess() {
  const [searchParams] = useSearchParams();
  const { selectedHotel } = useHotels();
  const { checkIn, checkOut, guests } = useBooking();
  
  const bookingRef = searchParams.get('ref') || 'N/A';
  
  // Get booking data from URL params
  const roomType = searchParams.get('roomType') || '';
  const totalAmount = searchParams.get('amount') ? parseFloat(searchParams.get('amount')!) : null;
  const paymentMethod = searchParams.get('paymentMethod') || '';
  const adults = searchParams.get('adults') ? parseInt(searchParams.get('adults')!) : guests;
  const children = searchParams.get('children') ? parseInt(searchParams.get('children')!) : 0;
  
  // Format dates
  const checkInFormatted = formatDate(checkIn);
  const checkOutFormatted = formatDate(checkOut);
  const nights = calculateNights(checkIn, checkOut);
  
  // Get hotel data
  const hotelName = selectedHotel?.hotelName || hotelConfig.name || 'Hotel';
  const location = selectedHotel?.locationName || selectedHotel?.address || '';
  const hotelImage = selectedHotel?.websiteData?.coverImage || selectedHotel?.coverImages || '';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Simple Header */}
      <header className="bg-card border-b border-border py-4">
        <div className="container-hotel">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center shadow-soft overflow-hidden">
                {selectedHotel?.propertyLogo ? (
                  <img 
                    src={getImageUrl(selectedHotel.propertyLogo) || ''} 
                    alt={hotelName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-primary-foreground font-display font-bold text-lg">
                    {hotelName.charAt(0)}
                  </span>
                )}
              </div>
              <div className="hidden sm:block">
                <h1 className="font-display font-semibold text-lg text-foreground">
                  {hotelName}
                </h1>
              </div>
            </Link>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 py-8 md:py-12">
        <div className="container-hotel max-w-3xl">
          {/* Success Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex justify-center mb-6">
              <SuccessAnimation />
            </div>
            
            <motion.h1 
              className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Your Booking is Confirmed! 🎉
            </motion.h1>
            
            <motion.p 
              className="text-lg text-muted-foreground mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Payment successful. We've sent the booking details to your email and phone.
            </motion.p>
            
            <motion.p 
              className="text-secondary font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Get ready for a great stay! ✨
            </motion.p>
          </motion.div>

          {/* Confirmation Delivery Status */}
          <div className="mb-8">
            <DeliveryStatus />
          </div>

          {/* Booking Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <Card className="overflow-hidden shadow-card">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-primary to-primary-dark p-6 text-primary-foreground">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-sm opacity-80 mb-1">Booking Reference</p>
                    <CopyableReference reference={bookingRef} />
                  </div>
                  <Badge className="bg-secondary text-secondary-foreground border-0 px-4 py-1.5">
                    <CheckCircle className="w-4 h-4 mr-1.5" />
                    Confirmed
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                {/* Hotel Info */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-20 h-20 rounded-xl bg-muted overflow-hidden flex-shrink-0">
                    <img 
                      src={getImageUrl(hotelImage) || "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=200"} 
                      alt={hotelName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">{hotelName}</h3>
                    {location && (
                      <p className="text-muted-foreground flex items-center gap-1.5 mt-1">
                        <MapPin className="w-4 h-4" />
                        {location}
                      </p>
                    )}
                    {roomType && (
                      <p className="text-primary font-medium mt-1">{roomType}</p>
                    )}
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Booking Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 rounded-xl bg-muted/50">
                    <Calendar className="w-5 h-5 mx-auto mb-2 text-primary" />
                    <p className="text-xs text-muted-foreground mb-1">Check-in</p>
                    <p className="font-semibold text-foreground text-sm">{checkInFormatted}</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-muted/50">
                    <Calendar className="w-5 h-5 mx-auto mb-2 text-primary" />
                    <p className="text-xs text-muted-foreground mb-1">Check-out</p>
                    <p className="font-semibold text-foreground text-sm">{checkOutFormatted}</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-muted/50">
                    <Moon className="w-5 h-5 mx-auto mb-2 text-primary" />
                    <p className="text-xs text-muted-foreground mb-1">Duration</p>
                    <p className="font-semibold text-foreground text-sm">{nights} {nights === 1 ? 'night' : 'nights'}</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-muted/50">
                    <Users className="w-5 h-5 mx-auto mb-2 text-primary" />
                    <p className="text-xs text-muted-foreground mb-1">Guests</p>
                    <p className="font-semibold text-foreground text-sm">
                      {adults}A{children > 0 ? `, ${children}C` : ''}
                    </p>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Payment Summary */}
                {totalAmount !== null && (
                  <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Paid</p>
                        {paymentMethod && (
                          <p className="font-semibold text-foreground">{paymentMethod}</p>
                        )}
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {hotelConfig.currencySymbol}{totalAmount.toLocaleString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            className="mt-8 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            {/* Primary Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button size="lg" className="w-full gap-2" asChild>
                <Link to={`/bookings/${bookingRef}`}>
                  View Booking Details
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full gap-2">
                <Download className="w-4 h-4" />
                Download Invoice
              </Button>
            </div>

            {/* Secondary Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Button variant="ghost" size="sm" className="w-full gap-2">
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Add to</span> Calendar
              </Button>
              <Button variant="ghost" size="sm" className="w-full gap-2">
                <Phone className="w-4 h-4" />
                Contact Hotel
              </Button>
              <Button variant="ghost" size="sm" className="w-full gap-2 text-whatsapp hover:text-whatsapp-dark hover:bg-whatsapp/10">
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </Button>
              <Button variant="ghost" size="sm" className="w-full gap-2" asChild>
                <Link to="/rooms">
                  <Hotel className="w-4 h-4" />
                  Browse More
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Trust Elements */}
          <motion.div 
            className="mt-10 p-6 rounded-2xl bg-muted/50 space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            <div className="flex items-center gap-3 text-muted-foreground">
              <Shield className="w-5 h-5 text-secondary" />
              <span className="text-sm">Your payment was processed securely</span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <Link to="/cancellation-policy" className="text-primary hover:underline flex items-center gap-1">
                Cancellation Policy
                <ExternalLink className="w-3 h-3" />
              </Link>
              <Link to="/contact" className="text-primary hover:underline flex items-center gap-1">
                Need Help?
                <ExternalLink className="w-3 h-3" />
              </Link>
              <Link to="/bookings" className="text-primary hover:underline flex items-center gap-1">
                Manage in My Bookings
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="bg-foreground text-background py-8">
        <div className="container-hotel text-center">
          <p className="text-sm text-background/60">
            © {new Date().getFullYear()} {hotelName}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}