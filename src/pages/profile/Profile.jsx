import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../services/user/user.api";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const userId = localStorage.getItem("user_id");
        if (!userId) throw new Error("No hay user_id en localStorage");

        const data = await getUser(userId);
        data.birthdate = new Date(data.birthdate).toLocaleDateString("es-CO", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
        setUser(data);
      } catch (e) {
        setError(e?.message || "Error cargando perfil");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const initials = (user?.alias || user?.name || "U").slice(0, 1).toUpperCase();

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={() => navigate("/dashboard")}>
            ← Volver
          </button>

          <h2 style={styles.title}>Mi perfil</h2>

          <button style={styles.logoutBtn} onClick={logout}>
            Cerrar sesión
          </button>
        </div>

        {loading ? (
          <p style={{ color: "#cbd5e1" }}>Cargando...</p>
        ) : error ? (
          <div style={styles.error}>{error}</div>
        ) : (
          <div style={styles.card}>
            <div style={styles.top}>
              <div style={styles.avatar}>{initials}</div>

              <div style={{ flex: 1 }}>
                <div style={styles.nameRow}>
                  <div style={styles.name}>
                    {user?.name} {user?.lastname}
                  </div>
                  <div style={styles.alias}>@{user?.alias}</div>
                </div>

                <div style={styles.email}>{user?.email}</div>

                {/* Si en tu backend llega role, úsalo. Si no, quita esto */}
                {user?.role?.name || user?.roleName ? (
                  <div style={styles.badge}>
                    {(user?.role?.name || user?.roleName).toUpperCase()}
                  </div>
                ) : null}
              </div>
            </div>

            <div style={styles.divider} />

            <div style={styles.grid}>
              <Info label="ID" value={user?.id} />
              <Info label="Alias" value={user?.alias} />
              <Info label="Email" value={user?.email} />
              <Info label="Fecha de nacimiento" value={user?.birthdate} />
              <Info
                label="Creado"
                value={user?.created ? new Date(user.created).toLocaleString() : "-"}
              />
              <Info
                label="Actualizado"
                value={user?.updated ? new Date(user.updated).toLocaleString() : "-"}
              />
            </div>

            <div style={{ height: 14 }} />

            <button
              style={styles.primaryBtn}
              onClick={() => alert("Aquí puedes implementar Editar perfil")}
            >
              Editar perfil (pendiente)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div style={styles.infoBox}>
      <div style={styles.infoLabel}>{label}</div>
      <div style={styles.infoValue}>{value ?? "-"}</div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, #0b1220 0%, #060b14 60%, #050812 100%)",
    padding: "28px 16px",
  },
  container: { maxWidth: 860, margin: "0 auto" },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 10,
  },
  title: { color: "white", fontSize: 22, fontWeight: 800, margin: 0 },

  backBtn: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.18)",
    color: "#e5e7eb",
    padding: "10px 12px",
    borderRadius: 12,
    cursor: "pointer",
  },
  logoutBtn: {
    background: "rgba(239,68,68,0.12)",
    border: "1px solid rgba(239,68,68,0.35)",
    color: "#fecaca",
    padding: "10px 12px",
    borderRadius: 12,
    cursor: "pointer",
  },

  card: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 18,
    padding: 18,
    color: "white",
    backdropFilter: "blur(8px)",
  },

  top: { display: "flex", gap: 14, alignItems: "center" },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: "rgba(59,130,246,0.25)",
    border: "1px solid rgba(59,130,246,0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    fontWeight: 900,
    color: "white",
  },

  nameRow: { display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" },
  name: { fontSize: 18, fontWeight: 800 },
  alias: { fontSize: 14, color: "#93c5fd" },
  email: { marginTop: 4, color: "#cbd5e1", fontSize: 14 },

  badge: {
    display: "inline-block",
    marginTop: 10,
    fontSize: 12,
    padding: "4px 10px",
    borderRadius: 999,
    background: "rgba(59,130,246,0.2)",
    border: "1px solid rgba(59,130,246,0.35)",
    color: "#dbeafe",
    fontWeight: 700,
  },

  divider: {
    height: 1,
    background: "rgba(255,255,255,0.12)",
    margin: "16px 0",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 12,
  },

  infoBox: {
    background: "rgba(3,7,18,0.45)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 14,
    padding: 12,
  },
  infoLabel: { fontSize: 12, color: "#94a3b8", marginBottom: 6 },
  infoValue: { fontSize: 14, color: "#e5e7eb", fontWeight: 600 },

  primaryBtn: {
    width: "100%",
    border: "none",
    borderRadius: 12,
    padding: 12,
    background: "rgb(59,130,246)",
    color: "white",
    fontWeight: 800,
    cursor: "pointer",
  },

  error: {
    background: "rgba(239,68,68,0.15)",
    border: "1px solid rgba(239,68,68,0.4)",
    padding: 12,
    borderRadius: 12,
    color: "#fecaca",
    fontSize: 14,
  },
};
