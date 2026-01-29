import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BookingProvider } from "@/contexts/BookingContext";
import { HotelProvider } from "@/contexts/HotelContext";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import Rooms from "./pages/Rooms";
import RoomDetails from "./pages/RoomDetails";
import ReservationReview from "./pages/ReservationReview";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyOTP from "./pages/VerifyOTP";
import MyBookings from "./pages/MyBookings";
import BookingDetails from "./pages/BookingDetails";
import AddReview from "./pages/AddReview";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BookingProvider>
        <HotelProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter basename="/hotel-demo">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/rooms" element={<Rooms />} />
                <Route path="/rooms/:roomId" element={<RoomDetails />} />
                <Route path="/reservation/:roomId" element={<ReservationReview />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/verify-otp" element={<VerifyOTP />} />
                <Route path="/bookings" element={<MyBookings />} />
                <Route path="/bookings/:bookingId" element={<BookingDetails />} />
                <Route path="/bookings/:bookingId/review" element={<AddReview />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </HotelProvider>
      </BookingProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
