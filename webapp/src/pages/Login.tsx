import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

function Login() {
    const { login, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as { from?: string } | null)?.from || "/";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");
        try {
            await login(email, password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al iniciar sesión");
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-hero">
                <div className="auth-hero-ring" aria-hidden="true" />
                <div className="auth-hero-content">
                    <img src={logo} alt="" className="auth-hero-logo" />
                    <h1 className="auth-wordmark">RiftFolio</h1>
                    <p className="auth-tagline">Organiza y consulta tu colección de Riftbound en un solo sitio.</p>
                </div>
            </div>

            <div className="auth-panel">
                <form className="auth-form-wrap" onSubmit={handleSubmit}>
                    <p className="auth-eyebrow label">Bienvenido de nuevo</p>
                    <h2>Iniciar sesión</h2>
                    <p className="subtitle">Accede a tu colección</p>

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

                    <p className="auth-guest-link">
                        <Link to={from}>Seguir sin iniciar sesión</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;