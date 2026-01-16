import { useState } from "react";
import { PostType } from "../../services/post/post";

export default function CreatePostCard({ onCreate }) {
  const [type, setType] = useState(PostType.TEXT); // text | image
  const [textContent, setTextContent] = useState("");
  const [caption, setCaption] = useState("");
  const [source, setSource] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    // valida
    if (type === PostType.TEXT && !textContent.trim()) return setError("Escribe algo.");
    if (type === PostType.IMAGE && !source) return setError("Selecciona una imagen.");

    setSubmitting(true);
    try {
      if (type === PostType.TEXT) {
        console.log(textContent.trim());
        
        await onCreate({
          authorId: Number(localStorage.getItem('user_id')),
          type: PostType.TEXT,
          textContent: textContent.trim(),
          caption: caption && caption.trim() || null,
        });
        setTextContent("");
        setCaption("");
      } else {
        await onCreate({
          authorId: Number(localStorage.getItem('user_id')),
          type: PostType.IMAGE,
          source: source,
          caption: caption.trim() || '',
        });

        setCaption("");
        setSource(null);
      }
    } catch (err) {      
      setError(err?.message || "Error creando el post");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.hTitle}>Publicar</span>

        <div style={styles.tabs}>
          <button
            type="button"
            onClick={() => setType(PostType.TEXT)}
            style={type === PostType.TEXT ? styles.tabActive : styles.tab}
          >
            Texto
          </button>
          <button
            type="button"
            onClick={() => setType(PostType.IMAGE)}
            style={type === PostType.IMAGE ? styles.tabActive : styles.tab}
          >
            Imagen
          </button>
        </div>
      </div>

      <form onSubmit={submit}>
        {type === PostType.TEXT ? (
          <textarea
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder="¿Qué estás pensando?"
            style={styles.textarea}
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSource(e.target.files?.[0] || null)}
              style={styles.file}
            />
            {source && (
              <div style={{ color: "#cbd5e1", fontSize: 13 }}>
                Seleccionado: <b>{source.name}</b>
              </div>
            )}
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Caption (opcional)"
              style={styles.input}
            />
          </div>
        )}

        {error && <div style={styles.error}>{error}</div>}

        <button disabled={submitting} style={styles.btn}>
          {submitting ? "Publicando..." : "Publicar"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  /* ====== PÁGINA ====== */
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, #0b1220 0%, #060b14 60%, #050812 100%)",
    padding: "28px 16px",
  },

  container: {
    maxWidth: 860,
    margin: "0 auto",
  },

  title: {
    color: "white",
    marginBottom: 14,
    fontSize: 22,
    fontWeight: 700,
    textAlign: "center",
  },

  /* ====== CARD PUBLICAR ====== */
  card: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 18,
    padding: 16,
    color: "white",
    backdropFilter: "blur(8px)",
    overflow: "hidden", // 🔑 evita que se salga contenido
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  hTitle: {
    fontWeight: 700,
    fontSize: 16,
  },

  tabs: {
    display: "flex",
    gap: 8,
  },

  tab: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "#cbd5e1",
    padding: "6px 10px",
    borderRadius: 10,
    cursor: "pointer",
  },

  tabActive: {
    background: "rgba(59,130,246,0.25)",
    border: "1px solid rgba(59,130,246,0.8)",
    color: "white",
    padding: "6px 10px",
    borderRadius: 10,
    cursor: "pointer",
  },

  /* ====== INPUTS ====== */
  textarea: {
    width: "100%",
    maxWidth: "100%",
    minHeight: 120,
    borderRadius: 12,
    padding: "12px 14px",
    resize: "vertical",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(3,7,18,0.6)",
    color: "white",
    outline: "none",
    marginBottom: 12,
    fontSize: 14,
    boxSizing: "border-box", // 🔑 CLAVE
  },

  input: {
    width: "100%",
    maxWidth: "100%",
    borderRadius: 12,
    padding: "12px 14px",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(3,7,18,0.6)",
    color: "white",
    outline: "none",
    marginBottom: 12,
    fontSize: 14,
    boxSizing: "border-box", // 🔑 CLAVE
  },

  file: {
    color: "#cbd5e1",
  },

  error: {
    background: "rgba(239,68,68,0.15)",
    border: "1px solid rgba(239,68,68,0.4)",
    padding: 10,
    borderRadius: 12,
    color: "#fecaca",
    marginBottom: 10,
    fontSize: 13,
  },

  btn: {
    width: "100%",
    border: "none",
    borderRadius: 12,
    padding: 12,
    background: "rgb(59,130,246)",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
  },
};
