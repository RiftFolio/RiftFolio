import type { AuthResponse } from "../types/auth";

const BASE_URL = "http://localhost:8080/api/auth";

async function parseErrorMessage(res: Response, fallback: string): Promise<string> {
    try {
        const data = await res.json();
        if (typeof data.message === "string") {
            return data.message;
        }
        const firstFieldError = Object.values(data)[0];
        if (typeof firstFieldError === "string") {
            return firstFieldError;
        }
    } catch {
        // el cuerpo no era JSON, usamos el mensaje por defecto
    }
    return fallback;
}

export async function registerUser(email: string, username: string, password: string): Promise<AuthResponse> {
    const res = await fetch(BASE_URL + "/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
    });

    if (!res.ok) {
        throw new Error(await parseErrorMessage(res, "Error al registrar la cuenta"));
    }

    return res.json();
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(BASE_URL + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        throw new Error(await parseErrorMessage(res, "Credenciales inválidas"));
    }

    return res.json();
}
