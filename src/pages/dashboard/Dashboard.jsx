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
      {/* Avatar global */}
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
            <div style={{ ...styles.item, color: "#f87171" }} onClick={logout}>
              🚪 Cerrar sesión
            </div>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div style={styles.container}>
        <h2 style={styles.title}>Publicaciones</h2>
        <CreatePostCard onCreate={handleCreate} />
        <PostList posts={posts} />
      </div>
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
    position: "fixed", // ⬅️ CLAVE
    top: 20,
    right: 20,
    zIndex: 1000,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #e5e7eb, #e5e7eb)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    userSelect: "none",
    fontSize: 18,
  },

  dropdown: {
    position: "absolute",
    top: 50,
    right: 0,
    background: "rgba(15,23,42,0.95)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 12,
    minWidth: 160,
    overflow: "hidden",
  },

  item: {
    padding: "10px 14px",
    cursor: "pointer",
    color: "#e5e7eb",
    fontSize: 14,
  },
};
