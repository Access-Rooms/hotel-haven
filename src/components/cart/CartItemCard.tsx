import { format } from 'date-fns';
import { Trash2, AlertTriangle, TrendingUp, Calendar, Users, MapPin, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CartItem } from '@/types/booking';
import { cn } from '@/lib/utils';

interface CartItemCardProps {
  item: CartItem;
  onRemove: (id: string) => void;
  onEdit?: (id: string) => void;
}

export function CartItemCard({ item, onRemove, onEdit }: CartItemCardProps) {
  return (
    <Card className={cn(
      'overflow-hidden transition-all',
      !item.isAvailable && 'opacity-70 border-destructive/50'
    )}>
      <CardContent className="p-0">
        <div className="flex gap-3">
          {/* Image */}
          <div className="relative w-24 h-28 flex-shrink-0">
            <img
              src={item.roomImage}
              alt={item.roomType}
              className="w-full h-full object-cover"
            />
            {!item.isAvailable && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 py-3 pr-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h4 className="font-medium text-foreground text-sm truncate">
                  {item.roomType}
                </h4>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  {item.hotelName}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive flex-shrink-0"
                onClick={() => onRemove(item.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {format(item.checkIn, 'dd MMM')} - {format(item.checkOut, 'dd MMM')}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {item.guests.adults}A{item.guests.children > 0 && `, ${item.guests.children}C`}
              </span>
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">
                  ₹{item.totalPrice.toLocaleString()}
                </span>
                {item.priceChanged && item.originalPrice && (
                  <>
                    <span className="text-xs text-muted-foreground line-through">
                      ₹{item.originalPrice.toLocaleString()}
                    </span>
                    <Badge variant="secondary" className="text-xs px-1.5 py-0">
                      <TrendingUp className="w-3 h-3 mr-0.5" />
                      Price changed
                    </Badge>
                  </>
                )}
              </div>
            </div>

            {!item.isAvailable && (
              <Badge variant="destructive" className="mt-2 text-xs">
                <AlertTriangle className="w-3 h-3 mr-1" />
                No longer available
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface CartEmptyProps {
  onBrowse: () => void;
}

export function CartEmpty({ onBrowse }: CartEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <ShoppingBag className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="font-display font-semibold text-lg text-foreground mb-2">
        Your cart is empty
      </h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-xs">
        Explore our hotels and add rooms to your cart to begin your booking
      </p>
      <Button onClick={onBrowse}>
        Browse Rooms
      </Button>
    </div>
  );
}
