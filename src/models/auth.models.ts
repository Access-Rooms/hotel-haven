export class LoginPayload {
    phoneNumber: string
    password: string
    guestid?: string
  }
  

  export class SignupPayload {
    phoneNumber: string
    name: string
    password: string
    email: string
    whatsappCountryCode: string
  }
  

  export class LoginResponse {
    status: boolean
    msg: string
    data: User
    token: string
  }
  
  export class User {
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
  