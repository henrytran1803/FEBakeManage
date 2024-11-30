import {callApi} from "@/services/ApiService.ts";
import {LoginData, User} from "@/types/Auth.ts";
import {ApiResponse} from "@/types/ApiResponse.ts";

export const login = async (email: string, password: string): Promise<ApiResponse<LoginData>> => {
    try {
        const result = await callApi<ApiResponse<LoginData>>('post', '/api/auth/login', {
            email,
            password
        });

        if (result.success) {
            setAuthData(result.data);
        }
        console.log(result);
        return result;
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Login failed',
            errorcode: 'AUTH_ERROR',
            data: null as unknown as LoginData
        };
    }
};

const setAuthData = (authData: LoginData) => {
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', JSON.stringify(authData.user));
    localStorage.setItem('auth', authData.user.roles.includes('manage') ? 'MANAGE' : 'USER');
};
export const getAuthState = (): { isAuthenticated: boolean; user: User | null; token: string | null } => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    let user: User | null = null;

    try {
        user = userStr ? JSON.parse(userStr) as User : null;
    } catch (error) {
        console.error('Error parsing user data:', error);
    }

    return {
        isAuthenticated: !!token && !!user,
        user,
        token
    };
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('auth');
};

export const isTokenValid = (): boolean => {
    const { token } = getAuthState();
    if (!token) return false;

    try {
        const [, payload] = token.split('.');
        const decodedPayload = JSON.parse(atob(payload));
        const expirationTime = decodedPayload.exp * 1000;

        return Date.now() < expirationTime;
    } catch (error) {
        console.error('Error validating token:', error);
        return false;
    }
};
