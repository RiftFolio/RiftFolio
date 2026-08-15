import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { AuthUser } from "../types/auth";
import { loginUser, registerUser } from "../services/authService";

interface AuthContextValue {
    user: AuthUser | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, username: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function loadStoredUser(): AuthUser | null {
    const raw = localStorage.getItem("riftfolio_user");
    if (!raw) return null;
    try {
        return JSON.parse(raw) as AuthUser;
    } catch {
        return null;
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(localStorage.getItem("riftfolio_token"));
    const [user, setUser] = useState<AuthUser | null>(loadStoredUser());
    const [loading, setLoading] = useState(false);

    function persist(newToken: string, newUser: AuthUser) {
        localStorage.setItem("riftfolio_token", newToken);
        localStorage.setItem("riftfolio_user", JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    }

    async function login(email: string, password: string) {
        setLoading(true);
        try {
            const response = await loginUser(email, password);
            persist(response.token, {
                userId: response.userId,
                email: response.email,
                username: response.username,
            });
        } finally {
            setLoading(false);
        }
    }

    async function register(email: string, username: string, password: string) {
        setLoading(true);
        try {
            const response = await registerUser(email, username, password);
            persist(response.token, {
                userId: response.userId,
                email: response.email,
                username: response.username,
            });
        } finally {
            setLoading(false);
        }
    }

    function logout() {
        localStorage.removeItem("riftfolio_token");
        localStorage.removeItem("riftfolio_user");
        setToken(null);
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }
    return context;
}
