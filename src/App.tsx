import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BookingProvider } from "@/contexts/BookingContext";
import { hasMultipleHotels, hotels } from "@/data/companyData";
import Index from "./pages/Index";
import Locations from "./pages/Locations";
import HotelList from "./pages/HotelList";
import HotelHome from "./pages/HotelHome";
import Rooms from "./pages/Rooms";
import RoomDetails from "./pages/RoomDetails";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Determine home route based on number of hotels
function HomeRedirect() {
  if (!hasMultipleHotels() && hotels.length === 1) {
    return <Navigate to={`/hotels/${hotels[0].slug}`} replace />;
  }
  return <Locations />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BookingProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Home - redirects based on hotel count */}
            <Route path="/" element={<HomeRedirect />} />
            
            {/* Multi-hotel discovery flow */}
            <Route path="/locations" element={<Locations />} />
            <Route path="/locations/:locationSlug" element={<HotelList />} />
            
            {/* Hotel-specific pages */}
            <Route path="/hotels/:hotelSlug" element={<HotelHome />} />
            <Route path="/hotels/:hotelSlug/rooms" element={<Rooms />} />
            <Route path="/hotels/:hotelSlug/rooms/:roomId" element={<RoomDetails />} />
            <Route path="/hotels/:hotelSlug/gallery" element={<Gallery />} />
            <Route path="/hotels/:hotelSlug/contact" element={<Contact />} />
            
            {/* Legacy routes for backward compatibility */}
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/rooms/:roomId" element={<RoomDetails />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </BookingProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
