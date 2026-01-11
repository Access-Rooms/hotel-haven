import { Wifi, Waves, Sparkles, UtensilsCrossed, Car, Plane, Dumbbell, Umbrella } from 'lucide-react';
import { amenities } from '@/data/hotelData';

const iconMap: Record<string, React.ReactNode> = {
  Wifi: <Wifi size={28} />,
  Waves: <Waves size={28} />,
  Sparkles: <Sparkles size={28} />,
  UtensilsCrossed: <UtensilsCrossed size={28} />,
  Car: <Car size={28} />,
  Plane: <Plane size={28} />,
  Dumbbell: <Dumbbell size={28} />,
  Umbrella: <Umbrella size={28} />,
};

export function AmenitiesSection() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container-hotel">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-hotel-secondary font-medium tracking-wider uppercase text-sm mb-4">
            Resort Amenities
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Everything You Need
          </h2>
          <p className="text-muted-foreground text-lg">
            From world-class wellness facilities to gourmet dining, we've curated every amenity for your perfect stay.
          </p>
        </div>

        {/* Amenities Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {amenities.map((amenity, index) => (
            <div
              key={amenity.id}
              className="group bg-card rounded-2xl p-6 text-center shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-secondary flex items-center justify-center text-secondary-foreground group-hover:scale-110 transition-transform duration-300">
                {iconMap[amenity.icon]}
              </div>
              <h3 className="font-display font-semibold text-foreground">
                {amenity.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
