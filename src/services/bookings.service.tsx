import { Booking } from "@/types/booking";
import { environment } from "../../environment";
import apiClient from "../config/axios";
import { BookingRequest, BookingResponse } from "../models/bookings.models";
import { ApiResponse } from "../models/common.models";

class BookingsService {
    private apiUrl = environment.apiUrl;

    async createBooking(bookingRequest: BookingRequest): Promise<ApiResponse<BookingResponse>> {
        const response = await apiClient.post<ApiResponse<BookingResponse>>(`${this.apiUrl}booking/create`, bookingRequest);
        return response.data;
    }
}

export default new BookingsService();