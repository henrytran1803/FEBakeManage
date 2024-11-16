// types/ApiResponse.ts
export interface ApiResponse<T> {
    success: boolean;
    message: string | null;
    errorcode: string | null;
    data: T;
}
