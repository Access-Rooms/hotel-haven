import { DateFilter } from "./common.models"

export class GetHotelsListPayload {
    userId: string
    dateFilter?: DateFilter
    packageType?: string
    showRoomsWithRate?: boolean
}


export class Hotel {
    _id: string
    vendorid: string
    userid: string
    hotelName: string
    email: string
    hotelCategory: string
    numberOfRestaurants: number
    hotelType: HotelType
    profileCompletionLevel: number
    roomsCategory: any[]
    is24HrsCheckin: boolean
    checkInTime: string
    checkOutTime: string
    totalRooms: number
    totalFloors: number
    expiryType: string
    expiryDate: string
    licenseProof: string
    leaseProof: string
    interiorImage: any[]
    additionalImages: string[]
    hasPackage: boolean
    hotelStatus: string
    commissionPercentage: number
    policies: string[]
    contactDetails: ContactDetails
    whatsappNumber: string
    status: string
    rating: number
    ratingcount: number
    hasGST: boolean
    gstPercentage: number
    country: string
    state: string
    trialPeriod: number
    trialStatus: string
    usageStatus: string
    created_at: string
    updated_at: string
    __v: number
    address: string
    distanceFromMainTown: string
    googleLocation: string
    locationName: string
    townName: string
    builtYear: string
    currency: string
    hotelChainName: string
    timeZone: string
    vccCurrency: string
    accountNumber: string
    bankName: string
    bookingPolicy: string
    branchName: string
    cancellationPolicy: string
    ifscCode: string
    upiId: string
    gstNumber: string
    adminApprovedHotelCategory: string
    coverImages: string
    propertyLogo: string
    paymentQrCode: string
    roomRates: RoomRate[]
    facilities: Facilities
    websiteData: WebsiteData
  }

  export interface WebsiteData {
    websiteUrl: string
    coverImage: string
    logo: string
    title: string
    description: string
    features?: string[]
    services?: string[]
    highlightText?: string
    shortDescription?: string
  }
  
  export class HotelType {
    _id: string
    status: string
    hotel_type_name: string
    created_at: string
    updated_at: string
    __v: number
    cgst: number
    gst_percentage: number
    igst: number
    sgst: number
  }

  export interface ContactDetails {
    phoneNumber: any[]
    emailId: any[]
  }
  
  export interface RoomRate {
    _id: string
    rateType: string
    packageType: string
    roomId: RoomId
    hotelId: string
    startDate: string
    endDate: string
    basePrice: number
    netRate: number
    freeChildRate: number
    gstCalculations: string
    paidChildRatewithExtraMatress: number
    paidChildRatewithoutExtraMatress: number
    extraAdultRateWithExtraMatress: number
    extraAdultRateWithoutExtraMatress: number
    haveWelcomeDrink: boolean
    minRooms: number
    additionalRules: string
    breakfastIncluded: boolean
    welcomeDrinkPaid: boolean
    ac: boolean
    nonac: boolean
    roomCount: number
    status: string
    created_at: string
    updated_at: string
    __v: number
  }
  
  export interface RoomId {
    _id: string
    roomCategory: RoomCategory
    roomsDisplayName: string
    totalRooms: number
    roomImage: string
  }
  
  export interface RoomCategory {
    _id: string
  }

  export class Facilities {
    indoorGames: boolean
    roomService: boolean
    elivatorOrLift: boolean
    paidAirportTransfer: boolean
    kidsPlayArea: boolean
    dinningArea: boolean
    cctv: boolean
    activityCenter: boolean
    lugggeStorage: boolean
    nonSmokingRooms: boolean
    privateParking: boolean
    fireExtinguisher: boolean
    powerBackup: boolean
    bathRooms: boolean
    view: boolean
    restaurant: boolean
    concierge: boolean
    multilingualStaff: boolean
    doctorOnCall: boolean
    lounge: boolean
    reception: boolean
    balconyOrTerrace: boolean
    souvenirShop: boolean
    printer: boolean
    conference: boolean
    sportsCourt: boolean
    banquetHall: boolean
    outdoors: boolean
    mediaAndTechnology: boolean
    internet: boolean
    swimmingPool: boolean
    cafes: boolean
    businessCenter: boolean
    gameRoom: boolean
    sitoutArea: boolean
    bonfirePit: boolean
    picnicArea: boolean
    kidsMenu: boolean
    securityGuards: boolean
    barLounges: boolean
    meetingrooms: boolean
    outdoorArea: boolean
    parking: boolean
    general: boolean
    langagesSpoken: boolean
    barOrLounges: boolean
    fitness: boolean
    spa: boolean
    barbeque: boolean
    campFire: boolean
  }