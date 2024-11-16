import axios, {AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig} from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Accept': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        if (!(config.data instanceof FormData)) {
            config.headers['Content-Type'] = 'application/json';
        }
        return config;
    },
    (error: any) => {
        return Promise.reject(error);
    }
);
export const callApi = async <T>(
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    data?: any,
    config?: AxiosRequestConfig
): Promise<T> => {
    try {
        const response: AxiosResponse<T> = await apiClient.request<T>({
            method,
            url,
            data,
            ...config,
        });
        return response.data;
    } catch (error: any) {
        throw error.response || error;
    }
};

export default apiClient;