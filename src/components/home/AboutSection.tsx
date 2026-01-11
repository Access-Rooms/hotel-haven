import { Check } from 'lucide-react';
import { hotelConfig } from '@/data/hotelData';

const highlights = [
  'Beachfront location with private access',
  'Award-winning spa & wellness center',
  'Multiple dining experiences',
  'Personalized concierge service',
];

export function AboutSection() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container-hotel">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Images Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-card">
                  <img
                    src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600"
                    alt="Pool view"
                    className="w-full h-48 sm:h-64 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-card">
                  <img
                    src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600"
                    alt="Spa"
                    className="w-full h-32 sm:h-40 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="pt-8">
                <div className="rounded-2xl overflow-hidden shadow-card h-full">
                  <img
                    src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600"
                    alt="Room"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-6 sm:bottom-8 sm:-right-8 bg-hotel-secondary text-secondary-foreground rounded-2xl p-4 sm:p-6 shadow-elevated">
              <p className="text-3xl sm:text-4xl font-display font-bold">15+</p>
              <p className="text-sm opacity-90">Years of Excellence</p>
            </div>
          </div>

          {/* Content */}
          <div className="lg:pl-8">
            <p className="text-hotel-secondary font-medium tracking-wider uppercase text-sm mb-4">
              About Our Resort
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              A Sanctuary of Luxury on the Arabian Sea
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Nestled along the pristine shores of {hotelConfig.location}, {hotelConfig.name} offers an unparalleled escape where traditional Goan hospitality meets contemporary luxury. Every detail is thoughtfully curated to create lasting memories for our distinguished guests.
            </p>

            <ul className="space-y-4 mb-8">
              {highlights.map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-hotel-secondary/20 flex items-center justify-center shrink-0">
                    <Check size={14} className="text-hotel-secondary" />
                  </div>
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-3xl font-display font-bold text-primary">50+</p>
                <p className="text-sm text-muted-foreground">Luxury Rooms</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <p className="text-3xl font-display font-bold text-primary">4.9</p>
                <p className="text-sm text-muted-foreground">Guest Rating</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <p className="text-3xl font-display font-bold text-primary">24/7</p>
                <p className="text-sm text-muted-foreground">Concierge</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
