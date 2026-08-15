export interface AuthUser {
    userId: string;
    email: string;
    username: string;
}

export interface AuthResponse {
    token: string;
    userId: string;
    email: string;
    username: string;
}
