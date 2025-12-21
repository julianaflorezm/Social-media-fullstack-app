import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = email.trim().length > 0 && password.trim().length > 0;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!canSubmit) {
      setError("Ingresa tu email y contraseña.");
      return;
    }

    setLoading(true);

    try {
      // Ajusta el endpoint según tu backend (ej: /auth/login, /auth/signin, etc.)
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        // Intentamos leer mensaje del backend
        let message = "Credenciales inválidas.";
        try {
          const data = await res.json();
          message = data?.message ?? message;
        } catch (_) {}
        throw new Error(message);
      }

      const data = await res.json();

      // Ajusta según tu respuesta real: token / access_token / jwt
      const token = data?.token;

      if (!token) {
        throw new Error("El backend no devolvió un token (access_token/token).");
      }

      localStorage.setItem("access_token", token);

      // Redirección simple
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err?.message ?? "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Iniciar sesión</h1>
        <p style={styles.subtitle}>Ingresa con tu email y contraseña</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tuemail@dominio.com"
              autoComplete="email"
              style={styles.input}
              disabled={loading}
              required
            />
          </label>

          <label style={styles.label}>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              style={styles.input}
              disabled={loading}
              required
            />
          </label>

          {error && <div style={styles.error}>{error}</div>}

          <button
            type="submit"
            disabled={!canSubmit || loading}
            style={{
              ...styles.button,
              opacity: !canSubmit || loading ? 0.7 : 1,
              cursor: !canSubmit || loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 16,
    background: "#0b1220",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    background: "#111a2e",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
    color: "white",
  },
  title: { margin: 0, fontSize: 24, fontWeight: 700 },
  subtitle: { marginTop: 8, marginBottom: 20, opacity: 0.8 },
  form: { display: "grid", gap: 14 },
  label: { display: "grid", gap: 6, fontSize: 14 },
  input: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    outline: "none",
    background: "rgba(255,255,255,0.06)",
    color: "white",
  },
  error: {
    padding: 10,
    borderRadius: 10,
    background: "rgba(239,68,68,0.12)",
    border: "1px solid rgba(239,68,68,0.35)",
    color: "#fecaca",
    fontSize: 14,
  },
  button: {
    marginTop: 6,
    padding: "10px 12px",
    borderRadius: 10,
    border: "none",
    background: "#3b82f6",
    color: "white",
    fontWeight: 700,
  },
};
