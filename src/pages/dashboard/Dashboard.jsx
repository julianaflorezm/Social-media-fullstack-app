import { useEffect, useState } from "react";
import CreatePostCard from "../createPostCard/CreatePostCard";
import PostList from "../PostList/PostList";
import { getPosts, createPost } from "../../services/post/post.api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

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
    const created = await createPost(payload);
    setPosts((prev) => [created, ...prev]);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>Publicaciones</h2>

        <div style={styles.avatarWrapper}>
          <div
            style={styles.avatar}
            onClick={() => setOpen((v) => !v)}
            title="Cuenta"
          >
            👤
          </div>

          {open && (
            <div style={styles.dropdown}>
              <div style={styles.item} onClick={() => navigate("/profile")}>
                👤 Mi perfil
              </div>
              <div
                style={{ ...styles.item, color: "#f87171" }}
                onClick={logout}
              >
                🚪 Cerrar sesión
              </div>
            </div>
          )}
        </div>
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
  page: {
    minHeight: "100vh",
    background: "radial-gradient(circle at top, #0b1220 0%, #060b14 60%, #050812 100%)",
    padding: "28px 16px",
  },

  container: { maxWidth: 860, margin: "0 auto" },

  // ✅ header “full width” pero dentro del maxWidth, con avatar absoluto a la derecha
  header: {
    maxWidth: 860,
    margin: "0 auto 18px",
    position: "relative",
    display: "flex",
    justifyContent: "center", // centra el título
    alignItems: "center",
    minHeight: 48,
  },

  // ✅ título centrado real
  title: { color: "white", fontSize: 22, fontWeight: 700, margin: 0 },

  // ✅ avatar queda SIEMPRE arriba derecha del header
  avatarWrapper: {
    position: "absolute",
    right: 0,
    top: "50%",
    transform: "translateY(-50%)",
  },

  avatar: {
    width: 38,
    height: 38,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #e5e7eb, #e5e7eb)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    
    cursor: "pointer",
    userSelect: "none",
  },

  dropdown: {
    position: "absolute",
    top: 46,
    right: 0,
    background: "rgba(15,23,42,0.95)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 12,
    overflow: "hidden",
    minWidth: 160,
    zIndex: 10,
  },

  item: {
    padding: "10px 14px",
    cursor: "pointer",
    color: "#e5e7eb",
    fontSize: 14,
  },
};

