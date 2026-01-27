import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Filter, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

interface BookingFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
}

export interface FilterState {
  dateFrom?: Date;
  dateTo?: Date;
  hotel?: string;
  location?: string;
  priceMin?: number;
  priceMax?: number;
}

const hotels = [
  'Ocean Pearl Resort',
  'Mountain View Lodge',
  'City Center Hotel',
];

const locations = [
  'Goa, India',
  'Shimla, India',
  'Mumbai, India',
];

export function BookingFilters({ onFiltersChange }: BookingFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({});
  const [isOpen, setIsOpen] = useState(false);

  const activeFilterCount = Object.values(filters).filter(v => v !== undefined && v !== '').length;

  const handleApply = () => {
    onFiltersChange(filters);
    setIsOpen(false);
  };

  const handleClear = () => {
    setFilters({});
    onFiltersChange({});
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Filter Bookings</SheetTitle>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Date Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Date Range</Label>
            <div className="grid grid-cols-2 gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'justify-start text-left font-normal',
                      !filters.dateFrom && 'text-muted-foreground'
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {filters.dateFrom ? format(filters.dateFrom, 'PPP') : 'From'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={filters.dateFrom}
                    onSelect={(date) => setFilters(prev => ({ ...prev, dateFrom: date }))}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'justify-start text-left font-normal',
                      !filters.dateTo && 'text-muted-foreground'
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {filters.dateTo ? format(filters.dateTo, 'PPP') : 'To'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={filters.dateTo}
                    onSelect={(date) => setFilters(prev => ({ ...prev, dateTo: date }))}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Hotel */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Hotel</Label>
            <Select
              value={filters.hotel}
              onValueChange={(value) => setFilters(prev => ({ ...prev, hotel: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select hotel" />
              </SelectTrigger>
              <SelectContent>
                {hotels.map((hotel) => (
                  <SelectItem key={hotel} value={hotel}>
                    {hotel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Location</Label>
            <Select
              value={filters.location}
              onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Price Range</Label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                placeholder="Min ₹"
                value={filters.priceMin || ''}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  priceMin: e.target.value ? Number(e.target.value) : undefined 
                }))}
              />
              <Input
                type="number"
                placeholder="Max ₹"
                value={filters.priceMax || ''}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  priceMax: e.target.value ? Number(e.target.value) : undefined 
                }))}
              />
            </div>
          </div>
        </div>

        <SheetFooter className="flex gap-3">
          <Button variant="outline" onClick={handleClear} className="flex-1">
            <X className="w-4 h-4 mr-2" />
            Clear All
          </Button>
          <Button onClick={handleApply} className="flex-1">
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
