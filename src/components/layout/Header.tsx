import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Phone, User, LogOut, Calendar, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { hotelConfig } from '@/data/hotelData';
import { cn } from '@/lib/utils';
import { Hotel } from '@/models/home.models';
import { authService, AuthService } from '@/services/auth.service';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Rooms', href: '/rooms' },
  { name: 'My Bookings', href: '/bookings' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Contact', href: '/contact' },
];

export function Header({ hotel }: { hotel: Hotel | null }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(hotel);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (hotel) {
      setSelectedHotel(hotel);
    }
  }, [hotel]);

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

  useEffect(() => {
    // Check login status on mount and when location changes
    const loggedIn = AuthService.isLoggedIn();
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      setUserName(AuthService.getUserName());
    }
  }, [location]);

  // Check if we're on the home page with a hero section (for light text on dark background)
  const isHomePage = location.pathname === '/';

  // Type-safe variant selection
  const buttonVariant = (isScrolled || !isHomePage ? 'default' : 'heroOutline') as 'default' | 'heroOutline';
  const buttonSize = 'default' as const;

  const handleLogout = () => {
    AuthService.logout();
    setIsLoggedIn(false);
    setUserName('');
    navigate('/');
  };
  
  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-card/95 backdrop-blur-md shadow-soft py-3'
          : isHomePage
          ? 'bg-transparent py-5'
          : 'bg-card/80 backdrop-blur-sm py-5'
      )}
    >
      <div className="container-hotel">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center shadow-soft group-hover:shadow-card transition-shadow">
              <span className="text-primary-foreground font-display font-bold text-lg">
                {selectedHotel?.hotelName.charAt(0)}
              </span>
            </div>
            <div className="hidden sm:block">
              <h1 className={cn(
                'font-display font-semibold text-lg transition-colors',
                isScrolled || !isHomePage ? 'text-foreground' : 'text-card'
              )}>
                {selectedHotel?.hotelName}
              </h1>
              <p className={cn(
                'text-xs transition-colors',
                isScrolled || !isHomePage ? 'text-muted-foreground' : 'text-card/80'
              )}>
                {selectedHotel?.locationName}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks
              .filter((link) => link.name !== 'My Bookings' || isLoggedIn)
              .map((link) => (
                <Link
                  key={link.name}
                  to={link.href + `?hotelId=${selectedHotel?._id}`}
                  className={cn(
                    'relative font-medium transition-colors text-sm',
                    isScrolled || !isHomePage ? 'text-foreground hover:text-primary' : 'text-card hover:text-card/80',
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
            <a href={`tel:${selectedHotel?.contactDetails.phoneNumber[0]}`} className={cn(
              'flex items-center gap-2 text-sm font-medium transition-colors',
              isScrolled || !isHomePage ? 'text-muted-foreground hover:text-foreground' : 'text-card/80 hover:text-card'
            )}>
              <Phone size={16} />
              <span className="hidden lg:inline">{selectedHotel?.contactDetails.phoneNumber[0]}</span>
            </a>
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
                      isScrolled || !isHomePage
                        ? 'text-foreground hover:bg-muted'
                        : 'text-card hover:bg-card/10'
                    )}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-hero flex items-center justify-center">
                      <User size={16} className="text-primary-foreground" />
                    </div>
                    <span className="text-sm font-medium hidden lg:inline">{userName || 'User'}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/bookings" className="flex items-center gap-2 cursor-pointer">
                      <Calendar size={16} />
                      Bookings
                    </Link>
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem asChild>
                    <Link to="/chart" className="flex items-center gap-2 cursor-pointer">
                      <BarChart3 size={16} />
                      Chart
                    </Link>
                  </DropdownMenuItem> */}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive">
                    <LogOut size={16} />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                {...({ variant: buttonVariant, size: buttonSize, asChild: true } as any)}
              >
                <Link to="/login">Login</Link>
              </Button>
            )}
            <Button 
              {...({ variant: buttonVariant, size: buttonSize, asChild: true } as any)}
            >
              <Link to={`/rooms?hotelId=${selectedHotel?._id}`}>Book Now</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              'md:hidden p-2 rounded-lg transition-colors',
              isScrolled || !isHomePage ? 'text-foreground hover:bg-muted' : 'text-card hover:bg-card/10'
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
          {navLinks
            .filter((link) => link.name !== 'My Bookings' || isLoggedIn)
            .map((link) => (
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
              href={`tel:${selectedHotel?.contactDetails.phoneNumber[0]}`}
              className="flex items-center gap-3 py-3 px-4 text-muted-foreground"
            >
              <Phone size={18} />
              {selectedHotel?.contactDetails.phoneNumber[0]}
            </a>
            {isLoggedIn ? (
              <>
                <Link
                  to="/bookings"
                  className="flex items-center gap-3 py-3 px-4 rounded-lg font-medium transition-colors text-foreground hover:bg-muted hover:text-foreground"
                >
                  <Calendar size={18} />
                  Bookings
                </Link>
                {/* <Link
                  to="/chart"
                  className="flex items-center gap-3 py-3 px-4 rounded-lg font-medium transition-colors text-foreground hover:bg-muted hover:text-foreground"
                >
                  <BarChart3 size={18} />
                  Chart
                </Link> */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 py-3 px-4 rounded-lg font-medium transition-colors text-destructive hover:bg-muted hover:text-foreground w-full text-left"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <Button 
                {...({ variant: "booking", size: "lg", asChild: true, className: "w-full" } as any)}
              >
                <Link to="/login">Login</Link>
              </Button>
            )}
            <Button 
              {...({ variant: "booking", size: "lg", asChild: true, className: "w-full" } as any)}
            >
              <Link to="/rooms">Book Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
