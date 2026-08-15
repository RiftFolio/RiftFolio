import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
    const { register, loading } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }
        if (password.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres");
            return;
        }

        try {
            await register(email, username, password);
            navigate("/");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al registrar la cuenta");
        }
    }

    return (
        <div className="auth-shell">
            <form className="auth-card" onSubmit={handleSubmit}>
                <h2>Crear cuenta</h2>
                <p className="subtitle">Empieza a organizar tu colección</p>

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
                    <span>Nombre de usuario</span>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        minLength={3}
                        maxLength={50}
                        autoComplete="username"
                    />
                </label>

                <label className="auth-field">
                    <span>Contraseña</span>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        autoComplete="new-password"
                    />
                </label>

                <label className="auth-field">
                    <span>Confirmar contraseña</span>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={8}
                        autoComplete="new-password"
                    />
                </label>

                {error && <p className="auth-error">{error}</p>}

                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? "Creando cuenta…" : "Crear cuenta"}
                </button>

                <p className="auth-switch">
                    ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
                </p>
            </form>
        </div>
    );
}

export default Register;
