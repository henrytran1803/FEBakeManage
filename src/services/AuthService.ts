// AuthService.ts
import {callApi} from "@/services/ApiService";
import {LoginData, User} from "@/types/Auth";
import {ApiResponse} from "@/types/ApiResponse";
import {WebSocketService} from "@/services/websocketService.ts";

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
    localStorage.setItem('auth', authData.user.roles.includes('ROLE_MANAGE') ? 'manage' : 'user');
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
    disconnectWebSocket();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('auth');
};

export const connectWebSocket = (token: string) => {
    const API_BASE_URL = import.meta.env.VITE_WS_URL;
    WebSocketService.getInstance().connect(token, API_BASE_URL);
};

export const disconnectWebSocket = () => {
    WebSocketService.getInstance().disconnect();
};

export const isWebSocketConnected = (): boolean => {
    const ws = WebSocketService.getInstance().getWebSocket();
    return ws !== null && ws.readyState === WebSocket.OPEN;
};