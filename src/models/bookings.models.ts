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
  
  export interface AllocatedRoom {
    roomId: string
    roomNumber: string
    roomType: string
  }
  
  export interface PaymentTransaction {
    transactionId: string
    internalTransactionId: string
    paymentType: string
    amount: number
    paymentStatus: string
    paymentMethod: string
    paymentGateway: string
  }
  