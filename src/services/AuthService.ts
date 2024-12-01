// AuthService.ts
import {callApi} from "@/services/ApiService";
import {LoginData, User} from "@/types/Auth";
import {ApiResponse} from "@/types/ApiResponse";
import {toast} from "@/hooks/use-toast.ts";
let websocket: WebSocket | null = null;

export const login = async (email: string, password: string): Promise<ApiResponse<LoginData>> => {
    try {
        const result = await callApi<ApiResponse<LoginData>>('post', '/api/auth/login', {
            email,
            password
        });

        if (result.success) {
            setAuthData(result.data);
            connectWebSocket(result.data.token);

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
    disconnectWebSocket();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('auth');
};

const connectWebSocket = (token: string) => {
    const API_BASE_URL = import.meta.env.VITE_WS_URL;

    const wsUrl = `ws://${API_BASE_URL}/websocket?token=${token}`;
    console.log(wsUrl)
    websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
        console.log('WebSocket connected');
    };

    websocket.onmessage = (event) => {
        console.log("WebSocket message received:", event.data);

        try {
            // Parse JSON message
            const message = JSON.parse(event.data);
            const { type, message: content, severity, duration } = message;

            // Map severity to toast variants
            const severityMap: Record<string, "default" | "destructive" | null | undefined> = {
                SUCCESS: "default",
                INFO: "default",
                WARNING: "default",
                ERROR: "destructive",
            };

            // Display toast notification
            toast({
                title: type,
                description: content,
                variant: severityMap[severity] || "default", // Default to "default" if severity is unknown
                duration: duration || 3000, // Default duration
            });
        } catch (error) {
            console.error("Error processing WebSocket message:", error);
        }
    };

    websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    websocket.onclose = () => {
        console.log('WebSocket disconnected');
    };
};

const disconnectWebSocket = () => {
    if (websocket) {
        websocket.close();
        websocket = null;
    }
};