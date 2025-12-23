import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/auth/auth.api";
import { createUser } from "../../services/user/user.api";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:8080";

function getTokenFromResponse(data) {
  return data?.access_token ?? data?.token ?? null;
}

export default function Login() {
  const navigate = useNavigate();

  // LOGIN
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // REGISTER (modal)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [regEmail, setRegEmail] = useState("");
  const [regName, setRegName] = useState("");
  const [regLastname, setRegLastname] = useState("");
  const [regAlias, setRegAlias] = useState("");
  const [regBirthdate, setRegBirthdate] = useState(new Date());
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regError, setRegError] = useState("");
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canLogin = useMemo(() => {
    return email.trim().length > 0 && password.trim().length > 0;
  }, [email, password]);

  const canRegister = useMemo(() => {
    return (
      regEmail.trim().length > 0 &&
      regPassword.trim().length >= 6 &&
      regConfirm.trim().length >= 6
    );
  }, [regEmail, regPassword, regConfirm]);

  function openRegister() {
    setError("");
    setIsRegisterOpen(true);
    // opcional: precargar el email
    setRegEmail(email);
  }

  function closeRegister() {
    setIsRegisterOpen(false);
  }

  async function handleLoginSubmit(e) {
    e.preventDefault();
    setError("");

    if (!canLogin) {
      setError("Ingresa tu email y contraseña.");
      return;
    }

    setLoading(true);
    try {
      const data = await login({ password, email });
      const token = getTokenFromResponse(data);

      if (!token) {
        throw new Error(
          "El backend no devolvió token. Ajusta la respuesta a { access_token }."
        );
      }
      localStorage.setItem("user_id", data.id);
      localStorage.setItem("access_token", token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.log("error login", err.message);

      if (err?.message == "USER_NOT_FOUND") {
        setError("Este usuario no existe, regístrese por favor");
      }
      // setError(err?.message ?? "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegisterSubmit(e) {
    e.preventDefault();
    setRegError("");

    if (!canRegister) {
      setRegError("Completa email y una contraseña.");
      return;
    }
    if (regPassword !== regConfirm) {
      setRegError("La contraseña y la confirmación no coinciden.");
      return;
    }

    setLoading(true);
    try {
      const data = await createUser({
        regEmail,
        regName,
        regLastname,
        regAlias,
        regBirthdate,
        regPassword,
      });
      const token = getTokenFromResponse(data);

      // Si tu register NO devuelve token, te dejo fallback:
      if (!token) {
        // 1) cerrar modal y autollenar login, para que inicie sesión manual
        closeRegister();
        setEmail(regEmail.trim());
        setRegName(regName);
        setRegLastname(regLastname);
        setRegAlias(regAlias);
        setPassword(regPassword);
        setRegError("Registro exitoso. Ahora inicia sesión.");
        return;
      }

      localStorage.setItem("access_token", token);
      closeRegister();
      navigate("/dashboard", { replace: true });
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
        <form onSubmit={handleLoginSubmit} style={styles.form}>
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
            disabled={!canLogin || loading}
            style={{
              ...styles.button,
              opacity: !canLogin || loading ? 0.7 : 1,
              cursor: !canLogin || loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        {/* Bloque inferior de registro */}
        <div style={styles.footer}>
          <span style={{ opacity: 0.9 }}>¿No tienes cuenta?</span>
          <button
            type="button"
            onClick={openRegister}
            style={styles.linkButton}
            disabled={loading}
          >
            Regístrate
          </button>
        </div>
      </div>

      {/* Modal de registro */}
      {isRegisterOpen && (
        <div style={styles.modalOverlay} onMouseDown={closeRegister}>
          <div
            style={styles.modalCard}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div style={styles.modalHeader}>
              <h2 style={{ margin: 6 }}>Crear cuenta</h2>
              <button
                type="button"
                onClick={closeRegister}
                style={styles.iconButton}
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} style={styles.modalBody}>
              <label style={styles.label}>
                Nombre
                <input
                  type="name"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Tu nombre"
                  autoComplete="name"
                  style={styles.input}
                  disabled={loading}
                  required
                />
              </label>
              <label style={styles.label}>
                Apellido
                <input
                  type="lasname"
                  value={regLastname}
                  onChange={(e) => setRegLastname(e.target.value)}
                  placeholder="Tu apellido"
                  autoComplete="lastname"
                  style={styles.input}
                  disabled={loading}
                  required
                />
              </label>
              <label style={styles.label}>
                Alias
                <input
                  type="alias"
                  value={regAlias}
                  onChange={(e) => setRegAlias(e.target.value)}
                  placeholder="Tu alias"
                  autoComplete="alias"
                  style={styles.input}
                  disabled={loading}
                  required
                />
              </label>
              <label style={styles.label}>
                Fecha de nacimiento
                <input
                  type="date"
                  value={regBirthdate}
                  onChange={(e) => setRegBirthdate(e.target.value)}
                  style={styles.input}
                  disabled={loading}
                  required
                />
              </label>

              <label style={styles.label}>
                Email
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
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
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  style={styles.input}
                  disabled={loading}
                  required
                  minLength={6}
                />
              </label>

              <label style={styles.label}>
                Confirmar contraseña
                <input
                  type="password"
                  value={regConfirm}
                  onChange={(e) => setRegConfirm(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  style={styles.input}
                  disabled={loading}
                  required
                  minLength={6}
                />
              </label>
              <div style={styles.modalFooter}>
                <button
                  type="submit"
                  disabled={!canRegister || loading}
                  style={{
                    ...styles.button,
                    opacity: !canRegister || loading ? 0.7 : 1,
                    cursor: !canRegister || loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? "Registrando..." : "Crear cuenta"}
                </button>
                <div style={{ textAlign: "center", marginTop: 8 }}>
                  {regError && <div style={styles.error}>{regError}</div>}
                </div>
              </div>
              <div style={{ textAlign: "center", marginTop: 8 }}>
                <button
                  type="button"
                  onClick={closeRegister}
                  style={styles.secondaryButton}
                  disabled={loading}
                >
                  Volver al login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
    maxWidth: 520,
    background: "#111a2e",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 18,
    padding: 26,
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
    color: "white",
  },
  title: { margin: 0, fontSize: 26, fontWeight: 800, textAlign: "center" },
  subtitle: {
    marginTop: 10,
    marginBottom: 18,
    opacity: 0.85,
    textAlign: "center",
  },
  form: { display: "grid", gap: 14 },
  label: { display: "grid", gap: 6, fontSize: 14 },
  input: {
    padding: "11px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    outline: "none",
    background: "rgba(255,255,255,0.06)",
    color: "white",
  },
  error: {
    padding: 10,
    borderRadius: 12,
    background: "rgba(239,68,68,0.12)",
    border: "1px solid rgba(239,68,68,0.35)",
    color: "#fecaca",
    fontSize: 14,
  },
  button: {
    marginTop: 6,
    padding: "11px 12px",
    borderRadius: 12,
    border: "none",
    background: "#3b82f6",
    color: "white",
    fontWeight: 800,
  },
  footer: {
    marginTop: 16,
    display: "flex",
    justifyContent: "center",
    gap: 8,
    alignItems: "center",
  },
  linkButton: {
    background: "transparent",
    border: "none",
    color: "#93c5fd",
    fontWeight: 800,
    cursor: "pointer",
    textDecoration: "underline",
  },
  modalCard: {
    width: "100%",
    maxWidth: 520,
    background: "rgba(15,23,42,0.92)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 18,
    boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
    maxHeight: "calc(100vh - 32px)", // 🔥 no se sale de pantalla
    overflow: "hidden", // para que el header/footer sticky funcionen
    display: "flex",
    flexDirection: "column",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginRight: 6,
    marginTop: 3,
  },
  modalBody: {
    padding: 18,
    overflowY: "auto", // 🔥 aquí scrollean los inputs
  },
  iconButton: {
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.06)",
    color: "white",
    borderRadius: 10,
    padding: "6px 10px",
    cursor: "pointer",
  },
  secondaryButton: {
    border: "none",
    background: "transparent",
    color: "rgba(255,255,255,0.85)",
    textDecoration: "underline",
    cursor: "pointer",
    fontWeight: 700,
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    overflowY: "auto", // 🔥 permite scroll si no cabe
  },
  modalFooter: {
    padding: 18,
    borderTop: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(15,23,42,0.95)",
    position: "sticky",
    bottom: 0,
  },
};
