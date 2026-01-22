import { DateFilter } from "./common.models"

export class GetRoomsListPayload {
    hotelId: string
    dateFilter?: DateFilter
    packageType?: string
    showRoomsWithRate: boolean
}

export class Room {
    _id: string
    hotelId: string
    roomCategory: RoomCategory
    roomsDisplayName: string
    roomView: string
    bedView: string
    totalRooms: number
    roomSize: RoomSize
    viewType: string
    infantAge: string
    childAge: string
    minRoomsForGroupBooking: number
    roomImage: string
    roomAdditionalImages: string[]
    minAdults: number
    maxAdults: number
    totalOccupency: number
    maxChilds: number
    totalExtraPersons: number
    gstForFoodAndBeverages: boolean
    drinkType: string
    isCake: boolean
    cakeRate: number
    isFruitBasketIncluded: boolean
    isBBQGrillIncluded: boolean
    cookAndButlerServiceIncluded: boolean
    honeyMoonInclusion: boolean
    fruitBasketRate: number
    bbqGrillRate: number
    cookAndButlerServiceRate: number
    lunchRate: number
    dinnerRate: number
    breakfastRate: number
    snacksRate: number
    honeyMoonRate: number
    breakfastMenus: any[]
    lunchMenus: any[]
    snacksMenus: any[]
    dinnerMenus: any[]
    state: string
    country: string
    selectedGSTRate: number
    totalFloor: number
    totalTable: number
    restaurentNames: any[]
    youtubeLink: string
    status: string
    created_at: string
    updated_at: string
    __v: number
    extraAdults: number
    pricing: Pricing[]
  }
  
  export interface RoomCategory {
    _id: string
    status: string
    category_name: string
    created_at: string
    updated_at: string
    __v: number
  }
  
  export interface RoomSize {
    roomLength: number
    roomWidth: number
    area: number
  }
  
  export interface Pricing {
    _id: string
    rateType: string
    packageType: string
    roomId: string
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


  export class RoomDetailsResponse {
    status: boolean
    msg: string
    data: Room
    facilities: Facility[]
    package: Package[]
    allRooms: AllRoom[]
  }
  

  export interface RoomSize {
    roomLength: number
    roomWidth: number
    area: number
  }
  
  export interface RoomCategory {
    _id: string
    status: string
    category_name: string
    created_at: string
    updated_at: string
    __v: number
  }
  
  export interface Facility {
    _id: string
    roomId: string
    hotelId: string
    facilityId: FacilityId
    name: string
    facilityType: string
    isSelected: boolean
    status: string
    __v: number
    created_at: string
    updated_at: string
  }
  
  export interface FacilityId {
    _id: string
    facilityType: string
    status: string
    name: string
    facilityCategory: string
    created_at: string
    updated_at: string
    __v: number
  }
  
  export interface Package {
    _id: string
    rateType: string
    packageType: string
    roomId: string
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
  
  export interface AllRoom {
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
  

  export class GetRoomByIdPayload{
    hotelId: string
    roomId: string
    dateFilter: DateFilter
    packageType: string
    showRoomsWithRate: boolean
  }