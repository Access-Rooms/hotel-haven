import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  CreditCard,
  Phone,
  MessageCircle,
  MapPin,
  Users,
  Moon,
  Calendar,
  Shield,
  ArrowRight,
  HelpCircle,
  Clock,
  Bookmark,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { hotelConfig } from '@/data/hotelData';

type FailureType = 'failed' | 'cancelled' | 'pending' | 'refund_in_progress';

interface FailureConfig {
  icon: typeof XCircle;
  title: string;
  subtitle: string;
  badgeText: string;
  badgeVariant: 'destructive' | 'secondary' | 'outline';
  showRetry: boolean;
}

const failureConfigs: Record<FailureType, FailureConfig> = {
  failed: {
    icon: XCircle,
    title: 'Payment Failed',
    subtitle: "Don't worry, your amount has not been charged.",
    badgeText: 'Failed',
    badgeVariant: 'destructive',
    showRetry: true,
  },
  cancelled: {
    icon: XCircle,
    title: 'Transaction Cancelled',
    subtitle: 'You cancelled the payment. Your booking is still saved.',
    badgeText: 'Cancelled',
    badgeVariant: 'secondary',
    showRetry: true,
  },
  pending: {
    icon: Clock,
    title: 'Payment Pending',
    subtitle: 'Your payment is being processed. Please wait a few minutes.',
    badgeText: 'Pending',
    badgeVariant: 'outline',
    showRetry: false,
  },
  refund_in_progress: {
    icon: RefreshCw,
    title: 'Refund In Progress',
    subtitle: 'Your refund will be credited within 5-7 business days.',
    badgeText: 'Refund Processing',
    badgeVariant: 'outline',
    showRetry: false,
  },
};

// Mock transaction data
const mockTransactionData = {
  referenceId: 'AR-982341',
  hotelName: 'Ocean Pearl Resort',
  location: 'Goa, India',
  roomType: 'Deluxe Sea View',
  checkIn: '15 Feb 2026',
  checkOut: '18 Feb 2026',
  nights: 3,
  guests: { adults: 2, children: 1 },
  attemptedAmount: 18500,
  paymentMethod: 'UPI',
  errorReason: 'Bank server temporarily unavailable. Please try again.',
  transactionId: 'TXN-8923456781',
};

