
import { environment } from "../../environment";
import apiClient from "../config/axios";
import { Booking, BookingRequest, BookingResponse, GetBookingsListPayload, Reservation } from "../models/bookings.models";
import { ApiResponse } from "../models/common.models";

class BookingsService {
    private apiUrl = environment.apiUrl;

    async createBooking(bookingRequest: BookingRequest): Promise<ApiResponse<BookingResponse>> {
        const response = await apiClient.post<ApiResponse<BookingResponse>>(`${this.apiUrl}booking/create`, bookingRequest);
        return response.data;
    }

    async getBookingsList(payload: GetBookingsListPayload): Promise<ApiResponse<Booking[]>> {
        const response = await apiClient.post<ApiResponse<Booking[]>>(`${this.apiUrl}booking/list`, payload);
        return response.data;
    }

    async getBookingById(id: string): Promise<ApiResponse<Reservation>> {
        const response = await apiClient.get<ApiResponse<Reservation>>(`${this.apiUrl}reservation/${id}`);
        return response.data;
    }
}

export default new BookingsService();