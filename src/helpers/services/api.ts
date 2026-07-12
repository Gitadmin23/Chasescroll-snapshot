// api.ts 
import httpService, { unsecureHttpService } from "./httpService";

// Generic type for API response
export type ApiResponse<T> = {
    data: T; // Actual data
    success: boolean; // Example of additional metadata
};

export const fetchUnsecureData = async <T>(endpoint: string): Promise<T> => {
    const response: any = await unsecureHttpService.get<ApiResponse<T>>(endpoint); 
    return response.data?.data; // Extracting only the `data` field
}; 

export const fetchSecureData = async <T>(endpoint: string, params?: any): Promise<T> => {
    const response: any = await httpService.get<ApiResponse<T>>(endpoint, {
        params: params
    });
    return response?.data; // Extracting only the `data` field
};
