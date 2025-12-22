import { useEffect, useState } from "react";
import CreatePostCard from "../createPostCard/CreatePostCard";
import PostList from "../PostList/PostList";
import { getPosts, createPost } from "../../services/post/post.api";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getPosts();
      setPosts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (payload) => {
    console.log('payload', payload); 
    const created = await createPost(payload);
    setPosts((prev) => [created, ...prev]);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>Publicaciones</h2>

        <CreatePostCard onCreate={handleCreate} />

        <div style={{ height: 16 }} />

        {loading ? (
          <p style={{ color: "#cbd5e1" }}>Cargando...</p>
        ) : (
          <PostList posts={posts} />
        )}
      </div>
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
