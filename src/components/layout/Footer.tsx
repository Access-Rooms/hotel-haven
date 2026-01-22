import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';
import { hotelConfig } from '@/data/hotelData';
import { Hotel } from '@/models/home.models';
import { useState } from 'react';
import { useEffect } from 'react';

export function Footer({ hotel }: { hotel: Hotel | null }) {
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(hotel);
  useEffect(() => {
    if (hotel) {
      setSelectedHotel(hotel);
    }
  }, [hotel]);

  return (
    <footer className="bg-foreground text-background">
      <div className="container-hotel py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-lg">
                  {selectedHotel?.hotelName.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg">{selectedHotel?.hotelName}</h3>
                <p className="text-sm text-background/60">{hotelConfig?.tagline}</p>
              </div>
            </div>
            <p className="text-background/70 text-sm leading-relaxed">
              Experience unparalleled luxury at our beachfront resort, where every moment is crafted for your perfect getaway.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'Rooms', 'Gallery', 'Contact'].map((link) => (
                <li key={link}>
                  <Link
                    to={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
                    className="text-background/70 hover:text-background transition-colors text-sm"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold mb-4">Services</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li>Room Service</li>
              <li>Spa & Wellness</li>
              <li>Restaurant & Bar</li>
              <li>Airport Transfer</li>
              <li>Event Hosting</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm">
                <MapPin size={18} className="text-hotel-secondary shrink-0 mt-0.5" />
                <span className="text-background/70">{selectedHotel?.address}</span>
              </li>
              <li>
                <a href={`tel:${selectedHotel?.contactDetails.phoneNumber[0] || selectedHotel?.whatsappNumber}`} className="flex gap-3 text-sm text-background/70 hover:text-background transition-colors">
                  <Phone size={18} className="text-hotel-secondary shrink-0" />
                  {selectedHotel?.contactDetails.phoneNumber[0] || selectedHotel?.whatsappNumber || ''}
                </a>
              </li>
              <li>
                <a href={`mailto:${selectedHotel?.email}`} className="flex gap-3 text-sm text-background/70 hover:text-background transition-colors">
                  <Mail size={18} className="text-hotel-secondary shrink-0" />
                  {selectedHotel?.email || ''}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-background/50">
            © {new Date().getFullYear()} {selectedHotel?.hotelName}. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-background/50">
            <a href="#" className="hover:text-background transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-background transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
