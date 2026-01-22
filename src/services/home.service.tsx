import { GetHotelsListPayload, Hotel } from '@/models/home.models';
import { ApiResponse } from '@/models/common.models';
import apiClient from '@/config/axios';
import { environment } from '../../environment';
import { GetRoomsListPayload, Room } from '@/models/room.models';

class HomeService {
    private apiUrl = environment.apiUrl;

    async getHotelsList(payload: GetHotelsListPayload): Promise<ApiResponse<Hotel[]>> {
        const response = await apiClient.post<ApiResponse<Hotel[]>>(`${this.apiUrl}booking/hotels/list`, payload);
        return response.data;
    }

    async getRoomsList(payload: GetRoomsListPayload): Promise<ApiResponse<Room[]>> {
        const response = await apiClient.post<ApiResponse<Room[]>>(`${this.apiUrl}booking/rooms/list`, payload);
        return response.data;
    }

    async getHotelById(id: string): Promise<ApiResponse<Hotel>> {
        const response = await apiClient.get<ApiResponse<Hotel>>(`${this.apiUrl}vendor/hotel/view?id=${id}`);
        return response.data;
    }
}
export const homeService = new HomeService();
