import apiClient from "@/config/axios";
import { GetRoomByIdPayload, RoomDetailsResponse, GetRoomAvailabilityPayload, RoomAvailabilityResponse } from "@/models/room.models";
import { ApiResponse } from "@/models/common.models";
import { environment } from "../../environment";

class RoomService {
    private apiUrl = environment.apiUrl;

    async getRoomDetails(roomId: string): Promise<RoomDetailsResponse> {
        const response = await apiClient.post<RoomDetailsResponse>(`${this.apiUrl}room/details`, { roomId : roomId });
        return response.data;
    }

    async getRoomById(payload: GetRoomByIdPayload): Promise<RoomDetailsResponse> {
        const response = await apiClient.post<RoomDetailsResponse>(`${this.apiUrl}booking/rooms/details`, payload);
        return response.data;
    }

    async getRoomAvailability(payload: GetRoomAvailabilityPayload): Promise<RoomAvailabilityResponse> {
        const response = await apiClient.post<RoomAvailabilityResponse>(`${this.apiUrl}room-availability/calendar`, payload);
        return response.data;
    }
}
export const roomService = new RoomService();
