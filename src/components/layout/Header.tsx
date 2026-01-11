import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { hotelConfig } from '@/data/hotelData';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Rooms', href: '/rooms' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Contact', href: '/contact' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-card/95 backdrop-blur-md shadow-soft py-3'
          : 'bg-transparent py-5'
      )}
    >
      <div className="container-hotel">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center shadow-soft group-hover:shadow-card transition-shadow">
              <span className="text-primary-foreground font-display font-bold text-lg">
                {hotelConfig.name.charAt(0)}
              </span>
            </div>
            <div className="hidden sm:block">
              <h1 className={cn(
                'font-display font-semibold text-lg transition-colors',
                isScrolled ? 'text-foreground' : 'text-card'
              )}>
                {hotelConfig.name}
              </h1>
              <p className={cn(
                'text-xs transition-colors',
                isScrolled ? 'text-muted-foreground' : 'text-card/80'
              )}>
                {hotelConfig.location}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  'relative font-medium transition-colors text-sm',
                  isScrolled ? 'text-foreground hover:text-primary' : 'text-card hover:text-card/80',
                  location.pathname === link.href && 'text-primary',
                  'after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300',
                  location.pathname === link.href ? 'after:w-full' : 'after:w-0 hover:after:w-full'
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a href={`tel:${hotelConfig.phone}`} className={cn(
              'flex items-center gap-2 text-sm font-medium transition-colors',
              isScrolled ? 'text-muted-foreground hover:text-foreground' : 'text-card/80 hover:text-card'
            )}>
              <Phone size={16} />
              <span className="hidden lg:inline">{hotelConfig.phone}</span>
            </a>
            <Button variant={isScrolled ? 'default' : 'heroOutline'} size="default" asChild>
              <Link to="/rooms">Book Now</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              'md:hidden p-2 rounded-lg transition-colors',
              isScrolled ? 'text-foreground hover:bg-muted' : 'text-card hover:bg-card/10'
            )}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        'md:hidden absolute top-full left-0 right-0 bg-card shadow-elevated transition-all duration-300 overflow-hidden',
        isMobileMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
      )}>
        <div className="container-hotel py-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={cn(
                'block py-3 px-4 rounded-lg font-medium transition-colors',
                location.pathname === link.href
                  ? 'bg-primary/10 text-primary'
                  : 'text-foreground hover:bg-muted'
              )}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-border space-y-3">
            <a
              href={`tel:${hotelConfig.phone}`}
              className="flex items-center gap-3 py-3 px-4 text-muted-foreground"
            >
              <Phone size={18} />
              {hotelConfig.phone}
            </a>
            <Button variant="booking" size="lg" className="w-full" asChild>
              <Link to="/rooms">Book Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
