import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
    const { login, loading } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");
        try {
            await login(email, password);
            navigate("/");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al iniciar sesión");
        }
    }

    return (
        <div className="auth-shell">
            <form className="auth-card" onSubmit={handleSubmit}>
                <h2>Iniciar sesión</h2>
                <p className="subtitle">Accede a tu colección de RiftFolio</p>

                <label className="auth-field">
                    <span>Email</span>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                    />
                </label>

                <label className="auth-field">
                    <span>Contraseña</span>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                    />
                </label>

                {error && <p className="auth-error">{error}</p>}

                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? "Entrando…" : "Entrar"}
                </button>

                <p className="auth-switch">
                    ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
                </p>
            </form>
        </div>
    );
}

export default Login;
