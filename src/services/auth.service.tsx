import apiClient from "@/config/axios";
import { LoginPayload, SignupPayload, User, VerifyEmailPayload, VerifyEmailResponse } from "@/models/auth.models";
import { ApiResponse } from "@/models/common.models";
import { environment } from "../../environment";

export class AuthService {
    private apiUrl = environment.apiUrl;

    async login(payload: LoginPayload): Promise<ApiResponse<any>> {
        const response = await apiClient.post<ApiResponse<any>>(`${this.apiUrl}customer/login`, payload);
        return response.data;
    }

    async signup(payload: SignupPayload): Promise<ApiResponse<any>> {
        const response = await apiClient.post<ApiResponse<any>>(`${this.apiUrl}customer/register`, payload);
        return response.data;
    }

    async verifyEmail(payload: VerifyEmailPayload): Promise<VerifyEmailResponse> {
        const response = await apiClient.post<VerifyEmailResponse>(`${this.apiUrl}customer/verify/email`, payload);
        return response.data;
    }

    static getUser(): User {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    }

    static isLoggedIn(): boolean {
        const user = this.getUser();
        return user ? true : false;
    }

    static logout(): void {
        localStorage.removeItem("user");
    }

    static getUserName(): string {
        const user = this.getUser();
        return user ? user.name : "";
    }

    static getUserPhone(): string {
        const user = this.getUser();
        return user ? user.phoneNumber : "";
    }

    static getUserId(): string {
        const user = this.getUser();
        return user ? user._id : "";
    }

    static getUserEmail(): string {
        const user = this.getUser();
        return user ? user.email : "";
    }
    
}
export const authService = new AuthService();