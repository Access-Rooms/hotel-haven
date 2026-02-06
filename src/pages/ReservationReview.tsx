import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Users,
  Edit2,
  Upload,
  X,
  Check,
  Shield,
  Lock,
  MessageCircle,
  ChevronRight,
  Plus,
  Minus,
  Trash2,
  Loader2,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Phone,
  Mail,
  User,
  CreditCard,
  Info,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { roomService } from '@/services/room.service';
import { RoomDetailsResponse, GetRoomByIdPayload, RoomAvailabilityResponse, RoomAvailabilityDay } from '@/models/room.models';
import { environment } from '../../environment';
import { useHotels } from '@/contexts/HotelContext';
import { useBooking } from '@/contexts/BookingContext';
import { hotelConfig } from '@/data/hotelData';
import { AuthService } from '@/services/auth.service';
import bookingsService from '@/services/bookings.service';
import { BookingRequest } from '@/models/bookings.models';

interface GuestInfo {
  fullName: string;
  email: string;
  phone: string;
  phoneCountryCode: string;
  idType: string;
  idNumber: string;
  specialRequests: string;
}

interface AdditionalGuest {
  id: string;
  name: string;
  age: number;
  relationship: string;
}

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'pdf';
}

interface FormErrors {
  [key: string]: string;
}

