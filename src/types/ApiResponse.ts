// types/ApiResponse.ts
export interface ApiResponse<T> {
    success: boolean;
    errorcode: string | null;
    message: string | null;
    data: T;
}