function ErrorAnimation({ type }: { type: FailureType }) {
  const config = failureConfigs[type];
  const Icon = config.icon;
  const isWarning = type === 'pending' || type === 'refund_in_progress';

  return (
    <motion.div
      className="relative"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      {/* Subtle pulse ring */}
      <motion.div
        className={`absolute inset-0 rounded-full ${isWarning ? 'bg-accent/20' : 'bg-destructive/20'}`}
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 0, 0.5]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Icon container */}
      <motion.div 
        className={`relative w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center ${
          isWarning 
            ? 'bg-gradient-to-br from-accent/80 to-accent' 
            : 'bg-gradient-to-br from-destructive/80 to-destructive'
        }`}
        initial={{ rotate: -10 }}
        animate={{ rotate: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.3 }}
        >
          <Icon className="w-12 h-12 md:w-14 md:h-14 text-white" strokeWidth={2} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function WhatsAppSupport({ bookingRef }: { bookingRef: string }) {
  const prefilledMessage = encodeURIComponent(
    `My payment failed for booking ${bookingRef}. Please help.`
  );

  return (
    <motion.a
      href={`https://wa.me/${hotelConfig.whatsappNumber.replace(/\D/g, '')}?text=${prefilledMessage}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-elevated transition-transform duration-200 hover:scale-110"
      style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: "spring" }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <MessageCircle className="w-6 h-6 text-white fill-white" />
    </motion.a>
  );
}

export default function PaymentFailed() {
  const [searchParams] = useSearchParams();
  const type = (searchParams.get('type') as FailureType) || 'failed';
  const bookingRef = searchParams.get('ref') || mockTransactionData.referenceId;
  
  const config = failureConfigs[type] || failureConfigs.failed;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Simple Header */}
      <header className="bg-card border-b border-border py-4">
        <div className="container-hotel">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center shadow-soft">
                <span className="text-primary-foreground font-display font-bold text-lg">
                  {hotelConfig.name?.charAt(0) || 'O'}
                </span>
              </div>
              <div className="hidden sm:block">
                <h1 className="font-display font-semibold text-lg text-foreground">
                  {hotelConfig.name || 'Ocean Pearl Resort'}
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
          {/* Error Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex justify-center mb-6">
              <ErrorAnimation type={type} />
            </div>
            
            <motion.h1 
              className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {config.title}
            </motion.h1>
            
            <motion.p 
              className="text-lg text-muted-foreground mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {config.subtitle}
            </motion.p>

            {type === 'failed' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Alert className="max-w-md mx-auto bg-muted/50 border-muted">
                  <AlertTriangle className="h-4 w-4 text-accent" />
                  <AlertDescription className="text-sm text-muted-foreground">
                    If any amount was debited, it will be refunded within 5-7 business days as per bank policy.
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </motion.div>

          {/* Transaction Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="overflow-hidden shadow-card">
              {/* Card Header */}
              <div className="bg-muted p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Booking Reference</p>
                    <p className="font-mono font-semibold text-foreground">{bookingRef}</p>
                  </div>
                  <Badge variant={config.badgeVariant} className="px-4 py-1.5">
                    {config.badgeText}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                {/* Hotel Info */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-20 h-20 rounded-xl bg-muted overflow-hidden flex-shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=200" 
                      alt={mockTransactionData.hotelName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">{mockTransactionData.hotelName}</h3>
                    <p className="text-muted-foreground flex items-center gap-1.5 mt-1">
                      <MapPin className="w-4 h-4" />
                      {mockTransactionData.location}
                    </p>
                    <p className="text-primary font-medium mt-1">{mockTransactionData.roomType}</p>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Booking Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 rounded-xl bg-muted/50">
                    <Calendar className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground mb-1">Check-in</p>
                    <p className="font-semibold text-foreground text-sm">{mockTransactionData.checkIn}</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-muted/50">
                    <Calendar className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground mb-1">Check-out</p>
                    <p className="font-semibold text-foreground text-sm">{mockTransactionData.checkOut}</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-muted/50">
                    <Moon className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground mb-1">Duration</p>
                    <p className="font-semibold text-foreground text-sm">{mockTransactionData.nights} nights</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-muted/50">
                    <Users className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground mb-1">Guests</p>
                    <p className="font-semibold text-foreground text-sm">
                      {mockTransactionData.guests.adults}A, {mockTransactionData.guests.children}C
                    </p>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Payment Attempt Info */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-destructive/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-destructive" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Amount Attempted</p>
                        <p className="font-semibold text-foreground">{mockTransactionData.paymentMethod}</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {hotelConfig.currencySymbol}{mockTransactionData.attemptedAmount.toLocaleString()}
                    </p>
                  </div>

                  {/* Error Reason */}
                  <div className="p-4 rounded-xl bg-muted/50 border border-border">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Error Details</p>
                        <p className="text-sm text-muted-foreground">{mockTransactionData.errorReason}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Transaction ID: {mockTransactionData.transactionId}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recovery Actions */}
          <motion.div 
            className="mt-8 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            {/* Primary Actions */}
            {config.showRetry && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button size="lg" className="w-full gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Retry Payment
                </Button>
                <Button size="lg" variant="outline" className="w-full gap-2">
                  <CreditCard className="w-4 h-4" />
                  Try Another Method
                </Button>
              </div>
            )}

            {/* Secondary Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Button variant="ghost" size="sm" className="w-full gap-2">
                <Bookmark className="w-4 h-4" />
                Save for Later
              </Button>
              <Button variant="ghost" size="sm" className="w-full gap-2">
                <Phone className="w-4 h-4" />
                Contact Support
              </Button>
              <Button variant="ghost" size="sm" className="w-full gap-2 text-whatsapp hover:text-whatsapp-dark hover:bg-whatsapp/10">
                <MessageCircle className="w-4 h-4" />
                WhatsApp Help
              </Button>
              <Button variant="ghost" size="sm" className="w-full gap-2" asChild>
                <Link to="/bookings">
                  <HelpCircle className="w-4 h-4" />
                  My Bookings
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Trust & Reassurance */}
          <motion.div 
            className="mt-10 p-6 rounded-2xl bg-muted/50 space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            <div className="flex items-center gap-3 text-muted-foreground">
              <Shield className="w-5 h-5 text-secondary" />
              <span className="text-sm">Your payment information is secure and was not saved</span>
            </div>
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">Need immediate help?</p>
              <div className="flex flex-wrap gap-4">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4" />
                  {hotelConfig.phone}
                </span>
                <span>Available 24/7</span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="bg-foreground text-background py-8">
        <div className="container-hotel text-center">
          <p className="text-sm text-background/60">
            © {new Date().getFullYear()} {hotelConfig.name || 'Ocean Pearl Resort'}. All rights reserved.
          </p>
        </div>
      </footer>
      
      {/* Floating WhatsApp Support */}
      <WhatsAppSupport bookingRef={bookingRef} />
    </div>
  );
}