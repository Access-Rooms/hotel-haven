import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Building2, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { companyConfig, locations, getHotelsByLocation } from '@/data/companyData';
import { cn } from '@/lib/utils';

export default function Locations() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredLocations = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return locations.filter(loc => 
      loc.name.toLowerCase().includes(query) ||
      loc.description.toLowerCase().includes(query) ||
      loc.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  const featuredLocations = filteredLocations.filter(loc => loc.featured && loc.hotelCount > 0);
  const otherLocations = filteredLocations.filter(loc => !loc.featured && loc.hotelCount > 0);
  const comingSoon = filteredLocations.filter(loc => loc.hotelCount === 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container-hotel text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Discover Your Next Stay
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {companyConfig.name} offers exceptional hospitality across India's most beautiful destinations
          </p>
          
          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              type="text"
              placeholder="Search city or destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 text-lg rounded-2xl border-2 border-border focus:border-primary shadow-soft"
            />
          </div>
        </div>
      </section>

      {/* Featured Locations */}
      {featuredLocations.length > 0 && (
        <section className="py-16">
          <div className="container-hotel">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8">
              Popular Destinations
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredLocations.map((location) => (
                <LocationCard key={location.id} location={location} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other Locations */}
      {otherLocations.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container-hotel">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8">
              More Destinations
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {otherLocations.map((location) => (
                <LocationCard key={location.id} location={location} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Coming Soon */}
      {comingSoon.length > 0 && (
        <section className="py-16">
          <div className="container-hotel">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8">
              Coming Soon
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {comingSoon.map((location) => (
                <div 
                  key={location.id}
                  className="relative rounded-2xl overflow-hidden bg-card border border-border opacity-60"
                >
                  <div className="aspect-[4/3] relative">
                    <img 
                      src={location.image} 
                      alt={location.name}
                      className="w-full h-full object-cover grayscale"
                    />
                    <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                      <Badge variant="secondary" className="text-sm">Coming Soon</Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-semibold text-lg text-foreground">
                      {location.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {filteredLocations.length === 0 && (
        <section className="py-24">
          <div className="container-hotel text-center">
            <MapPin className="mx-auto text-muted-foreground mb-4" size={48} />
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              No destinations found
            </h3>
            <p className="text-muted-foreground">
              Try searching for a different city or destination
            </p>
          </div>
        </section>
      )}

      <Footer />
      <WhatsAppButton />
    </div>
  );
}

interface LocationCardProps {
  location: {
    id: string;
    name: string;
    slug: string;
    image: string;
    description: string;
    hotelCount: number;
    tags: string[];
    featured: boolean;
  };
  featured?: boolean;
}

function LocationCard({ location, featured }: LocationCardProps) {
  const hotelCount = getHotelsByLocation(location.id).length;
  
  return (
    <Link 
      to={`/locations/${location.slug}`}
      className={cn(
        'group relative rounded-2xl overflow-hidden bg-card border border-border shadow-card hover:shadow-elevated transition-all duration-300',
        featured && 'lg:col-span-1'
      )}
    >
      <div className={cn(
        'relative overflow-hidden',
        featured ? 'aspect-[4/3]' : 'aspect-[3/2]'
      )}>
        <img 
          src={location.image} 
          alt={location.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Tags */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {location.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-white/90 text-foreground text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
          <h3 className="font-display font-bold text-xl md:text-2xl text-white mb-1">
            {location.name}
          </h3>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <Building2 size={14} />
            <span>{hotelCount} {hotelCount === 1 ? 'Hotel' : 'Hotels'}</span>
          </div>
        </div>
      </div>
      
      {featured && (
        <div className="p-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground line-clamp-1">
            {location.description}
          </p>
          <ChevronRight className="text-primary shrink-0" size={20} />
        </div>
      )}
    </Link>
  );
}
