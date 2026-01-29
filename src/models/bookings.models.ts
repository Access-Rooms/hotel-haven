import { Hotel } from "./home.models"

export class BookingRequest {
    hotelId: string
    userId: string
    guestDetails: GuestDetails
    roomRequirements: RoomRequirement[]
    totalAmount: number
    advanceAmount: number
    beddingType: string
    extraAdults: number
    extraChild: number
    extraAdultAmount: number
    extraChildAmount: number
    mealPlan: string
    remarks: string
}

export class GuestDetails {
    guestName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    country: string
    pincode: string
}

export class RoomRequirement {
    roomTypeId: string
    numberOfRooms: number
    checkInDate: string
    checkOutDate: string
    totalGuests: number
    adultGuests: number
    childGuests: number
    packageSelected: string
    amountPerNight: number
    totalAmount: number
}


export class BookingResponse {
    bookingId: string
    reservationNumber: number
    paymentUrl: string
    advanceAmount: number
    balanceAmount: number
    totalAmount: number
    allocatedRooms: AllocatedRoom[]
    paymentTransaction: PaymentTransaction
}

export class AllocatedRoom {
    roomId: string
    roomNumber: string
    roomType: string
}




export class GetBookingsListPayload {
    userId: string
    bookingFor?: ["UPCOMING" | "COMPLETED" | "CURRENT"]
    dateFilter: DateFilter
    hotelId: string
  }
  
  export class DateFilter {
    from: number //milliseconds
    to: number //milliseconds
  }
  

  export class Booking {
    _id: string
    hotelId: Hotel
    userId: string
    reservationNumber: number
    reservationCheckInDate: string
    reservationCheckOutDate: string
    checkInDate: string
    checkOutDate: string
    guestDetails: GuestDetails
    bookedRooms: BookedRoom[]
    totalAmount: number
    paidAmount: number
    dueAmount: number
    paymentStatus: 'PENDING' | 'FULLY_SETTLED' | 'PARTIALLY_SETTLED' | 'REFUNDED' | 'PARTIAL_REFUND'
    reservationStatus: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'CHECKED_IN' | 'CHECKED_OUT'
    bookingStatus: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'CHECKED_IN' | 'CHECKED_OUT'
    bookingMode: string
    bookingModeDetails: BookingModeDetails
    numberOfNights: number
    paymentTransactions: PaymentTransaction[]
  }
  


  

  export class RoomTypeId {}
  

  

  

  export class Reservation {
    guestDetails: GuestDetails
    taxAndGstSplitUp: TaxAndGstSplitUp
    _id: string
    hotelId: string
    userId: UserId
    bookedRooms: BookedRoom[]
    isGstIncluded: boolean
    gstPercentage: number
    bookingMode: string
    bookingModeDetails: BookingModeDetails
    bookingModeRef: string
    bookedDates: string[]
    totalRooms: number
    billingMode: string
    bookedDate: string
    reservationCheckInDate: string
    reservationCheckOutDate: string
    totalPersons: number
    paymentMode: string
    totalAmount: number
    paidAmount: number
    dueAmount: number
    paymentStatus: string
    numberOfNights: number
    reservationStatus: string
    bookingStatus: string
    reservationNumber: number
    status: string
    receiptDate: string
    advancePayment: number
    advancePayedBy: string
    advancePaymentDate: string
    advancePaymentMode: string
    balancePayment: number
    settleMentStatus: string
    payableTotal: number
    remarks: string
    complementary: boolean
    complementaryAmount: number
    source: string
    created_at: string
    updated_at: string
    __v: number
    paymentId: string
    paymentTransactions: PaymentTransaction[]
    id: string
  }
  

  
  export class TaxAndGstSplitUp {
    taxAmount: number
    gstAmount: number
    sgst: number
    cgst: number
    igst: number
    totalAmount: number
  }
  
  export class UserId {
    permissions: Permissions
    _id: string
    name: string
    role: string
    phoneNumber: string
    whatsappCountryCode: string
    email: string
    password: string
    is_phone_verified: boolean
    isPassword: boolean
    vendorCategory: any[]
    recentSearch: any[]
    level: number
    verificationStatus: string
    isActive: boolean
    status: string
    dateOfJoining: string
    created_at: string
    updated_at: string
    __v: number
  }
  
  export class Permissions {
    dashboard: Dashboard
    hotelPermission: HotelPermission
    roomsPermission: RoomsPermission
    reservationPermission: ReservationPermission
    settingsPermission: SettingsPermission
    grcPermission: GrcPermission
    restaurentPermission: RestaurentPermission
    storePermission: StorePermission
    accountsPermission: AccountsPermission
  }
  
  export class Dashboard {
    enabled: boolean
    viewFinancialData: boolean
  }
  
  export class HotelPermission {
    enabled: boolean
    createHotel: boolean
    manageHotel: boolean
  }
  
  export class RoomsPermission {
    enabled: boolean
    createRooms: boolean
    manageRooms: boolean
    viewRooms: boolean
    manageRates: boolean
  }
  
  export class ReservationPermission {
    enabled: boolean
    createReservation: boolean
    managePermission: boolean
    viewReservation: boolean
  }
  
  export class SettingsPermission {
    enabled: boolean
    userManagement: boolean
    permissionManagement: boolean
  }
  
  export class GrcPermission {
    enabled: boolean
  }
  
  export class RestaurentPermission {
    enabled: boolean
  }
  
  export class StorePermission {
    enabled: boolean
    manageStore: boolean
  }
  
  export class AccountsPermission {
    enabled: boolean
    manageAccounts: boolean
  }
  
  export class BookedRoom {
    roomInfo: RoomInfo
    rooms: Room[]
    roomTypeId: any
    roomTypeName: string
    _id: string
  }
  
  export class RoomInfo {
    totalGuest: number
    adultGuest: number
    childGuest: number
    totalAmount: number
    guestSum: number
    amountPerNight: number
    grandTotal: number
    mealPlan: string
    beddingType: string
    nights: number
    totalGuestPerRoom: number
    extraAdultWithBed: number
    extraAdultRateWithBed: number
    extraAdultWithoutBed: number
    extraAdultRateWithoutBed: number
    extraChildWithBed: number
    extraChildRateWithBed: number
    extraChildWithoutBed: number
    extraChildRateWithoutBed: number
    extraBedTotalAmount: number
    extraAdultWithMatress: number
    extraAdultRateWithMatress: number
    extraAdultWithoutMatress: number
    extraAdultRateWithoutMatress: number
    extraChildWithMatress: number
    extraChildRateWithMatress: number
    extraChildWithoutMatress: number
    extraChildRateWithoutMatress: number
    extraAdultWithCot: number
    extraAdultRateWithCot: number
    extraAdultWithoutCot: number
    extraAdultRateWithoutCot: number
    extraChildWithCot: number
    extraChildRateWithCot: number
    extraChildWithoutCot: number
    extraChildRateWithoutCot: number
    totalMatressCount: number
    totalMatressAmount: number
    totalWithoutMatressCount: number
    totalWithoutMatressAmount: number
    totalCotCount: number
    totalCotAmount: number
    totalWithoutCotCount: number
    totalWithoutCotAmount: number
    totalBedCount: number
    totalBedAmount: number
    totalWithoutBedCount: number
    totalWithoutBedAmount: number
    totalExtraAmount: number
  }
  
  export class Room {
    roomId: RoomId
    bookedFrom: string
    bookedTo: string
    _id: string
  }
  
  export class RoomId {
    _id: string
    roomId: string
    hotelId: string
    roomCategory: string
    roomNumber: string
    floorNumber: string
    numberOfBeds: number
    status: string
    created_at: string
    updated_at: string
    __v: number
  }
  
  export class BookingModeDetails {
    _id: string
    platformName: string
    email: string
    phoneNumber: string
    status: string
    address: string
    state: string
    country: string
    hasGst: boolean
    hotelId: string
    createdAt: string
    updatedAt: string
    __v: number
  }
  
  export class PaymentTransaction {
    gatewayResponse: GatewayResponse
    settlementDetails: SettlementDetails
    metadata: Metadata
    _id: string
    roomBookingId: string
    hotelId: string
    userId: string
    paymentDoneBy: any
    transactionId: string
    internalTransactionId: string
    paymentType: string
    paymentMethod: string
    paymentGateway: string
    amount: number
    currency: string
    paymentStatus: string
    description: string
    isVerified: boolean
    status: string
    createdBy: string
    notes: string
    proof: any[]
    initiatedAt: string
    created_at: string
    updated_at: string
    __v: number
  }
  
  export class GatewayResponse {
    gatewayTransactionId: string
    gatewayOrderId: string
    gatewayStatus: string
    gatewayMessage: string
  }
  
  export class SettlementDetails {
    isSettled: boolean
  }
  
  export class Metadata {
    ipAddress: string
    userAgent: string
    deviceInfo: string
    location: string
  }