export default function ReservationReview() {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const hotelIdFromQuery = searchParams.get('hotelId');
  const pricingIdFromQuery = searchParams.get('pricingId');
  const acPreferenceFromQuery = searchParams.get('acPreference');
  const navigate = useNavigate();
  const { selectedHotel } = useHotels();
  const { checkIn, checkOut, setCheckIn, setCheckOut, guests, setGuests, dateFilter } = useBooking();

  // State management
  const [roomDetails, setRoomDetails] = useState<RoomDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    fullName: '',
    email: '',
    phone: '',
    phoneCountryCode: '+91',
    idType: '',
    idNumber: '',
    specialRequests: '',
  });
  const [additionalGuests, setAdditionalGuests] = useState<AdditionalGuest[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [promoCode, setPromoCode] = useState<string>('');
  const [promoDiscount, setPromoDiscount] = useState<number>(0);
  const [showDateDialog, setShowDateDialog] = useState(false);
  const [showGuestSheet, setShowGuestSheet] = useState(false);
  const [tempCheckIn, setTempCheckIn] = useState(checkIn);
  const [tempCheckOut, setTempCheckOut] = useState(checkOut);
  const [tempAdults, setTempAdults] = useState(2);
  const [tempChildren, setTempChildren] = useState(0);
  const [tempAdultsInput, setTempAdultsInput] = useState('2');
  const [tempChildrenInput, setTempChildrenInput] = useState('0');
  const [roomCount, setRoomCount] = useState(1);
  const [formProgress, setFormProgress] = useState(0);
  const [bookingFor, setBookingFor] = useState<'myself' | 'someone-else'>('myself');
  const [roomAvailability, setRoomAvailability] = useState<RoomAvailabilityDay[]>([]);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);

  // Sync temp dates when checkIn/checkOut change
  useEffect(() => {
    setTempCheckIn(checkIn);
    setTempCheckOut(checkOut);
  }, [checkIn, checkOut]);

  // Sync temp guest inputs when dialog opens
  useEffect(() => {
    if (showGuestSheet) {
      setTempAdultsInput(tempAdults.toString());
      setTempChildrenInput(tempChildren.toString());
    }
  }, [showGuestSheet, tempAdults, tempChildren]);

  // Prefill form when booking for myself
  useEffect(() => {
    if (bookingFor === 'myself') {
      const user = AuthService.getUser();
      if (user) {
        setGuestInfo((prev) => ({
          ...prev,
          fullName: user.name || '',
          email: user.email || '',
          phone: user.phoneNumber || '',
          phoneCountryCode: user.whatsappCountryCode || '+91',
          // idType and idNumber are not in user model, so keep them as is
          // specialRequests is preserved
        }));
      }
    } else {
      // Clear form when switching to "someone else" but preserve specialRequests
      setGuestInfo((prev) => ({
        fullName: '',
        email: '',
        phone: '',
        phoneCountryCode: '+91',
        idType: '',
        idNumber: '',
        specialRequests: prev.specialRequests, // Preserve special requests
      }));
    }
  }, [bookingFor]);

  // Fetch room details
  useEffect(() => {
    const fetchRoomDetails = async () => {
      if (!roomId) {
        setIsLoading(false);
        return;
      }

      const hotelId = hotelIdFromQuery || selectedHotel?._id;
      if (!hotelId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const payload: GetRoomByIdPayload = {
          hotelId: hotelId,
          roomId: roomId,
          dateFilter: dateFilter,
          packageType: 'B2C',
          showRoomsWithRate: true,
        };

        const response = await roomService.getRoomById(payload);
        setRoomDetails(response);
      } catch (err) {
        console.error('Error fetching room details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomDetails();
    // Use checkIn and checkOut instead of dateFilter to avoid infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, hotelIdFromQuery, selectedHotel?._id, checkIn, checkOut]);

  // Fetch room availability when dates change
  useEffect(() => {
    const fetchRoomAvailability = async () => {
      if (!roomId || !checkIn || !checkOut) {
        setRoomAvailability([]);
        return;
      }

      const hotelId = hotelIdFromQuery || selectedHotel?._id;
      if (!hotelId) {
        setRoomAvailability([]);
        return;
      }

      try {
        setIsLoadingAvailability(true);
        setAvailabilityError(null);

        // Get all months needed for the date range
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const monthsToFetch = new Set<string>();

        // Add all months between check-in and check-out
        const currentDate = new Date(checkInDate);
        while (currentDate <= checkOutDate) {
          const year = currentDate.getFullYear();
          const month = currentDate.getMonth() + 1; // getMonth() returns 0-11
          monthsToFetch.add(`${year}-${month}`);
          currentDate.setMonth(currentDate.getMonth() + 1);
        }

        // Fetch availability for each month
        const availabilityPromises = Array.from(monthsToFetch).map(async (monthKey) => {
          const [year, month] = monthKey.split('-').map(Number);
          const response = await roomService.getRoomAvailability({
            hotelId,
            roomTypeId: roomId,
            year,
            month,
          });
          return response.data?.calendar?.days || [];
        });

        const allDays = await Promise.all(availabilityPromises);
        const flattenedDays = allDays.flat();

        // Filter days within the date range
        const filteredDays = flattenedDays.filter((day) => {
          const dayDate = new Date(day.date);
          return dayDate >= checkInDate && dayDate < checkOutDate;
        });

        setRoomAvailability(filteredDays);
      } catch (err) {
        console.error('Error fetching room availability:', err);
        setAvailabilityError('Failed to load room availability');
        setRoomAvailability([]);
      } finally {
        setIsLoadingAvailability(false);
      }
    };

    fetchRoomAvailability();
  }, [roomId, hotelIdFromQuery, selectedHotel?._id, checkIn, checkOut]);

  // Calculate form progress
  useEffect(() => {
    const requiredFields = ['fullName', 'email', 'phone'];
    const filledFields = requiredFields.filter(
      (field) => guestInfo[field as keyof GuestInfo]
    ).length;
    const progress = (filledFields / requiredFields.length) * 100;
    setFormProgress(progress);
  }, [guestInfo]);

  // Calculate number of nights
  const numberOfNights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [checkIn, checkOut]);

  // Get room data
  const room = roomDetails?.data;
  
  // Helper function to parse child age threshold
  const getChildAgeThreshold = (): number => {
    if (!room?.childAge) return 12; // Default to 12 years
    
    // Try to extract number from strings like "0-12 years" or "12"
    const match = room.childAge.match(/(\d+)/);
    return match ? parseInt(match[1]) : 12;
  };
  
  // Calculate required room count based on occupancy (including additional guests)
  const calculateRequiredRoomCount = useMemo(() => {
    if (!room?.totalOccupency) return 1;
    
    // Count additional guests
    const childAgeThreshold = getChildAgeThreshold();
    let additionalAdultsCount = 0;
    let additionalChildrenCount = 0;
    
    additionalGuests.forEach((guest) => {
      if (guest.name.trim() && guest.age > 0) {
        if (guest.age >= childAgeThreshold) {
          additionalAdultsCount++;
        } else {
          additionalChildrenCount++;
        }
      }
    });
    
    const totalGuests = tempAdults + tempChildren + additionalAdultsCount + additionalChildrenCount;
    return Math.max(1, Math.ceil(totalGuests / room.totalOccupency));
  }, [tempAdults, tempChildren, room?.totalOccupency, additionalGuests]);

  // Auto-update room count when guests change or room details load (if it's below required)
  useEffect(() => {
    if (room?.totalOccupency && roomCount < calculateRequiredRoomCount) {
      setRoomCount(calculateRequiredRoomCount);
    }
  }, [calculateRequiredRoomCount, roomCount, room?.totalOccupency]);

  // Find pricing package that matches room count (or closest)
  // Use room.pricing if available, otherwise fallback to roomDetails.package
  const selectedPricing = useMemo(() => {
    let pricingArray = room?.pricing || roomDetails?.package || [];
    
    if (!pricingArray || pricingArray.length === 0) return null;
    
    // If pricing ID is provided, try to find exact match FIRST (before any filtering)
    if (pricingIdFromQuery) {
      const exactMatch = pricingArray.find((p: any) => p._id === pricingIdFromQuery);
      if (exactMatch) {
        // Verify it matches AC preference if provided
        if (acPreferenceFromQuery !== null) {
          const acPreference = acPreferenceFromQuery === 'true';
          if ((acPreference && exactMatch.ac) || (!acPreference && exactMatch.nonac)) {
            return exactMatch;
          }
        } else {
          // No AC preference filter, return the exact match
          return exactMatch;
        }
      }
    }
    
    // Filter by AC preference if provided (after checking for pricing ID)
    if (acPreferenceFromQuery !== null) {
      const acPreference = acPreferenceFromQuery === 'true';
      pricingArray = pricingArray.filter((p: any) => acPreference ? p.ac : p.nonac);
    }
    
    // Try to find exact match by room count
    let match = pricingArray.find((p: any) => p.roomCount === roomCount);
    
    // If no exact match, find the closest (prefer higher roomCount packages)
    if (!match) {
      const sorted = [...pricingArray].sort((a: any, b: any) => a.roomCount - b.roomCount);
      // Find the package with roomCount >= our roomCount, or the highest available
      match = sorted.find((p: any) => p.roomCount >= roomCount) || sorted[sorted.length - 1];
    }
    
    // If still no match, return the one with lowest basePrice
    return match || pricingArray.reduce((min: any, p: any) => p.basePrice < min.basePrice ? p : min);
  }, [room?.pricing, roomDetails?.package, roomCount, pricingIdFromQuery, acPreferenceFromQuery]);

  const roomImage = room?.roomImage
    ? (room.roomImage.startsWith('http') ? room.roomImage : `${environment.imageBaseUrl}${room.roomImage}`)
    : 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800';

  // Calculate pricing breakdown
  const pricingBreakdown = useMemo(() => {
    if (!selectedPricing || numberOfNights === 0) {
      return {
        baseRoomPrice: 0,
        nights: 0,
        rooms: 1,
        extraAdults: 0,
        extraChildren: 0,
        additionalGuestsTotal: 0,
        subtotal: 0,
        taxes: 0,
        discount: promoDiscount,
        total: 0,
        hasGST: false,
        gstPercentage: 0,
        amountToPayNow: 0,
        totalToPayNow: 0,
        remainingBalance: 0,
      };
    }

    // Use netRate if available (GST inclusive), otherwise use basePrice
    const basePrice = selectedPricing.basePrice || selectedPricing.netRate || 0;
    const nights = numberOfNights;
    const rooms = roomCount;
    const baseTotal = basePrice * nights * rooms;

    // Count additional guests as adults/children based on age
    const childAgeThreshold = getChildAgeThreshold();
    let additionalAdultsCount = 0;
    let additionalChildrenCount = 0;
    
    additionalGuests.forEach((guest) => {
      if (guest.name.trim() && guest.age > 0) {
        if (guest.age >= childAgeThreshold) {
          additionalAdultsCount++;
        } else {
          additionalChildrenCount++;
        }
      }
    });
    
    // Calculate total guests including additional guests
    const totalAdults = tempAdults + additionalAdultsCount;
    const totalChildren = tempChildren + additionalChildrenCount;
    const totalGuests = totalAdults + totalChildren;
    
    // Room occupancy logic:
    // - minAdults is the base occupancy (base rate covers up to minAdults per room)
    // - totalOccupency is the maximum capacity per room
    // - Any guests beyond minAdults (up to totalOccupency) are extra and charged
    const minAdultsPerRoom = room?.minAdults || 2;
    const totalOccupencyPerRoom = room?.totalOccupency || minAdultsPerRoom;
    
    // Calculate base occupancy covered by base rate (across all rooms)
    const baseOccupancyCovered = rooms * minAdultsPerRoom;
    
    // Calculate total guests that need to be accommodated
    // Ensure we don't exceed maximum capacity
    const maxCapacity = rooms * totalOccupencyPerRoom;
    const validTotalGuests = Math.min(totalGuests, maxCapacity);
    
    // Calculate extra guests (beyond base occupancy)
    // These are the guests that need to pay extra charges
    const extraGuestsCount = Math.max(0, validTotalGuests - baseOccupancyCovered);
    
    // Distribute extra guests between adults and children
    // Priority: adults first, then children
    const baseAdultsCovered = Math.min(totalAdults, baseOccupancyCovered);
    const remainingBaseCapacity = baseOccupancyCovered - baseAdultsCovered;
    const baseChildrenCovered = Math.min(totalChildren, remainingBaseCapacity);
    
    // Calculate how many adults and children are extra
    const extraAdultsCount = Math.max(0, totalAdults - baseAdultsCovered);
    const extraChildrenCount = Math.max(0, totalChildren - baseChildrenCovered);
    
    // Calculate extra charges using "WithExtraMatress" rates
    const extraAdultRate = selectedPricing.extraAdultRateWithExtraMatress || 0;
    const extraAdultsTotal = extraAdultsCount * extraAdultRate * nights;

    const extraChildRate = selectedPricing.paidChildRatewithExtraMatress || 0;
    const extraChildrenTotal = extraChildrenCount * extraChildRate * nights;

    const subtotal = baseTotal + extraAdultsTotal + extraChildrenTotal;
    
    // Calculate GST from hotel data, not room rate
    const hasGST = selectedHotel?.hasGST || false;
    const gstPercentage = selectedHotel?.gstPercentage || 0;
    const taxes = hasGST ? (subtotal * gstPercentage) / 100 : 0;
    
    const discount = promoDiscount;
    const total = subtotal + taxes - discount;

    // Payment split-up: 30% advance
    const advancePercentage = 0.30; // 30%
    const amountToPayNow = total * advancePercentage;
    const totalToPayNow = amountToPayNow;
    const remainingBalance = total - amountToPayNow;

    return {
      baseRoomPrice: basePrice,
      nights,
      rooms,
      extraAdults: extraAdultsTotal,
      extraChildren: extraChildrenTotal,
      extraAdultsCount,
      extraChildrenCount,
      totalAdults,
      totalChildren,
      subtotal,
      taxes,
      discount,
      total: Math.max(0, total),
      hasGST,
      gstPercentage,
      amountToPayNow,
      totalToPayNow,
      remainingBalance,
    };
  }, [selectedPricing, numberOfNights, tempAdults, tempChildren, promoDiscount, room, roomCount, selectedHotel, additionalGuests]);

  // Calculate minimum available rooms across the date range
  const minAvailableRooms = useMemo(() => {
    if (roomAvailability.length === 0) return null;
    
    // Find the minimum available rooms across all days in the range
    const minAvailable = Math.min(...roomAvailability.map(day => day.available));
    return minAvailable;
  }, [roomAvailability]);

  // Check if selected room count exceeds availability
  const isRoomCountValid = useMemo(() => {
    if (minAvailableRooms === null) return true; // If availability not loaded, allow
    return roomCount <= minAvailableRooms;
  }, [roomCount, minAvailableRooms]);

  // Phone number formatting
  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 10) {
      return cleaned;
    }
    return cleaned.slice(0, 10);
  };

  // Handle input changes
  const handleInputChange = (field: keyof GuestInfo, value: string) => {
    setGuestInfo((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    handleInputChange('phone', formatted);
  };

  // Check if form is valid (without setting errors - for disabled state)
  const isFormValid = useMemo(() => {
    return (
      guestInfo.fullName.trim() !== '' &&
      guestInfo.email.trim() !== '' &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.email) &&
      guestInfo.phone.trim() !== '' &&
      guestInfo.phone.length >= 10
    );
  }, [guestInfo]);

  // Form validation (with error setting)
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!guestInfo.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!guestInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!guestInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (guestInfo.phone.length < 10) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    // ID Type and ID Number are optional fields - no validation required

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // File upload handling
  const handleFileUpload = useCallback((files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          files: 'Please upload only JPG, PNG, or PDF files',
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          files: 'File size must be less than 5MB',
        }));
        return;
      }

      const id = Math.random().toString(36).substring(7);
      const preview = file.type.startsWith('image/')
        ? URL.createObjectURL(file)
        : '';

      setUploadedFiles((prev) => [
        ...prev,
        {
          id,
          file,
          preview,
          type: file.type.startsWith('image/') ? 'image' : 'pdf',
        },
      ]);
    });
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      handleFileUpload(e.dataTransfer.files);
    },
    [handleFileUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  // Add additional guest
  const addAdditionalGuest = () => {
    const newGuest: AdditionalGuest = {
      id: Math.random().toString(36).substring(7),
      name: '',
      age: 0,
      relationship: '',
    };
    setAdditionalGuests((prev) => [...prev, newGuest]);
  };

  const removeAdditionalGuest = (id: string) => {
    setAdditionalGuests((prev) => prev.filter((g) => g.id !== id));
  };

  const updateAdditionalGuest = (id: string, field: keyof AdditionalGuest, value: string | number) => {
    setAdditionalGuests((prev) =>
      prev.map((g) => (g.id === id ? { ...g, [field]: value } : g))
    );
  };

  // Apply promo code
  const applyPromoCode = () => {
    // Simulate promo code validation
    if (promoCode.toUpperCase() === 'WELCOME1000') {
      setPromoDiscount(1000);
      setErrors((prev) => ({ ...prev, promoCode: '' }));
    } else {
      setPromoDiscount(0);
      setErrors((prev) => ({ ...prev, promoCode: 'Invalid promo code' }));
    }
  };

  // Save dates from dialog
  const saveDates = () => {
    setCheckIn(tempCheckIn);
    setCheckOut(tempCheckOut);
    setShowDateDialog(false);
  };

  // Save guest count from dialog and auto-adjust room count
  const saveGuestCount = () => {
    // Parse and validate inputs
    const adults = Math.max(1, parseInt(tempAdultsInput) || 1);
    const children = Math.max(0, parseInt(tempChildrenInput) || 0);
    
    setTempAdults(adults);
    setTempChildren(children);
    setGuests(adults + children);
    
    // Automatically calculate and update room count based on occupancy
    if (room?.totalOccupency) {
      const totalGuests = adults + children;
      const requiredRooms = Math.max(1, Math.ceil(totalGuests / room.totalOccupency));
      setRoomCount(requiredRooms);
    }
    
    setShowGuestSheet(false);
  };

  // Handle adults input change
  const handleAdultsInputChange = (value: string) => {
    // Allow empty string or valid numbers
    if (value === '' || /^\d*$/.test(value)) {
      setTempAdultsInput(value);
      const numValue = parseInt(value) || 0;
      if (numValue >= 1) {
        setTempAdults(numValue);
      }
    }
  };

  // Handle children input change
  const handleChildrenInputChange = (value: string) => {
    // Allow empty string or valid numbers
    if (value === '' || /^\d*$/.test(value)) {
      setTempChildrenInput(value);
      const numValue = parseInt(value) || 0;
      if (numValue >= 0) {
        setTempChildren(numValue);
      }
    }
  };

  // Handle blur - validate and set defaults if empty
  const handleAdultsBlur = () => {
    if (tempAdultsInput === '' || parseInt(tempAdultsInput) < 1) {
      setTempAdultsInput('1');
      setTempAdults(1);
    }
  };

  const handleChildrenBlur = () => {
    if (tempChildrenInput === '' || parseInt(tempChildrenInput) < 0) {
      setTempChildrenInput('0');
      setTempChildren(0);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!checkIn || !checkOut || !roomId || !selectedPricing) {
      setErrors((prev) => ({ ...prev, submit: 'Please ensure all booking details are complete' }));
      return;
    }

    const hotelId = hotelIdFromQuery || selectedHotel?._id;
    if (!hotelId) {
      setErrors((prev) => ({ ...prev, submit: 'Hotel information is missing' }));
      return;
    }

    const userId = AuthService.getUserId();
    if (!userId) {
      setErrors((prev) => ({ ...prev, submit: 'Please login to continue with booking' }));
      return;
    }

    setIsSubmitting(true);

    try {
      // Count additional guests as adults/children based on age
      const childAgeThreshold = getChildAgeThreshold();
      let additionalAdultsCount = 0;
      let additionalChildrenCount = 0;
      
      additionalGuests.forEach((guest) => {
        if (guest.name.trim() && guest.age > 0) {
          if (guest.age >= childAgeThreshold) {
            additionalAdultsCount++;
          } else {
            additionalChildrenCount++;
          }
        }
      });
      
      // Calculate total guests including additional guests
      const totalAdults = tempAdults + additionalAdultsCount;
      const totalChildren = tempChildren + additionalChildrenCount;
      const totalGuests = totalAdults + totalChildren;
      
      // Room occupancy logic:
      // - minAdults is the base occupancy (base rate covers up to minAdults per room)
      // - totalOccupency is the maximum capacity per room
      // - Any guests beyond minAdults (up to totalOccupency) are extra and charged
      const minAdultsPerRoom = room?.minAdults || 2;
      const totalOccupencyPerRoom = room?.totalOccupency || minAdultsPerRoom;
      
      // Calculate base occupancy covered by base rate (across all rooms)
      const baseOccupancyCovered = roomCount * minAdultsPerRoom;
      
      // Calculate total guests that need to be accommodated
      // Ensure we don't exceed maximum capacity
      const maxCapacity = roomCount * totalOccupencyPerRoom;
      const validTotalGuests = Math.min(totalGuests, maxCapacity);
      
      // Calculate extra guests (beyond base occupancy)
      const extraGuestsCount = Math.max(0, validTotalGuests - baseOccupancyCovered);
      
      // Distribute extra guests between adults and children
      // Priority: adults first, then children
      const baseAdultsCovered = Math.min(totalAdults, baseOccupancyCovered);
      const remainingBaseCapacity = baseOccupancyCovered - baseAdultsCovered;
      const baseChildrenCovered = Math.min(totalChildren, remainingBaseCapacity);
      
      // Calculate how many adults and children are extra
      const extraAdultsCount = Math.max(0, totalAdults - baseAdultsCovered);
      const extraChildrenCount = Math.max(0, totalChildren - baseChildrenCovered);

      // Build additional guests info string for remarks
      const additionalGuestsInfo = additionalGuests
        .filter((guest) => guest.name.trim() && guest.age > 0)
        .map((guest, index) => {
          const guestType = guest.age >= childAgeThreshold ? 'Adult' : 'Child';
          return `Additional Guest ${index + 1}: ${guest.name} (${guestType}, Age: ${guest.age}${guest.relationship ? `, Relationship: ${guest.relationship}` : ''})`;
        })
        .join('; ');

      // Combine special requests with additional guests info
      const remarks = [
        guestInfo.specialRequests,
        additionalGuestsInfo,
      ]
        .filter(Boolean)
        .join(' | ');

      // Build booking request payload
      const bookingRequest: BookingRequest = {
        hotelId: hotelId,
        userId: userId,
        guestDetails: {
          guestName: guestInfo.fullName,
          email: guestInfo.email,
          phone: `${guestInfo.phoneCountryCode}${guestInfo.phone}`,
          address: selectedHotel?.address || '',
          city: selectedHotel?.townName || selectedHotel?.locationName || '',
          state: selectedHotel?.state || room?.state || '',
          country: selectedHotel?.country || room?.country || 'India',
          pincode: '',
        },
        roomRequirements: [
          {
            roomTypeId: roomId,
            numberOfRooms: roomCount,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            totalGuests: totalAdults + totalChildren,
            adultGuests: totalAdults,
            childGuests: totalChildren,
            packageSelected: selectedPricing._id || '',
            amountPerNight: pricingBreakdown.baseRoomPrice,
            totalAmount: pricingBreakdown.baseRoomPrice * numberOfNights * roomCount,
          },
        ],
        totalAmount: pricingBreakdown.total,
        advanceAmount: pricingBreakdown.totalToPayNow,
        beddingType: 'bed', // Valid values: bed, without_bed, mattress, without_mattress, cot, without_cot
        extraAdults: extraAdultsCount,
        extraChild: extraChildrenCount,
        extraAdultAmount: pricingBreakdown.extraAdults,
        extraChildAmount: pricingBreakdown.extraChildren,
        mealPlan: selectedPricing.breakfastIncluded ? 'Breakfast Included' : 'Room Only',
        remarks: remarks,
      };

      // Call booking API
      const result = await bookingsService.createBooking(bookingRequest);

      if (result.status && result.data?.paymentUrl) {
        // Redirect to payment URL
        window.location.href = result.data.paymentUrl;
      } else {
        setErrors((prev) => ({ 
          ...prev, 
          submit: result.msg || 'Failed to create booking. Please try again.' 
        }));
        setIsSubmitting(false);
      }
    } catch (error: any) {
      console.error('Error creating booking:', error);
      setErrors((prev) => ({ 
        ...prev, 
        submit: error?.response?.data?.msg || 'An error occurred. Please try again.' 
      }));
      setIsSubmitting(false);
    }
  };

  // WhatsApp message
  const handleWhatsAppHelp = () => {
    const hotelName = selectedHotel?.hotelName;
    const roomName = room?.roomsDisplayName || 'Room';
    const message = `I need help with my booking for ${roomName} at ${hotelName}.`;
    const whatsappNumber = selectedHotel?.whatsappNumber || hotelConfig.whatsappNumber;
    window.open(
      `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">Loading reservation details...</p>
        </div>
      </div>
    );
  }

  if (!roomDetails || !room) {
    return (
      <div className="min-h-screen bg-background">
        <Header hotel={selectedHotel} />
        <div className="pt-24 pb-16 text-center">
          <p className="text-muted-foreground text-lg mb-4">Room not found</p>
          <Link to="/rooms" className="text-primary hover:underline">
            Back to Rooms
          </Link>
        </div>
        <Footer hotel={selectedHotel} />
      </div>
    );
  }

  const hotel = selectedHotel || null;

  return (
    <div className="min-h-screen bg-background">
      <Header hotel={hotel} />

      {/* Breadcrumb */}
      <div className="pt-24 pb-4 bg-muted/50">
        <div className="container-hotel">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight size={16} className="text-muted-foreground" />
            <Link
              to={hotelIdFromQuery ? `/rooms?hotelId=${hotelIdFromQuery}` : '/rooms'}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Rooms
            </Link>
            <ChevronRight size={16} className="text-muted-foreground" />
            <Link
              to={`/rooms/${roomId}${hotelIdFromQuery ? `?hotelId=${hotelIdFromQuery}` : ''}`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {room.roomsDisplayName}
            </Link>
            <ChevronRight size={16} className="text-muted-foreground" />
            <span className="text-foreground font-medium">Review & Book</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-8">
        <div className="container-hotel">
          <div className="mb-8">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Reservation Details & Pricing Review
            </h1>
            <p className="text-muted-foreground">
              Please review your booking details and complete your reservation
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Guest Information Form */}
            <div className="lg:col-span-2 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Form Progress Indicator */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">Form Completion</span>
                      <span className="text-sm text-muted-foreground">{Math.round(formProgress)}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300 rounded-full"
                        style={{ width: `${formProgress}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Primary Guest Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User size={20} />
                      Primary Guest Information
                    </CardTitle>
                    <CardDescription>
                      Please provide accurate details for the primary guest
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Booking For Selection */}
                    <div className="pb-4 border-b">
                      <Label className="text-base font-medium mb-3 block">
                        Who is this booking for?
                      </Label>
                      <RadioGroup
                        value={bookingFor}
                        onValueChange={(value) => setBookingFor(value as 'myself' | 'someone-else')}
                        className="flex gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="myself" id="myself" />
                          <Label htmlFor="myself" className="font-normal cursor-pointer">
                            Myself
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="someone-else" id="someone-else" />
                          <Label htmlFor="someone-else" className="font-normal cursor-pointer">
                            Someone Else
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <Label htmlFor="fullName">
                          Full Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="fullName"
                          value={guestInfo.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          placeholder="Enter your full name"
                          className={cn(errors.fullName && 'border-destructive')}
                        />
                        {errors.fullName && (
                          <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                            <AlertCircle size={14} />
                            {errors.fullName}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="email">
                          Email Address <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            value={guestInfo.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="your.email@example.com"
                            className={cn('pl-10', errors.email && 'border-destructive')}
                          />
                        </div>
                        {errors.email && (
                          <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                            <AlertCircle size={14} />
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="phone">
                          Phone Number <span className="text-destructive">*</span>
                        </Label>
                        <div className="flex gap-2">
                          <Select
                            value={guestInfo.phoneCountryCode}
                            onValueChange={(value) =>
                              handleInputChange('phoneCountryCode', value)
                            }
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="+91">+91 (IN)</SelectItem>
                              <SelectItem value="+1">+1 (US)</SelectItem>
                              <SelectItem value="+44">+44 (UK)</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="relative flex-1">
                            <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              id="phone"
                              type="tel"
                              value={guestInfo.phone}
                              onChange={(e) => handlePhoneChange(e.target.value)}
                              placeholder="9876543210"
                              maxLength={10}
                              className={cn('pl-10', errors.phone && 'border-destructive')}
                            />
                          </div>
                        </div>
                        {errors.phone && (
                          <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                            <AlertCircle size={14} />
                            {errors.phone}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="idType">
                          ID Type <span className="text-muted-foreground text-xs">(Optional)</span>
                        </Label>
                        <Select
                          value={guestInfo.idType}
                          onValueChange={(value) => handleInputChange('idType', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select ID type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="passport">Passport</SelectItem>
                            <SelectItem value="aadhaar">Aadhaar</SelectItem>
                            <SelectItem value="driving-license">Driving License</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="idNumber">
                          ID Number <span className="text-muted-foreground text-xs">(Optional)</span>
                        </Label>
                        <Input
                          id="idNumber"
                          value={guestInfo.idNumber}
                          onChange={(e) => handleInputChange('idNumber', e.target.value)}
                          placeholder="Enter ID number"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Document Upload */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText size={20} />
                      Identity Document Upload
                    </CardTitle>
                    <CardDescription>
                      Upload a clear copy of your ID document (Max 5MB, PDF, JPG, or PNG)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      className={cn(
                        'border-2 border-dashed rounded-xl p-8 text-center transition-colors',
                        'hover:border-primary/50 cursor-pointer bg-muted/30'
                      )}
                    >
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept="image/jpeg,image/jpg,image/png,application/pdf"
                        multiple
                        onChange={(e) => handleFileUpload(e.target.files)}
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload size={32} className="mx-auto mb-4 text-muted-foreground" />
                        <p className="text-sm font-medium text-foreground mb-1">
                          Drag & drop files here, or click to browse
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Accepted formats: PDF, JPG, PNG (Max 5MB per file)
                        </p>
                      </label>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {uploadedFiles.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border"
                          >
                            {file.type === 'image' ? (
                              <div className="w-12 h-12 rounded overflow-hidden shrink-0">
                                <img
                                  src={file.preview}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center shrink-0">
                                <FileText size={20} className="text-primary" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {file.file.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {(file.file.size / 1024).toFixed(2)} KB
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFile(file.id)}
                              className="shrink-0"
                            >
                              <X size={16} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
                      <Lock size={14} className="mt-0.5 shrink-0" />
                      <span>
                        Your documents are securely encrypted and will only be used for verification purposes.
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Additional Guests */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Users size={20} />
                          Additional Guests
                        </CardTitle>
                        <CardDescription>
                          Add details for other guests staying in the room
                        </CardDescription>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addAdditionalGuest}
                      >
                        <Plus size={16} />
                        Add Guest
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {additionalGuests.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No additional guests added
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {additionalGuests.map((guest) => (
                          <div
                            key={guest.id}
                            className="p-4 rounded-lg border bg-muted/30 space-y-3"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-foreground">
                                Guest {additionalGuests.indexOf(guest) + 1}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeAdditionalGuest(guest.id)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                            <div className="grid sm:grid-cols-3 gap-3">
                              <div>
                                <Label>Name</Label>
                                <Input
                                  value={guest.name}
                                  onChange={(e) =>
                                    updateAdditionalGuest(guest.id, 'name', e.target.value)
                                  }
                                  placeholder="Guest name"
                                />
                              </div>
                              <div>
                                <Label>Age</Label>
                                <Input
                                  type="number"
                                  value={guest.age || ''}
                                  onChange={(e) =>
                                    updateAdditionalGuest(
                                      guest.id,
                                      'age',
                                      parseInt(e.target.value) || 0
                                    )
                                  }
                                  placeholder="Age"
                                  min={0}
                                  max={120}
                                />
                              </div>
                              <div>
                                <Label>Relationship (Optional)</Label>
                                <Input
                                  value={guest.relationship}
                                  onChange={(e) =>
                                    updateAdditionalGuest(guest.id, 'relationship', e.target.value)
                                  }
                                  placeholder="e.g., Spouse, Child"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Special Requests */}
                <Card>
                  <CardHeader>
                    <CardTitle>Special Requests</CardTitle>
                    <CardDescription>
                      Any special requirements or preferences for your stay?
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={guestInfo.specialRequests}
                      onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                      placeholder="e.g., Late check-in, dietary requirements, room preferences..."
                      rows={4}
                      className="resize-none"
                    />
                  </CardContent>
                </Card>

                {/* Trust Elements */}
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Shield size={18} className="text-primary" />
                        <span className="text-foreground font-medium">Secure Payment</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Lock size={18} className="text-primary" />
                        <span className="text-foreground font-medium">Privacy Protected</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check size={18} className="text-primary" />
                        <span className="text-foreground font-medium">Best Rate Guaranteed</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </form>
            </div>

            {/* Right Column - Booking Summary & Pricing */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-6">
                {/* Booking Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar size={20} />
                      Booking Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Hotel & Room Info */}
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                        <img
                          src={roomImage}
                          alt={room.roomsDisplayName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground mb-1 truncate">
                          {hotel?.hotelName}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-1 truncate">
                          {hotel?.locationName || hotel?.townName || hotelConfig.location}
                        </p>
                        <p className="text-sm font-medium text-foreground truncate">
                          {room.roomsDisplayName}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                      {/* Dates - Editable */}
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground mb-1">Check-in</p>
                          <p className="text-sm font-medium text-foreground">
                            {checkIn
                              ? new Date(checkIn).toLocaleDateString('en-IN', {
                                  weekday: 'short',
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })
                              : 'Select date'}
                          </p>
                        </div>
                        <Dialog open={showDateDialog} onOpenChange={setShowDateDialog}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="shrink-0">
                              <Edit2 size={16} />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Modify Dates</DialogTitle>
                              <DialogDescription>
                                Update your check-in and check-out dates
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                              <div>
                                <Label>Check-in Date</Label>
                                <Input
                                  type="date"
                                  value={tempCheckIn}
                                  onChange={(e) => setTempCheckIn(e.target.value)}
                                  min={new Date().toISOString().split('T')[0]}
                                />
                              </div>
                              <div>
                                <Label>Check-out Date</Label>
                                <Input
                                  type="date"
                                  value={tempCheckOut}
                                  onChange={(e) => setTempCheckOut(e.target.value)}
                                  min={tempCheckIn || new Date().toISOString().split('T')[0]}
                                />
                              </div>
                              <div className="flex gap-2 pt-2">
                                <Button 
                                  variant="outline" 
                                  onClick={() => setShowDateDialog(false)} 
                                  className="flex-1"
                                >
                                  Cancel
                                </Button>
                                <Button onClick={saveDates} className="flex-1">
                                  Save Changes
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground mb-1">Check-out</p>
                          <p className="text-sm font-medium text-foreground">
                            {checkOut
                              ? new Date(checkOut).toLocaleDateString('en-IN', {
                                  weekday: 'short',
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })
                              : 'Select date'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground mb-1">Duration</p>
                          <p className="text-sm font-medium text-foreground">
                            {numberOfNights} {numberOfNights === 1 ? 'night' : 'nights'}
                          </p>
                        </div>
                      </div>

                      {/* Guests - Editable */}
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground mb-1">Guests</p>
                          <p className="text-sm font-medium text-foreground">
                            {pricingBreakdown.totalAdults || tempAdults} {(pricingBreakdown.totalAdults || tempAdults) === 1 ? 'Adult' : 'Adults'}
                            {(pricingBreakdown.totalChildren || tempChildren) > 0 && `, ${pricingBreakdown.totalChildren || tempChildren} ${(pricingBreakdown.totalChildren || tempChildren) === 1 ? 'Child' : 'Children'}`}
                            {additionalGuests.filter(g => g.name.trim() && g.age > 0).length > 0 && (
                              <span className="text-xs text-muted-foreground ml-1">
                                ({additionalGuests.filter(g => g.name.trim() && g.age > 0).length} additional)
                              </span>
                            )}
                          </p>
                        </div>
                        <Dialog open={showGuestSheet} onOpenChange={setShowGuestSheet}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="shrink-0">
                              <Edit2 size={16} />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Modify Guest Count</DialogTitle>
                              <DialogDescription>
                                Update the number of adults and children. Room count will be automatically adjusted based on occupancy.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                              <div>
                                <Label>Adults</Label>
                                <Input
                                  type="text"
                                  inputMode="numeric"
                                  value={tempAdultsInput}
                                  onChange={(e) => handleAdultsInputChange(e.target.value)}
                                  onBlur={handleAdultsBlur}
                                  placeholder="Enter number of adults"
                                  onFocus={(e) => e.target.select()}
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                  Add as many adults as needed. Room count will adjust automatically.
                                </p>
                              </div>
                              <div>
                                <Label>Children</Label>
                                <Input
                                  type="text"
                                  inputMode="numeric"
                                  value={tempChildrenInput}
                                  onChange={(e) => handleChildrenInputChange(e.target.value)}
                                  onBlur={handleChildrenBlur}
                                  placeholder="Enter number of children"
                                  onFocus={(e) => e.target.select()}
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                  Add as many children as needed. Room count will adjust automatically.
                                </p>
                              </div>
                              {room?.totalOccupency && (() => {
                                // Calculate extra persons for display in dialog using current input values
                                const currentAdults = parseInt(tempAdultsInput) || 1;
                                const currentChildren = parseInt(tempChildrenInput) || 0;
                                const minAdultsPerRoom = room?.minAdults || 2;
                                const totalOccupencyPerRoom = room?.totalOccupency || minAdultsPerRoom;
                                const currentRoomCount = Math.max(1, Math.ceil((currentAdults + currentChildren) / totalOccupencyPerRoom));
                                const baseOccupancyCovered = currentRoomCount * minAdultsPerRoom;
                                const totalGuests = currentAdults + currentChildren;
                                const validTotalGuests = Math.min(totalGuests, currentRoomCount * totalOccupencyPerRoom);
                                const extraGuestsCount = Math.max(0, validTotalGuests - baseOccupancyCovered);
                                
                                // Distribute extra guests
                                const baseAdultsCovered = Math.min(currentAdults, baseOccupancyCovered);
                                const remainingBaseCapacity = baseOccupancyCovered - baseAdultsCovered;
                                const baseChildrenCovered = Math.min(currentChildren, remainingBaseCapacity);
                                const extraAdultsCount = Math.max(0, currentAdults - baseAdultsCovered);
                                const extraChildrenCount = Math.max(0, currentChildren - baseChildrenCovered);
                                
                                return (
                                  <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                                    <div>
                                      <p className="text-xs text-muted-foreground mb-1">
                                        Current selection: {currentAdults + currentChildren} {currentAdults + currentChildren === 1 ? 'guest' : 'guests'} ({currentAdults} {currentAdults === 1 ? 'adult' : 'adults'}{currentChildren > 0 && `, ${currentChildren} ${currentChildren === 1 ? 'child' : 'children'}`})
                                      </p>
                                      <p className="text-xs font-medium text-foreground">
                                        Required rooms: {currentRoomCount} {currentRoomCount === 1 ? 'room' : 'rooms'} (Max occupancy: {totalOccupencyPerRoom} per room)
                                      </p>
                                    </div>
                                    {extraGuestsCount > 0 && (
                                      <div className="pt-2 border-t border-border/50">
                                        <p className="text-xs font-medium text-foreground mb-1">
                                          Extra Persons (beyond base occupancy of {minAdultsPerRoom} per room):
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          {extraAdultsCount > 0 && `${extraAdultsCount} ${extraAdultsCount === 1 ? 'adult' : 'adults'}`}
                                          {extraAdultsCount > 0 && extraChildrenCount > 0 && ' + '}
                                          {extraChildrenCount > 0 && `${extraChildrenCount} ${extraChildrenCount === 1 ? 'child' : 'children'}`}
                                          {' '}(Total: {extraGuestsCount} {extraGuestsCount === 1 ? 'extra person' : 'extra persons'})
                                        </p>
                                        <p className="text-xs text-primary mt-1 font-medium">
                                          Extra persons will be charged additional rates
                                        </p>
                                      </div>
                                    )}
                                    {extraGuestsCount === 0 && (
                                      <div className="pt-2 border-t border-border/50">
                                        <p className="text-xs text-muted-foreground">
                                          Base occupancy: {minAdultsPerRoom} {minAdultsPerRoom === 1 ? 'person' : 'persons'} per room (included in base rate)
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}
                              <div className="flex gap-2 pt-2">
                                <Button 
                                  variant="outline" 
                                  onClick={() => setShowGuestSheet(false)} 
                                  className="flex-1"
                                >
                                  Cancel
                                </Button>
                                <Button onClick={saveGuestCount} className="flex-1">
                                  Save Changes
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>

                      {/* Rooms - Editable with +/- buttons */}
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground mb-1">Rooms</p>
                          <p className="text-sm font-medium text-foreground">
                            {roomCount} {roomCount === 1 ? 'Room' : 'Rooms'}
                            {roomCount < calculateRequiredRoomCount && (
                              <span className="text-xs text-destructive ml-2">
                                (Min {calculateRequiredRoomCount} required)
                              </span>
                            )}
                            {!isRoomCountValid && minAvailableRooms !== null && (
                              <span className="text-xs text-destructive ml-2 block mt-1">
                                Only {minAvailableRooms} {minAvailableRooms === 1 ? 'room' : 'rooms'} available
                              </span>
                            )}
                          </p>
                          {isLoadingAvailability && (
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <Loader2 size={12} className="animate-spin" />
                              Checking availability...
                            </p>
                          )}
                          {!isLoadingAvailability && minAvailableRooms !== null && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {minAvailableRooms} {minAvailableRooms === 1 ? 'room' : 'rooms'} available for selected dates
                            </p>
                          )}
                          {availabilityError && (
                            <p className="text-xs text-destructive mt-1">{availabilityError}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setRoomCount(Math.max(1, roomCount - 1))}
                            disabled={roomCount <= 1 || roomCount <= calculateRequiredRoomCount}
                          >
                            <Minus size={14} />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">{roomCount}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setRoomCount(roomCount + 1)}
                            disabled={
                              (room?.totalRooms ? roomCount >= room.totalRooms : false) ||
                              (minAvailableRooms !== null ? roomCount >= minAvailableRooms : false)
                            }
                          >
                            <Plus size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Meal Plan */}
                    {selectedPricing?.breakfastIncluded && (
                      <div className="pt-3 border-t">
                        <div className="flex items-center gap-2 text-sm">
                          <Check size={16} className="text-hotel-secondary shrink-0" />
                          <span className="text-foreground">Breakfast Included</span>
                        </div>
                      </div>
                    )}

                    {/* Cancellation Policy Link */}
                    {/* <div className="pt-3 border-t">
                      <Button variant="link" className="p-0 h-auto text-xs" asChild>
                        <Link to="/contact">View Cancellation Policy</Link>
                      </Button>
                    </div> */}
                  </CardContent>
                </Card>

                {/* Pricing Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard size={20} />
                      Pricing Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                        {/* Promo Code */}
                        {/* <div className="space-y-2">
                          <Label>Promo Code</Label>
                          <div className="flex gap-2">
                            <Input
                              value={promoCode}
                              onChange={(e) => setPromoCode(e.target.value)}
                              placeholder="Enter code"
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={applyPromoCode}
                              disabled={!promoCode}
                            >
                              Apply
                            </Button>
                          </div>
                          {promoDiscount > 0 && (
                            <p className="text-sm text-hotel-secondary flex items-center gap-1">
                              <Check size={14} />
                              Discount of {hotelConfig.currencySymbol}{promoDiscount.toLocaleString()} applied!
                            </p>
                          )}
                          {errors.promoCode && (
                            <p className="text-sm text-destructive">{errors.promoCode}</p>
                          )}
                        </div> */}

                        {/* Price Breakdown Accordion */}
                        <Accordion type="single" collapsible className="w-full" defaultValue="breakdown">
                          <AccordionItem value="breakdown">
                            <AccordionTrigger className="text-sm">
                              View Price Breakdown
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-2 pt-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">
                                    Base Rate × {pricingBreakdown.rooms} {pricingBreakdown.rooms === 1 ? 'room' : 'rooms'} × {pricingBreakdown.nights} nights
                                  </span>
                                  <span className="text-foreground">
                                    {hotelConfig.currencySymbol}
                                    {(pricingBreakdown.baseRoomPrice * pricingBreakdown.nights * pricingBreakdown.rooms).toLocaleString()}
                                  </span>
                                </div>
                                {(pricingBreakdown.extraAdults > 0 || pricingBreakdown.extraChildren > 0) && (
                                  <div className="pt-2 border-t border-border/50">
                                    <p className="text-xs font-medium text-foreground mb-2">
                                      Extra Persons (beyond base occupancy)
                                    </p>
                                    {pricingBreakdown.extraAdults > 0 && (
                                      <div className="flex justify-between text-sm mb-1">
                                        <span className="text-muted-foreground">
                                          Extra Adults ({pricingBreakdown.extraAdultsCount} × {selectedPricing?.extraAdultRateWithExtraMatress || 0} × {pricingBreakdown.nights} {pricingBreakdown.nights === 1 ? 'night' : 'nights'})
                                        </span>
                                        <span className="text-foreground">
                                          {hotelConfig.currencySymbol}
                                          {pricingBreakdown.extraAdults.toLocaleString()}
                                        </span>
                                      </div>
                                    )}
                                    {pricingBreakdown.extraChildren > 0 && (
                                      <div className="flex justify-between text-sm mb-1">
                                        <span className="text-muted-foreground">
                                          Extra Children ({pricingBreakdown.extraChildrenCount} × {selectedPricing?.paidChildRatewithExtraMatress || 0} × {pricingBreakdown.nights} {pricingBreakdown.nights === 1 ? 'night' : 'nights'})
                                        </span>
                                        <span className="text-foreground">
                                          {hotelConfig.currencySymbol}
                                          {pricingBreakdown.extraChildren.toLocaleString()}
                                        </span>
                                      </div>
                                    )}
                                    <p className="text-xs text-muted-foreground mt-2">
                                      Base occupancy: {room?.minAdults || 2} {room?.minAdults === 1 ? 'person' : 'persons'} per room (included in base rate)
                                    </p>
                                  </div>
                                )}
                                <div className="flex justify-between text-sm pt-2 border-t">
                                  <span className="text-foreground font-medium">Subtotal</span>
                                  <span className="text-foreground font-medium">
                                    {hotelConfig.currencySymbol}
                                    {pricingBreakdown.subtotal.toLocaleString()}
                                  </span>
                                </div>
                                {pricingBreakdown.hasGST && pricingBreakdown.taxes > 0 && (
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground flex items-center gap-1">
                                      Taxes (GST {pricingBreakdown.gstPercentage}%)
                                      <Info size={12} className="cursor-help" />
                                    </span>
                                    <span className="text-foreground">
                                      {hotelConfig.currencySymbol}
                                      {pricingBreakdown.taxes.toLocaleString()}
                                    </span>
                                  </div>
                                )}
                                {pricingBreakdown.discount > 0 && (
                                  <div className="flex justify-between text-sm text-hotel-secondary">
                                    <span>Discount</span>
                                    <span>
                                      -{hotelConfig.currencySymbol}
                                      {pricingBreakdown.discount.toLocaleString()}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>

                        {/* Payment Split-up */}
                        <div className="pt-4 border-t space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold text-foreground">Total Amount</span>
                            <span className="text-lg font-semibold text-foreground">
                              {hotelConfig.currencySymbol}
                              {pricingBreakdown.total.toLocaleString()}
                            </span>
                          </div>
                          
                          <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                            <p className="text-xs font-medium text-foreground mb-2">Payment Split-up</p>
                            
                            <div className="flex justify-between text-sm pt-2 border-t">
                              <span className="font-medium text-foreground">Amount to Pay Now (30%)</span>
                              <span className="font-medium text-primary">
                                {hotelConfig.currencySymbol}
                                {pricingBreakdown.totalToPayNow.toLocaleString()}
                              </span>
                            </div>
                            
                            <div className="flex justify-between text-sm pt-1">
                              <span className="text-muted-foreground">Remaining Balance (70%)</span>
                              <span className="text-muted-foreground">
                                {hotelConfig.currencySymbol}
                                {pricingBreakdown.remainingBalance.toLocaleString()}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                              Remaining balance to be paid at the hotel
                            </p>
                          </div>
                          
                          {pricingBreakdown.discount > 0 && (
                            <p className="text-xs text-hotel-secondary">
                              You saved {hotelConfig.currencySymbol}
                              {pricingBreakdown.discount.toLocaleString()}!
                            </p>
                          )}
                        </div>
                      </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {errors.submit && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                      <p className="text-sm text-destructive flex items-center gap-2">
                        <AlertCircle size={16} />
                        {errors.submit}
                      </p>
                    </div>
                  )}
                  {!isRoomCountValid && minAvailableRooms !== null && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                      <p className="text-sm text-destructive flex items-center gap-2">
                        <AlertCircle size={16} />
                        Only {minAvailableRooms} {minAvailableRooms === 1 ? 'room' : 'rooms'} {minAvailableRooms === 1 ? 'is' : 'are'} available for the selected dates. Please reduce the number of rooms.
                      </p>
                    </div>
                  )}
                  <Button
                    variant="booking"
                    size="xl"
                    className="w-full"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !isFormValid || !isRoomCountValid}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard size={20} />
                        Proceed to Payment
                      </>
                    )}
                  </Button>

                  <Button
                    variant="whatsapp"
                    size="lg"
                    className="w-full"
                    onClick={handleWhatsAppHelp}
                    type="button"
                  >
                    <MessageCircle size={18} />
                    Need Help? WhatsApp Us
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="lg"
                      className="flex-1"
                      onClick={() => navigate(-1)}
                      type="button"
                    >
                      Back
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      className="flex-1"
                      type="button"
                    >
                      Save Draft
                    </Button>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="text-center space-y-2 pt-4 border-t">
                  <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Shield size={14} />
                      <span>Secure</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Lock size={14} />
                      <span>Encrypted</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Check size={14} />
                      <span>Guaranteed</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Free cancellation up to 48 hours before check-in
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t shadow-elevated p-4 z-50">
        <div className="container-hotel">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div>
                <p className="text-xs text-muted-foreground">Total Amount</p>
                <p className="text-lg font-semibold text-foreground">
                  {hotelConfig.currencySymbol}
                  {pricingBreakdown.total.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Pay Now</p>
                <p className="text-xl font-bold text-primary">
                  {hotelConfig.currencySymbol}
                  {pricingBreakdown.totalToPayNow.toLocaleString()}
                </p>
              </div>
            </div>
            <Button
              variant="booking"
              size="lg"
              onClick={handleSubmit}
              disabled={isSubmitting || !isFormValid || !isRoomCountValid}
              className="flex-1 max-w-[200px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Proceed to Payment'
              )}
            </Button>
          </div>
          <p className="text-xs text-center text-muted-foreground">
            Free cancellation up to 48 hours before check-in
          </p>
        </div>
      </div>

      <Footer hotel={hotel} />
      <WhatsAppButton />
    </div>
  );
}
