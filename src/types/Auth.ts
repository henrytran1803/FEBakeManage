export interface User {
    id: number;
    email: string;
    roles: string[];
}

export interface LoginData {
    user: User;
    token: string;
}